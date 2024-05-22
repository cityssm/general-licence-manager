import path from 'node:path'

import * as dateTimeFns from '@cityssm/expressjs-server-js/dateTimeFns.js'
import * as htmlFns from '@cityssm/expressjs-server-js/htmlFns.js'
import * as stringFns from '@cityssm/expressjs-server-js/stringFns.js'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import debug from 'debug'
import express from 'express'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import createError from 'http-errors'
import FileStore from 'session-file-store'

import * as databaseInitializer from './helpers/databaseInitializer.js'
import * as configFunctions from './helpers/functions.config.js'
import routerAdmin from './routes/admin.js'
import routerBatches from './routes/batches.js'
import routerDashboard from './routes/dashboard.js'
import routerLicences from './routes/licences.js'
import routerLogin from './routes/login.js'
import routerReports from './routes/reports.js'
import { version } from './version.js'

const debugApp = debug('general-licence-manager:app')

/*
 * INITALIZE THE DATABASE
 */

databaseInitializer.initLicencesDB()

/*
 * INITIALIZE APP
 */

export const app = express()

if (!configFunctions.getProperty('reverseProxy.disableEtag')) {
  app.set('etag', false)
}

// View engine setup
app.set('views', path.join('views'))
app.set('view engine', 'ejs')

if (!configFunctions.getProperty('reverseProxy.disableCompression')) {
  app.use(compression())
}

app.use((request, _response, next) => {
  debugApp(`${request.method} ${request.url}`)
  next()
})

app.use(express.json())

app.use(
  express.urlencoded({
    extended: false
  })
)

app.use(cookieParser())
app.use(csurf({ cookie: true }))

/*
 * Rate Limiter
 */

const limiter = rateLimit({
  windowMs: 1000,
  max: 25 * Math.max(3, configFunctions.getProperty('users.canLogin').length)
})

app.use(limiter)

/*
 * STATIC ROUTES
 */

const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix')

if (urlPrefix !== '') {
  debugApp('urlPrefix = ' + urlPrefix)
}

app.use(urlPrefix, express.static(path.join('public')))

app.use(
  urlPrefix + '/lib/fa',
  express.static(path.join('node_modules', '@fortawesome', 'fontawesome-free'))
)

app.use(
  urlPrefix + '/lib/cityssm-bulma-webapp-js',
  express.static(path.join('node_modules', '@cityssm', 'bulma-webapp-js'))
)

app.use(
  urlPrefix + '/lib/cityssm-bulma-js',
  express.static(path.join('node_modules', '@cityssm', 'bulma-js', 'dist'))
)

/*
 * SESSION MANAGEMENT
 */

const sessionCookieName: string =
  configFunctions.getProperty('session.cookieName')

const FileStoreSession = FileStore(session)

// Initialize session
app.use(
  session({
    store: new FileStoreSession({
      path: './data/sessions',
      logFn: debug('general-licence-manager:session'),
      retries: 20
    }),
    name: sessionCookieName,
    secret: configFunctions.getProperty('session.secret'),
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: configFunctions.getProperty('session.maxAgeMillis'),
      sameSite: 'strict'
    }
  })
)

// Clear cookie if no corresponding session
app.use((request, response, next) => {
  if (request.cookies[sessionCookieName] && !request.session.user) {
    response.clearCookie(sessionCookieName)
  }

  next()
})

// Redirect logged in users
function sessionChecker(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void {
  if (request.session.user && request.cookies[sessionCookieName]) {
    next()
    return
  }

  response.redirect(`${urlPrefix}/login?redirect=${request.originalUrl}`)
}

/*
 * ROUTES
 */

// Make the user and config objects available to the templates

app.use((request, response, next) => {
  response.locals.buildNumber = version

  response.locals.user = request.session.user
  response.locals.csrfToken = request.csrfToken()

  response.locals.configFunctions = configFunctions
  response.locals.dateTimeFns = dateTimeFns
  response.locals.stringFns = stringFns
  response.locals.htmlFns = htmlFns

  response.locals.urlPrefix = configFunctions.getProperty(
    'reverseProxy.urlPrefix'
  )

  next()
})

app.get(`${urlPrefix}/`, sessionChecker, (_request, response) => {
  response.redirect(`${urlPrefix}/dashboard`)
})

app.use(`${urlPrefix}/dashboard`, sessionChecker, routerDashboard)
app.use(`${urlPrefix}/licences`, sessionChecker, routerLicences)

if (configFunctions.getProperty('settings.includeBatches')) {
  app.use(`${urlPrefix}/batches`, sessionChecker, routerBatches)
}

app.use(`${urlPrefix}/reports`, sessionChecker, routerReports)
app.use(`${urlPrefix}/admin`, sessionChecker, routerAdmin)

app.all(`${urlPrefix}/keepAlive`, (_request, response) => {
  response.json(true)
})

app.use(`${urlPrefix}/login`, routerLogin)

app.get(`${urlPrefix}/logout`, (request, response) => {
  if (request.session.user && request.cookies[sessionCookieName]) {
    // eslint-disable-next-line unicorn/no-null
    request.session.destroy(() => {
      response.clearCookie(sessionCookieName)
      response.redirect(`${urlPrefix}/`)
    })
  } else {
    response.redirect(`${urlPrefix}/login`)
  }
})

// Catch 404 and forward to error handler
app.use((_request, _response, next) => {
  next(createError(404))
})

// Error handler
app.use(
  (
    error: { status: number; message: string },
    request: express.Request,
    response: express.Response
  ) => {
    // Set locals, only providing error in development
    response.locals.message = error.message
    response.locals.error =
      request.app.get('env') === 'development' ? error : {}

    // Render the error page
    response.status(error.status || 500)
    response.render('error')
  }
)

export default app

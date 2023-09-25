import { Router } from 'express'

import Debug from 'debug'

import * as configFunctions from '../helpers/functions.config.js'

import * as authenticationFunctions from '../helpers/functions.authentication.js'

import { useTestDatabases } from '../data/databasePaths.js'

import type * as recordTypes from '../types/recordTypes'

const debug = Debug('general-licence-manager:login')

export const router = Router()

const getSafeRedirectURL = (possibleRedirectURL = '') => {
  const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix')

  const urlToCheck = (
    possibleRedirectURL.startsWith(urlPrefix)
      ? possibleRedirectURL.slice(urlPrefix.length)
      : possibleRedirectURL
  ).toLowerCase()

  switch (urlToCheck) {
    case '/admin/cleanup':
    case '/admin/licenceCategories':
    case '/admin/yearEnd':
    case '/licences':
    case '/reports':
      return urlPrefix + urlToCheck
  }

  return urlPrefix + '/dashboard'
}

router
  .route('/')
  .get((request, response) => {
    const sessionCookieName = configFunctions.getProperty('session.cookieName')

    if (request.session.user && request.cookies[sessionCookieName]) {
      const redirectURL = getSafeRedirectURL(
        (request.query.redirect || '') as string
      )

      response.redirect(redirectURL)
    } else {
      response.render('login', {
        userName: '',
        message: '',
        redirect: request.query.redirect,
        useTestDatabases
      })
    }
  })
  .post(async (request, response) => {
    const userName = request.body.userName as string
    const passwordPlain = request.body.password as string

    const redirectURL = getSafeRedirectURL(request.body.redirect)

    let isAuthenticated = false

    if (userName.charAt(0) === '*') {
      if (useTestDatabases && userName === passwordPlain) {
        isAuthenticated = configFunctions
          .getProperty('users.testing')
          .includes(userName)

        if (isAuthenticated) {
          debug('Authenticated testing user: ' + userName)
        }
      }
    } else {
      isAuthenticated = await authenticationFunctions.authenticate(
        userName,
        passwordPlain
      )
    }

    let userObject: recordTypes.User

    if (isAuthenticated) {
      const userNameLowerCase = userName.toLowerCase()

      const canLogin = configFunctions
        .getProperty('users.canLogin')
        .some((currentUserName) => {
          return userNameLowerCase === currentUserName.toLowerCase()
        })

      if (canLogin) {
        const canUpdate = configFunctions
          .getProperty('users.canUpdate')
          .some((currentUserName) => {
            return userNameLowerCase === currentUserName.toLowerCase()
          })

        const isAdmin = configFunctions
          .getProperty('users.isAdmin')
          .some((currentUserName) => {
            return userNameLowerCase === currentUserName.toLowerCase()
          })

        userObject = {
          userName: userNameLowerCase,
          userProperties: {
            canUpdate,
            isAdmin
          }
        }
      }
    }

    if (isAuthenticated && userObject) {
      request.session.user = userObject

      response.redirect(redirectURL)
    } else {
      response.render('login', {
        userName,
        message: 'Login Failed',
        redirect: redirectURL,
        useTestDatabases
      })
    }
  })

export default router

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable n/no-process-exit, unicorn/no-process-exit */

import http from 'node:http'

import Debug from 'debug'
import exitHook from 'exit-hook'

import { app } from '../app.js'
import { getConfigProperty } from '../helpers/functions.config.js'

const debug = Debug('general-licence-manager:www')

interface ServerError extends Error {
  syscall: string
  code: string
}

function onError(error: ServerError): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    // eslint-disable-next-line no-fallthrough
    case 'EACCES': {
      debug('Requires elevated privileges')
      process.exit(1)
      // break;
    }

    // eslint-disable-next-line no-fallthrough
    case 'EADDRINUSE': {
      debug('Port is already in use.')
      process.exit(1)
      // break;
    }

    // eslint-disable-next-line no-fallthrough
    default: {
      throw error
    }
  }
}

function onListening(server: http.Server): void {
  const addr = server.address()

  if (addr !== null) {
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port.toString()}`

    debug(`Listening on ${bind}`)
  }
}

/**
 * Initialize HTTP
 */

const httpPort = getConfigProperty('application.httpPort')

const httpServer = http.createServer(app)

httpServer.listen(httpPort)

httpServer.on('error', onError)
httpServer.on('listening', () => {
  onListening(httpServer)
})

debug(`HTTP listening on ${httpPort.toString()}`)

exitHook(() => {
  debug('Closing HTTP')
  httpServer.close()
})

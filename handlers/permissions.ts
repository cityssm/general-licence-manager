import type { RequestHandler, Response } from 'express'

import { getConfigProperty } from '../helpers/functions.config.js'
import * as userFunctions from '../helpers/functions.user.js'

const urlPrefix = getConfigProperty('reverseProxy.urlPrefix')

export const forbiddenJSON = (response: Response): Response => {
  return response.status(403).json({
    success: false,
    message: 'Forbidden'
  })
}

export const adminGetHandler: RequestHandler = (request, response, next) => {
  if (userFunctions.userIsAdmin(request)) {
    next()
    return
  }

  response.redirect(`${urlPrefix}/dashboard`)
}

export const adminPostHandler: RequestHandler = (request, response, next) => {
  if (userFunctions.userIsAdmin(request)) {
    next()
    return
  }

  response.json(forbiddenJSON)
}

export const updateGetHandler: RequestHandler = (request, response, next) => {
  if (userFunctions.userCanUpdate(request)) {
    next()
    return
  }

  response.redirect(`${urlPrefix}/dashboard`)
}

export const updatePostHandler: RequestHandler = (request, response, next) => {
  if (userFunctions.userCanUpdate(request)) {
    next()
    return
  }

  response.json(forbiddenJSON)
}

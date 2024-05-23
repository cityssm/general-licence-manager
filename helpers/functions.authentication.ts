/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/strict-boolean-expressions */

import { AdWebAuthConnector } from '@cityssm/ad-web-auth-connector'
import ActiveDirectory from 'activedirectory2'

import type { ConfigActiveDirectory } from '../types/configTypes.js'

import { getConfigProperty } from './functions.config.js'

const userDomain = getConfigProperty('application.userDomain')

const activeDirectoryConfig = getConfigProperty('activeDirectory')

async function authenticateViaActiveDirectory(
  userName: string,
  password: string
): Promise<boolean> {
  return await new Promise((resolve) => {
    try {
      const ad = new ActiveDirectory(
        activeDirectoryConfig as ConfigActiveDirectory
      )

      ad.authenticate(
        `${userDomain}\\${userName}`,
        password,
        async (error, auth) => {
          if (error) {
            resolve(false)
          }

          resolve(auth)
        }
      )
    } catch {
      resolve(false)
    }
  })
}

const adWebAuthConfig = getConfigProperty('adWebAuthConfig')
const adWebAuth =
  adWebAuthConfig === undefined
    ? undefined
    : new AdWebAuthConnector(adWebAuthConfig)

async function authenticateViaADWebAuth(
  userName: string,
  password: string
): Promise<boolean> {
  return (
    (await adWebAuth?.authenticate(`${userDomain}\\${userName}`, password)) ??
    false
  )
}

const authenticateFunction =
  activeDirectoryConfig === undefined
    ? authenticateViaADWebAuth
    : authenticateViaActiveDirectory

export const authenticate = async (
  userName: string,
  password: string
): Promise<boolean> => {
  if ((userName ?? '') === '' || (password ?? '') === '') {
    return false
  }

  return await authenticateFunction(userName, password)
}

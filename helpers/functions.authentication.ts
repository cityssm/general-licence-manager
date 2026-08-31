import {
  type ActiveDirectoryAuthenticatorConfiguration,
  ActiveDirectoryAuthenticator,
  ADWebAuthAuthenticator
} from '@cityssm/authentication-helper'

import { getConfigProperty } from './functions.config.js'

const userDomain = getConfigProperty('application.userDomain')

const activeDirectoryConfig = getConfigProperty('activeDirectory')

async function authenticateViaActiveDirectory(
  username: string,
  password: string
): Promise<boolean> {
  // eslint-disable-next-line promise/avoid-new, @typescript-eslint/no-misused-promises
  return await new Promise<boolean>(async (resolve) => {
    try {
      const ad = new ActiveDirectoryAuthenticator(
        activeDirectoryConfig as ActiveDirectoryAuthenticatorConfiguration
      )

      const success = await ad.authenticate(
        `${userDomain}\\${username}`,
        password
      )

      resolve(success)
    } catch {
      resolve(false)
    }
  })
}

const adWebAuthConfig = getConfigProperty('adWebAuthConfig')
const adWebAuth =
  adWebAuthConfig === undefined
    ? undefined
    : new ADWebAuthAuthenticator(adWebAuthConfig)

async function authenticateViaADWebAuth(
  username: string,
  password: string
): Promise<boolean> {
  return (
    (await adWebAuth?.authenticate(`${userDomain}\\${username}`, password)) ??
    false
  )
}

const authenticateFunction =
  activeDirectoryConfig === undefined
    ? authenticateViaADWebAuth
    : authenticateViaActiveDirectory

export const authenticate = async (
  username: string,
  password: string
): Promise<boolean> => {
  if (username === '' || password === '') {
    return false
  }

  return await authenticateFunction(username, password)
}

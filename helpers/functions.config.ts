// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { ADWebAuthConfig } from '@cityssm/ad-web-auth-connector/types.js'

import { config } from '../data/config.js'
import type * as configTypes from '../types/configTypes.js'

/*
 * SET UP FALLBACK VALUES
 */

const configFallbackValues = new Map<string, unknown>()

configFallbackValues.set(
  'application.applicationName',
  'General Licence Manager'
)
configFallbackValues.set('application.logoURL', '/images/stamp.png')
configFallbackValues.set('application.httpPort', 7000)
configFallbackValues.set('application.useTestDatabases', false)

configFallbackValues.set('reverseProxy.disableCompression', false)
configFallbackValues.set('reverseProxy.disableEtag', false)
configFallbackValues.set('reverseProxy.urlPrefix', '')

configFallbackValues.set(
  'session.cookieName',
  'general-licence-manager-user-sid'
)
configFallbackValues.set('session.secret', 'cityssm/general-licence-manager')
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000)
configFallbackValues.set('session.doKeepAlive', false)

configFallbackValues.set('users.testing', [])
configFallbackValues.set('users.canLogin', ['administrator'])
configFallbackValues.set('users.canUpdate', [])
configFallbackValues.set('users.isAdmin', ['administrator'])

configFallbackValues.set('defaults.licenceNumberFunction', 'year-fourDigits')
configFallbackValues.set('defaults.licenseeCity', '')
configFallbackValues.set('defaults.licenseeProvince', 'ON')

configFallbackValues.set('settings.licenceAlias', 'Licence')
configFallbackValues.set('settings.licenceAliasPlural', 'Licences')
configFallbackValues.set('settings.licenseeAlias', 'Licensee')
configFallbackValues.set('settings.licenseeAliasPlural', 'Licensees')
configFallbackValues.set('settings.renewalAlias', 'Renewal')
configFallbackValues.set('settings.includeRelated', true)
configFallbackValues.set('settings.includeBatches', false)
configFallbackValues.set('settings.includeReplacementFee', true)
configFallbackValues.set('settings.includeYearEnd', false)

configFallbackValues.set('licenceLengthFunctions', {})
configFallbackValues.set('additionalFeeFunctions', {})
configFallbackValues.set('customReports', [])

/*
 * Set up function overloads
 */

export function getProperty(propertyName: 'application.applicationName'): string
export function getProperty(propertyName: 'application.logoURL'): string
export function getProperty(propertyName: 'application.httpPort'): number
export function getProperty(propertyName: 'application.userDomain'): string
export function getProperty(
  propertyName: 'application.useTestDatabases'
): boolean

export function getProperty(
  propertyName: 'activeDirectory'
): configTypes.ConfigActiveDirectory | undefined

export function getProperty(
  propertyName: 'adWebAuthConfig'
): ADWebAuthConfig | undefined

export function getProperty(propertyName: 'users.testing'): string[]
export function getProperty(propertyName: 'users.canLogin'): string[]
export function getProperty(propertyName: 'users.canUpdate'): string[]
export function getProperty(propertyName: 'users.isAdmin'): string[]

export function getProperty(propertyName: 'defaults.licenseeCity'): string
export function getProperty(propertyName: 'defaults.licenseeProvince'): string
export function getProperty(
  propertyName: 'defaults.licenceNumberFunction'
): configTypes.LicenceNumberFunction

export function getProperty(propertyName: 'settings.licenceAlias'): string
export function getProperty(propertyName: 'settings.licenceAliasPlural'): string
export function getProperty(propertyName: 'settings.licenseeAlias'): string
export function getProperty(
  propertyName: 'settings.licenseeAliasPlural'
): string
export function getProperty(propertyName: 'settings.renewalAlias'): string
export function getProperty(propertyName: 'settings.includeRelated'): boolean
export function getProperty(propertyName: 'settings.includeBatches'): boolean
export function getProperty(
  propertyName: 'settings.includeReplacementFee'
): boolean
export function getProperty(propertyName: 'settings.includeYearEnd'): boolean

export function getProperty(
  propertyName: 'exports.batches'
): configTypes.ConfigBatchExport

export function getProperty(
  propertyName: 'licenceLengthFunctions'
): Record<string, configTypes.LicenceLengthFunction>

export function getProperty(
  propertyName: 'additionalFeeFunctions'
): Record<string, configTypes.AdditionalFeeFunction>

export function getProperty(
  propertyName: 'customReports'
): configTypes.ReportDefinition[]

export function getProperty(
  propertyName: 'reverseProxy.disableCompression'
): boolean
export function getProperty(propertyName: 'reverseProxy.disableEtag'): boolean
export function getProperty(propertyName: 'reverseProxy.urlPrefix'): string

export function getProperty(propertyName: 'session.cookieName'): string
export function getProperty(propertyName: 'session.doKeepAlive'): boolean
export function getProperty(propertyName: 'session.maxAgeMillis'): number
export function getProperty(propertyName: 'session.secret'): string

export function getProperty(propertyName: string): unknown {
  const propertyNameSplit = propertyName.split('.')

  let currentObject = config

  for (const propertyNamePiece of propertyNameSplit) {
    if (
      Object.prototype.hasOwnProperty.call(currentObject, propertyNamePiece)
    ) {
      currentObject = currentObject[propertyNamePiece]
      continue
    }

    return configFallbackValues.get(propertyName)
  }

  return currentObject
}

export const keepAliveMillis = getProperty('session.doKeepAlive')
  ? Math.max(
      getProperty('session.maxAgeMillis') / 2,
      getProperty('session.maxAgeMillis') - 10 * 60 * 1000
    )
  : 0

export function getLicenceLengthFunctionNames(): string[] {
  return Object.keys(getProperty('licenceLengthFunctions'))
}

export function getLicenceLengthFunction(
  licenceLengthFunctionName: string
): configTypes.LicenceLengthFunction {
  return getProperty('licenceLengthFunctions')[licenceLengthFunctionName]
}

export function getAdditionalFeeFunctionNames(): string[] {
  return Object.keys(getProperty('additionalFeeFunctions')) || []
}

export function getAdditionalFeeFunction(
  additionalFeeFunctionName: string
): configTypes.AdditionalFeeFunction {
  return getProperty('additionalFeeFunctions')[additionalFeeFunctionName]
}

export function getCustomReport(
  reportName: string
): configTypes.ReportDefinition {
  return getProperty('customReports').find((possibleReportDefinition) => {
    return possibleReportDefinition.reportName === reportName
  })
}

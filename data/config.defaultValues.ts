import type {
  ActiveDirectoryAuthenticatorConfiguration,
  ADWebAuthAuthenticatorConfiguration
} from '@cityssm/authentication-helper'

import type {
  AdditionalFeeFunction,
  ConfigBatchExport,
  LicenceLengthFunction,
  LicenceNumberFunction,
  ReportDefinition
} from '../types/configTypes.js'

export const configDefaultValues = {
  activeDirectory: undefined as
    ActiveDirectoryAuthenticatorConfiguration | undefined,
  adWebAuthConfig: undefined as ADWebAuthAuthenticatorConfiguration | undefined,

  'application.applicationName': 'General Licence Manager',
  'application.logoURL': '/images/stamp.png',
  'application.httpPort': 7000,
  'application.userDomain': '',
  'application.useTestDatabases': false,

  'reverseProxy.disableCompression': false,
  'reverseProxy.disableEtag': false,
  'reverseProxy.urlPrefix': '',

  'session.cookieName': 'general-licence-manager-user-sid',

  // eslint-disable-next-line secure-coding/no-hardcoded-credentials
  'session.secret': 'cityssm/general-licence-manager',
  
  'session.maxAgeMillis': 60 * 60 * 1000,
  'session.doKeepAlive': false,

  'users.testing': [] as string[],
  'users.canLogin': ['administrator'],
  'users.canUpdate': [] as string[],
  'users.isAdmin': ['administrator'],

  'defaults.licenceNumberFunction': 'year-fourDigits' as LicenceNumberFunction,
  'defaults.licenseeCity': '',
  'defaults.licenseeProvince': 'ON',

  'settings.licenceAlias': 'Licence',
  'settings.licenceAliasPlural': 'Licences',
  'settings.licenseeAlias': 'Licensee',
  'settings.licenseeAliasPlural': 'Licensees',
  'settings.renewalAlias': 'Renewal',
  'settings.includeRelated': true,
  'settings.includeBatches': false,
  'settings.includeReplacementFee': true,
  'settings.includeYearEnd': false,

  'exports.batches': undefined as unknown as ConfigBatchExport | undefined,

  licenceLengthFunctions: {} as unknown as Record<
    string,
    LicenceLengthFunction
  >,
  
  additionalFeeFunctions: {} as unknown as Record<
    string,
    AdditionalFeeFunction
  >,
  customReports: [] as ReportDefinition[]
}

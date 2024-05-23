export const configDefaultValues = {
    activeDirectory: undefined,
    adWebAuthConfig: undefined,
    'application.applicationName': 'General Licence Manager',
    'application.logoURL': '/images/stamp.png',
    'application.httpPort': 7000,
    'application.userDomain': '',
    'application.useTestDatabases': false,
    'reverseProxy.disableCompression': false,
    'reverseProxy.disableEtag': false,
    'reverseProxy.urlPrefix': '',
    'session.cookieName': 'general-licence-manager-user-sid',
    'session.secret': 'cityssm/general-licence-manager',
    'session.maxAgeMillis': 60 * 60 * 1000,
    'session.doKeepAlive': false,
    'users.testing': [],
    'users.canLogin': ['administrator'],
    'users.canUpdate': [],
    'users.isAdmin': ['administrator'],
    'defaults.licenceNumberFunction': 'year-fourDigits',
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
    'exports.batches': undefined,
    licenceLengthFunctions: {},
    additionalFeeFunctions: {},
    customReports: []
};
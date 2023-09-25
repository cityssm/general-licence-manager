import * as configFunctions from '../helpers/functions.config.js'

import Debug from 'debug'
const debug = Debug('general-licence-manager:databasePaths')

// Determine if test databases should be used

export const useTestDatabases =
  configFunctions.getProperty('application.useTestDatabases') ||
  process.env.TEST_DATABASES === 'true'

if (useTestDatabases) {
  debug('Using "-testing" databases.')
}

export const licencesDB_live = 'data/licences.db'
export const licencesDB_testing = 'data/licences-testing.db'

export const licencesDB = useTestDatabases
  ? licencesDB_testing
  : licencesDB_live

export const backupFolder = 'data/backups'

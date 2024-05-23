import Debug from 'debug';
import { getConfigProperty } from '../helpers/functions.config.js';
const debug = Debug('general-licence-manager:databasePaths');
export const useTestDatabases = getConfigProperty('application.useTestDatabases') ||
    process.env.TEST_DATABASES === 'true';
if (useTestDatabases) {
    debug('Using "-testing" databases.');
}
export const licencesDB_live = 'data/licences.db';
export const licencesDB_testing = 'data/licences-testing.db';
export const licencesDB = useTestDatabases
    ? licencesDB_testing
    : licencesDB_live;
export const backupFolder = 'data/backups';

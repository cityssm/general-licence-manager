import { ActiveDirectoryAuthenticator, ADWebAuthAuthenticator } from '@cityssm/authentication-helper';
import { getConfigProperty } from './functions.config.js';
const userDomain = getConfigProperty('application.userDomain');
const activeDirectoryConfig = getConfigProperty('activeDirectory');
async function authenticateViaActiveDirectory(username, password) {
    return await new Promise(async (resolve) => {
        try {
            const ad = new ActiveDirectoryAuthenticator(activeDirectoryConfig);
            const success = await ad.authenticate(`${userDomain}\\${username}`, password);
            resolve(success);
        }
        catch {
            resolve(false);
        }
    });
}
const adWebAuthConfig = getConfigProperty('adWebAuthConfig');
const adWebAuth = adWebAuthConfig === undefined
    ? undefined
    : new ADWebAuthAuthenticator(adWebAuthConfig);
async function authenticateViaADWebAuth(username, password) {
    return ((await adWebAuth?.authenticate(`${userDomain}\\${username}`, password)) ??
        false);
}
const authenticateFunction = activeDirectoryConfig === undefined
    ? authenticateViaADWebAuth
    : authenticateViaActiveDirectory;
export const authenticate = async (username, password) => {
    if (username === '' || password === '') {
        return false;
    }
    return await authenticateFunction(username, password);
};

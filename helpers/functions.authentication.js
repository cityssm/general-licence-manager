import { AdWebAuthConnector } from '@cityssm/ad-web-auth-connector';
import ActiveDirectory from 'activedirectory2';
import { getConfigProperty } from './functions.config.js';
const userDomain = getConfigProperty('application.userDomain');
const activeDirectoryConfig = getConfigProperty('activeDirectory');
async function authenticateViaActiveDirectory(userName, password) {
    return await new Promise((resolve) => {
        try {
            const ad = new ActiveDirectory(activeDirectoryConfig);
            ad.authenticate(`${userDomain}\\${userName}`, password, async (error, auth) => {
                if (error) {
                    resolve(false);
                }
                resolve(auth);
            });
        }
        catch {
            resolve(false);
        }
    });
}
const adWebAuthConfig = getConfigProperty('adWebAuthConfig');
const adWebAuth = adWebAuthConfig === undefined
    ? undefined
    : new AdWebAuthConnector(adWebAuthConfig);
async function authenticateViaADWebAuth(userName, password) {
    return ((await adWebAuth?.authenticate(`${userDomain}\\${userName}`, password)) ??
        false);
}
const authenticateFunction = activeDirectoryConfig === undefined
    ? authenticateViaADWebAuth
    : authenticateViaActiveDirectory;
export const authenticate = async (userName, password) => {
    if ((userName ?? '') === '' || (password ?? '') === '') {
        return false;
    }
    return await authenticateFunction(userName, password);
};

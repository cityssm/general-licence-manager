import { AdWebAuthConnector } from '@cityssm/ad-web-auth-connector';
import * as configFunctions from './functions.config.js';
import ActiveDirectory from 'activedirectory2';
const userDomain = configFunctions.getProperty('application.userDomain');
const activeDirectoryConfig = configFunctions.getProperty('activeDirectory');
async function authenticateViaActiveDirectory(userName, password) {
    return new Promise((resolve) => {
        try {
            const ad = new ActiveDirectory(activeDirectoryConfig);
            ad.authenticate(userDomain + '\\' + userName, password, async (error, auth) => {
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
const adWebAuthConfig = configFunctions.getProperty('adWebAuthConfig');
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
    if (!userName || userName === '' || !password || password === '') {
        return false;
    }
    return await authenticateFunction(userName, password);
};

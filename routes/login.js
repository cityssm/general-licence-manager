import { Router } from "express";
import * as configFunctions from "../helpers/functions.config.js";
import * as authenticationFunctions from "../helpers/functions.authentication.js";
export const router = Router();
const getSafeRedirectURL = (possibleRedirectURL = "") => {
    const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
    const urlToCheck = (possibleRedirectURL.startsWith(urlPrefix)
        ? possibleRedirectURL.slice(urlPrefix.length)
        : possibleRedirectURL).toLowerCase();
    switch (urlToCheck) {
        case "/licences":
        case "/reports":
            return urlPrefix + urlToCheck;
    }
    return urlPrefix + "/dashboard";
};
router.route("/")
    .get((request, response) => {
    const sessionCookieName = configFunctions.getProperty("session.cookieName");
    if (request.session.user && request.cookies[sessionCookieName]) {
        const redirectURL = getSafeRedirectURL((request.query.redirect || ""));
        response.redirect(redirectURL);
    }
    else {
        response.render("login", {
            userName: "",
            message: "",
            redirect: request.query.redirect
        });
    }
})
    .post(async (request, response) => {
    const userName = request.body.userName;
    const passwordPlain = request.body.password;
    const redirectURL = getSafeRedirectURL(request.body.redirect);
    const isAuthenticated = await authenticationFunctions.authenticate(userName, passwordPlain);
    let userObject;
    if (isAuthenticated) {
        const userNameLowerCase = userName.toLowerCase();
        const canLogin = configFunctions.getProperty("users.canLogin")
            .some((currentUserName) => {
            return userNameLowerCase === currentUserName.toLowerCase();
        });
        if (canLogin) {
            const canUpdate = configFunctions.getProperty("users.canUpdate")
                .some((currentUserName) => {
                return userNameLowerCase === currentUserName.toLowerCase();
            });
            const isAdmin = configFunctions.getProperty("users.isAdmin")
                .some((currentUserName) => {
                return userNameLowerCase === currentUserName.toLowerCase();
            });
            userObject = {
                userName: userNameLowerCase,
                userProperties: {
                    canUpdate,
                    isAdmin
                }
            };
        }
    }
    if (isAuthenticated && userObject) {
        request.session.user = userObject;
        response.redirect(redirectURL);
    }
    else {
        response.render("login", {
            userName,
            message: "Login Failed",
            redirect: redirectURL
        });
    }
});
export default router;

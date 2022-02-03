import * as assert from "assert";
import puppeteer from "puppeteer";
import * as http from "http";
import { app } from "../app.js";
import * as configFunctions from "../helpers/functions.config.js";
import { getLicences } from "../helpers/licencesDB/getLicences.js";
describe("general-licence-manager", () => {
    let httpServer;
    const portNumber = 54333;
    let serverStarted = false;
    before(() => {
        httpServer = http.createServer(app);
        httpServer.on("listening", () => {
            serverStarted = true;
        });
        httpServer.listen(portNumber);
    });
    after(() => {
        try {
            httpServer.close();
        }
        catch (_a) {
        }
    });
    it("Ensure server starts on port " + portNumber.toString(), (done) => {
        assert.ok(serverStarted);
        done();
    });
    describe("databases", () => {
        it("Ensure licences.db exists", () => {
            assert.ok(getLicences({}, { limit: 10, offset: 0 }));
        });
    });
    const appURL = "http://localhost:" + portNumber.toString() + configFunctions.getProperty("reverseProxy.urlPrefix");
    const userName = configFunctions.getProperty("users.testing")[0];
    const password = userName;
    describe("transaction page tests", () => {
        const pageTests = {
            reports: {
                goto: "/reports"
            },
            licences: {
                goto: "/licences",
                waitFor: "/licences/doSearch"
            },
            newLicence: {
                goto: "/licences/new"
            }
        };
        for (const pageName of Object.keys(pageTests)) {
            it("should login, navigate to " + pageName + ", and log out", (done) => {
                const pageURLs = pageTests[pageName];
                (async () => {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto(appURL);
                    await page.focus("#login--userName");
                    await page.type("#login--userName", userName);
                    await page.focus("#login--password");
                    await page.type("#login--password", password);
                    const loginFormElement = await page.$("#form--login");
                    await loginFormElement.evaluate((formElement) => {
                        formElement.submit();
                    });
                    await page.waitForNavigation();
                    const response = await page.goto(appURL + pageURLs.goto);
                    const responseStatus = response.status();
                    if (pageURLs.waitFor) {
                        await page.waitForTimeout(1000);
                    }
                    await page.goto(appURL + "/logout");
                    await browser.close();
                    assert.strictEqual(responseStatus, 200);
                    done();
                })()
                    .catch(() => {
                    assert.fail();
                });
            });
        }
    });
});

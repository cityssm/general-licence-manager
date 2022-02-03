import * as assert from "assert";

// eslint-disable-next-line node/no-unpublished-import
import puppeteer from "puppeteer";

import * as http from "http";
import { app } from "../app.js";

import * as configFunctions from "../helpers/functions.config.js";

import { getLicences } from "../helpers/licencesDB/getLicences.js";


describe("general-licence-manager", () => {

  let httpServer: http.Server;
  const portNumber = 54_333;

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
    } catch {
      // ignore
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

    const pageTests: {
      [pageName: string]: {
        goto: string;
        waitFor?: string;
      };
    } = {
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

        // eslint-disable-next-line promise/catch-or-return
        (async() => {

          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          // Load the login page

          await page.goto(appURL);

          await page.focus("#login--userName");
          await page.type("#login--userName", userName);

          await page.focus("#login--password");
          await page.type("#login--password", password);

          const loginFormElement = await page.$("#form--login");
          await loginFormElement.evaluate((formElement: HTMLFormElement) => {
            formElement.submit();
          });

          await page.waitForNavigation();

          // Navigate to the page

          const response = await page.goto(appURL + pageURLs.goto);

          const responseStatus = response.status();

          if (pageURLs.waitFor) {
            await page.waitForTimeout(1000);
          }

          // Log out

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

import * as assert from "assert";
import { portNumber } from "./_globals.js";
import { exec } from "child_process";
import * as http from "http";
import { app } from "../app.js";
describe("general-licence-manager", () => {
    const httpServer = http.createServer(app);
    let serverStarted = false;
    before(() => {
        httpServer.listen(portNumber);
        httpServer.on("listening", () => {
            serverStarted = true;
        });
    });
    after(() => {
        try {
            httpServer.close();
        }
        catch (_a) {
        }
    });
    it("Ensure server starts on port " + portNumber.toString(), () => {
        assert.ok(serverStarted);
    });
    describe("Cypress tests", () => {
        it("should run Cypress tests", (done) => {
            let cypresssCommand = "cypress run";
            if (process.env.CYPRESS_RECORD_KEY && process.env.CYPRESS_RECORD_KEY !== "") {
                cypresssCommand += " --record";
            }
            const childProcess = exec(cypresssCommand);
            childProcess.stdout.on("data", (data) => {
                console.log(data);
            });
            childProcess.stderr.on("data", (data) => {
                console.error(data);
            });
            childProcess.on("exit", (code) => {
                assert.ok(code === 0);
                done();
            });
        }).timeout(30 * 60 * 60 * 1000);
    });
});

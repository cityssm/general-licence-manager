import * as assert from "assert";
import * as http from "http";
import { app } from "../app.js";
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
});

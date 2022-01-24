/* eslint-disable node/no-unpublished-import */

import * as assert from "assert";

import * as http from "http";
import { app } from "../app.js";


// import { fakeViewOnlySession } from "./_globals.js";


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

});

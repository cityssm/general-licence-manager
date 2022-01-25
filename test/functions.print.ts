import * as assert from "assert";

import * as printFunctions from "../helpers/functions.print.js";


describe("functions.print", () => {

  it("should execute getPrintEJSList()", async() => {

    // call twice to ensure one is retrieved from the cache
    const ejsList = await printFunctions.getPrintEJSList();

    assert.ok(ejsList.length > 0);
  });

});

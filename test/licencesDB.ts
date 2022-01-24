import * as assert from "assert";

import { getLicences } from "../helpers/licencesDB/getLicences.js";


describe("licencesDB", () => {

  it("should execute getLicences()", () => {
    const records = getLicences({}, { limit: 100, offset: 0 });
    assert.strictEqual(typeof (records), "object");
  });
});

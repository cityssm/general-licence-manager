import * as assert from "assert";

import { getLicence } from "../helpers/licencesDB/getLicence.js";
import { getLicences } from "../helpers/licencesDB/getLicences.js";

import { getNextLicenceNumber } from "../helpers/licencesDB/getNextLicenceNumber.js";
import * as unusedKey from "../helpers/licencesDB/getUnusedKey.js";


describe("licencesDB", () => {

  it("should execute getLicence(licenceId: number)", () => {
    getLicence(1);
    assert.ok(true, "object");
  });

  it("should execute getLicence(licenceId: string)", () => {
    getLicence("1");
    assert.ok(true, "object");
  });

  it("should execute getLicences()", () => {
    const records = getLicences({}, { limit: 100, offset: 0 });
    assert.strictEqual(typeof (records), "object");
  });

  it("should execute getLicences({licenceCategoryKey})", () => {
    const records = getLicences({ licenceCategoryKey: "test" }, { limit: 100, offset: 0 });
    assert.strictEqual(typeof (records), "object");
  });

  it("should execute getLicences({licensee})", () => {
    const records = getLicences({ licensee: "test" }, { limit: 100, offset: 0 });
    assert.strictEqual(typeof (records), "object");
  });

  it("should execute getLicences({licenceStatus:\"active\"})", () => {
    const records = getLicences({ licenceStatus: "active" }, { limit: 100, offset: 0 });
    assert.strictEqual(typeof (records), "object");
  });

  it("should execute getLicences({licenceStatus:\"past\"})", () => {
    const records = getLicences({ licenceStatus: "past" }, { limit: 100, offset: 0 });
    assert.strictEqual(typeof (records), "object");
  });

  it("should execute getNextLicenceNumber()", () => {
    const nextLicenceNumber = getNextLicenceNumber();
    assert.strictEqual(typeof (nextLicenceNumber), "string");
  });

  it("should execute getUnusedLicenceApprovalKey()", () => {
    const key = unusedKey.getUnusedLicenceApprovalKey("test", "test");
    assert.strictEqual(typeof (key), "string");
  });

  it("should execute getUnusedLicenceCategoryKey()", () => {
    const key = unusedKey.getUnusedLicenceCategoryKey("test");
    assert.strictEqual(typeof (key), "string");
  });

  it("should execute getUnusedLicenceFieldKey()", () => {
    const key = unusedKey.getUnusedLicenceFieldKey("test", "test");
    assert.strictEqual(typeof (key), "string");
  });
});

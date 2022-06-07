import * as assert from "assert";

import * as licenceFunctions from "../helpers/functions.licence.js";

import type * as recordTypes from "../types/recordTypes";


describe("functions.licence", () => {

  describe("calculateAdditionalFeeAmount()", () => {

    it("Calculates a flat rate fee", () => {

      const fee = 10;

      const licenceCategoryAdditionalFee: recordTypes.LicenceCategoryAdditionalFee = {
        licenceAdditionalFeeKey: "testing",
        additionalFee: "Test Flat Fee",
        additionalFeeType: "flat",
        additionalFeeNumber: fee,
        isRequired: false
      };

      assert.strictEqual(licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, 100), fee);

      assert.strictEqual(licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, 200), fee);

      assert.strictEqual(licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, 300), fee);
    });

    it("Calculates a percentage fee", () => {

      const fee = 10;

      const licenceCategoryAdditionalFee: recordTypes.LicenceCategoryAdditionalFee = {
        licenceAdditionalFeeKey: "testing",
        additionalFee: "Test Percentage Fee",
        additionalFeeType: "percent",
        additionalFeeNumber: fee,
        isRequired: false
      };

      assert.strictEqual(licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, 100), 10);

      assert.strictEqual(licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, 200), 20);

      assert.strictEqual(licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, 300), 30);
    });
  });
});

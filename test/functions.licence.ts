import assert from 'node:assert'

import * as licenceFunctions from '../helpers/functions.licence.js'
import type { LicenceCategoryAdditionalFee } from '../types/recordTypes.js'

describe('functions.licence', () => {
  describe('calculateAdditionalFeeAmount()', () => {
    it('Calculates a flat rate fee', () => {
      const fee = 10

      const licenceCategoryAdditionalFee: LicenceCategoryAdditionalFee = {
        licenceAdditionalFeeKey: 'testing',
        licenceCategoryKey: '',
        additionalFee: 'Test Flat Fee',
        additionalFeeType: 'flat',
        additionalFeeNumber: fee,
        isRequired: false
      }

      assert.strictEqual(
        licenceFunctions.calculateAdditionalFeeAmount(
          licenceCategoryAdditionalFee,
          100
        ),
        fee
      )

      assert.strictEqual(
        licenceFunctions.calculateAdditionalFeeAmount(
          licenceCategoryAdditionalFee,
          200
        ),
        fee
      )

      assert.strictEqual(
        licenceFunctions.calculateAdditionalFeeAmount(
          licenceCategoryAdditionalFee,
          300
        ),
        fee
      )
    })

    it('Calculates a percentage fee', () => {
      const fee = 10

      const licenceCategoryAdditionalFee: LicenceCategoryAdditionalFee =
        {
          licenceAdditionalFeeKey: 'testing',
          licenceCategoryKey: '',
          additionalFee: 'Test Percentage Fee',
          additionalFeeType: 'percent',
          additionalFeeNumber: fee,
          isRequired: false
        }

      assert.strictEqual(
        licenceFunctions.calculateAdditionalFeeAmount(
          licenceCategoryAdditionalFee,
          100
        ),
        10
      )

      assert.strictEqual(
        licenceFunctions.calculateAdditionalFeeAmount(
          licenceCategoryAdditionalFee,
          200
        ),
        20
      )

      assert.strictEqual(
        licenceFunctions.calculateAdditionalFeeAmount(
          licenceCategoryAdditionalFee,
          300
        ),
        30
      )
    })
  })
})

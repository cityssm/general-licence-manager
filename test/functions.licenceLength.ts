import assert from 'node:assert'

import * as licenceLengthFunctions from '../data/licenceLengthFunctions.js'

describe('functions.licenceLength', () => {
  it('Calculates end of March next year', () => {
    const currentDate = new Date()
    const marchDate = licenceLengthFunctions.endOfMarchNextYear(currentDate)
    assert.strictEqual(currentDate.getFullYear() + 1, marchDate.getFullYear())
    assert.strictEqual(marchDate.getMonth(), 3 - 1)
    assert.strictEqual(marchDate.getDate(), 31)
  })
})

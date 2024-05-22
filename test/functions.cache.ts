import assert from 'node:assert'

import * as cacheFunctions from '../helpers/functions.cache.js'

describe('functions.cache', () => {
  it('should execute getLicenceCategories()', () => {
    // call twice to ensure one is retrieved from the cache
    const categoriesA = cacheFunctions.getLicenceCategories()
    const categoriesB = cacheFunctions.getLicenceCategories()

    assert.strictEqual(categoriesA.length, categoriesB.length)
  })
})

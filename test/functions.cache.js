import assert from 'node:assert';
import * as cacheFunctions from '../helpers/functions.cache.js';
describe('functions.cache', () => {
    it('should execute getLicenceCategories()', () => {
        const categoriesA = cacheFunctions.getLicenceCategories();
        const categoriesB = cacheFunctions.getLicenceCategories();
        assert.strictEqual(categoriesA.length, categoriesB.length);
    });
});

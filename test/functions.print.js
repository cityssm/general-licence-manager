import assert from 'node:assert';
import * as printFunctions from '../helpers/functions.print.js';
describe('functions.print', () => {
    it('should execute getPrintEJSList()', async () => {
        const ejsList = await printFunctions.getPrintEJSList();
        assert.ok(ejsList.length > 0);
    });
});

/* eslint-disable unicorn/filename-case, eslint-comments/disable-enable-pair */

import assert from 'node:assert'
import { unlink } from 'node:fs'

import { licencesDB_testing } from '../data/databasePaths.js'
import { initLicencesDB } from '../helpers/databaseInitializer.js'

describe(`Reinitialize ${licencesDB_testing}`, () => {
  it('Purges ' + licencesDB_testing, (done) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    unlink(licencesDB_testing, (error) => {
      if (error) {
        assert.fail()
      } else {
        assert.ok(true)
      }
      done()
    })
  })

  it(`Creates ${licencesDB_testing}`, () => {
    const success = initLicencesDB()
    assert.ok(success)
  })
})

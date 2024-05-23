import { randomUUID } from 'node:crypto'

import sqlite from 'better-sqlite3'
import slugify from 'slugify'

import { licencesDB as databasePath } from '../data/databasePaths.js'

function getUnusedKey(
  database: sqlite.Database,
  unsluggedString: string,
  maxLength: number,
  searchSQL: string
): string {
  let keyString = slugify(unsluggedString, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: 'en',
    trim: true
  })

  if (keyString.length > maxLength) {
    keyString = keyString.slice(0, maxLength)
  }

  let row = database.prepare(searchSQL).get(keyString)

  if (!row) {
    return keyString
  }

  if (keyString.length + 3 > maxLength) {
    keyString = keyString.slice(0, maxLength - 4)
  }

  for (let index = 1; index <= 999; index += 1) {
    const possibleKeyString = keyString + '-' + index.toString()

    row = database.prepare(searchSQL).get(possibleKeyString)

    if (!row) {
      return possibleKeyString
    }
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const possibleKeyString = randomUUID().slice(0, maxLength)

    row = database.prepare(searchSQL).get(possibleKeyString)

    if (!row) {
      return possibleKeyString
    }
  }
}

export const getUnusedLicenceCategoryKey = (
  licenceCategory: string
): string => {
  const database = sqlite(databasePath, {
    readonly: true
  })

  const licenceCategoryKey = getUnusedKey(
    database,
    licenceCategory,
    50,
    'select licenceCategoryKey from LicenceCategories where licenceCategoryKey = ?'
  )

  database.close()

  return licenceCategoryKey
}

export const getUnusedLicenceFieldKey = (
  licenceCategoryKey: string,
  licenceField: string
): string => {
  const database = sqlite(databasePath, {
    readonly: true
  })

  const licenceFieldKey = getUnusedKey(
    database,
    `${licenceCategoryKey} ${licenceField}`,
    80,
    'select licenceFieldKey from LicenceCategoryFields where licenceFieldKey = ?'
  )

  database.close()

  return licenceFieldKey
}

export function getUnusedLicenceApprovalKey(
  licenceCategoryKey: string,
  licenceApproval: string
): string {
  const database = sqlite(databasePath, {
    readonly: true
  })

  const licenceApprovalKey = getUnusedKey(
    database,
    `${licenceCategoryKey} ${licenceApproval}`,
    80,
    'select licenceApprovalKey from LicenceCategoryApprovals where licenceApprovalKey = ?'
  )

  database.close()

  return licenceApprovalKey
}

export const getUnusedLicenceAdditionalFeeKey = (
  licenceCategoryKey: string,
  additionalFee: string
): string => {
  const database = sqlite(databasePath, {
    readonly: true
  })

  const licenceAdditionalFeeKey = getUnusedKey(
    database,
    `${licenceCategoryKey} ${additionalFee}`,
    80,
    'select licenceAdditionalFeeKey from LicenceCategoryAdditionalFees where licenceAdditionalFeeKey = ?'
  )

  database.close()

  return licenceAdditionalFeeKey
}

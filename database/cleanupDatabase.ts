import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'

// Avoid mistyping!!!
// eslint-disable-next-line @typescript-eslint/naming-convention
const recordDelete_timeMillis_is_not_null =
  'recordDelete_timeMillis is not null'

const cleanupQueries = [
  /*
   * Licences
   */

  // Purge deleted transactions
  `delete from LicenceTransactions
    where ${recordDelete_timeMillis_is_not_null}`,

  // Purge related licences
  `delete from RelatedLicences
    where licenceIdA in (select licenceId from Licences where ${recordDelete_timeMillis_is_not_null})
    or licenceIdB in (select licenceId from Licences where ${recordDelete_timeMillis_is_not_null})`,

  // Purge fields
  `delete from LicenceFields
    where licenceId in (select licenceId from Licences where ${recordDelete_timeMillis_is_not_null})`,

  // Purge approvals
  `delete from LicenceApprovals
    where licenceId in (select licenceId from Licences where ${recordDelete_timeMillis_is_not_null})`,

  // Purge additional fees
  `delete from LicenceAdditionalFees
    where licenceId in (select licenceId from Licences where ${recordDelete_timeMillis_is_not_null})`,

  // Purge deleted licences with no foreign keys
  `delete from Licences
    where ${recordDelete_timeMillis_is_not_null}
    and licenceId not in (select licenceId from LicenceAdditionalFees)
    and licenceId not in (select licenceId from LicenceFields)
    and licenceId not in (select licenceId from LicenceApprovals)
    and licenceId not in (select licenceId from LicenceTransactions)
    and licenceId not in (select licenceIdA from RelatedLicences)
    and licenceId not in (select licenceIdB from RelatedLicences)`,

  /*
   * Licence Categories
   */

  // Purge fields
  `delete from LicenceCategoryFields
    where (
      ${recordDelete_timeMillis_is_not_null}
      or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where ${recordDelete_timeMillis_is_not_null}))
      and licenceFieldKey not in (select licenceFieldKey from LicenceFields)`,

  // Purge approvals
  `delete from LicenceCategoryApprovals
    where (
    ${recordDelete_timeMillis_is_not_null}
    or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where ${recordDelete_timeMillis_is_not_null}))
    and licenceApprovalKey not in (select licenceApprovalKey from LicenceApprovals)`,

  // Purge additional fees
  `delete from LicenceCategoryAdditionalFees
    where (${recordDelete_timeMillis_is_not_null}
      or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where ${recordDelete_timeMillis_is_not_null}))
      and licenceAdditionalFeeKey not in (select licenceAdditionalFeeKey from LicenceAdditionalFees)`,

  // Purge fees
  `delete from LicenceCategoryFees
    where (${recordDelete_timeMillis_is_not_null}
      or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where ${recordDelete_timeMillis_is_not_null}))
      and licenceCategoryKey not in (select licenceCategoryKey from Licences)`,

  // Purge categories
  `delete from LicenceCategories
    where ${recordDelete_timeMillis_is_not_null}
    and licenceCategoryKey not in (select licenceCategoryKey from Licences)
    and licenceCategoryKey not in (select licenceCategoryKey from LicenceCategoryFields)
    and licenceCategoryKey not in (select licenceCategoryKey from LicenceCategoryApprovals)
    and licenceCategoryKey not in (select licenceCategoryKey from LicenceAdditionalFees)
    and licenceCategoryKey not in (select licenceCategoryKey from LicenceCategoryFees)`
]

export default function cleanupDatabase(): number {
  const database = sqlite(databasePath)

  let rowCount = 0

  for (const cleanupQuery of cleanupQueries) {
    rowCount += database.prepare(cleanupQuery).run().changes
  }

  database.close()

  return rowCount
}

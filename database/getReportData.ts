/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable no-case-declarations */

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import getCanadianBankName from '@cityssm/get-canadian-bank-name'
import sqlite from 'better-sqlite3'
import camelCase from 'camelcase'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import * as cacheFunctions from '../helpers/functions.cache.js'
import {
  getConfigProperty,
  getCustomReport
} from '../helpers/functions.config.js'

export type ReportParameters = Record<string, string | number>

const licenceAliasSQL = camelCase(getConfigProperty('settings.licenceAlias'))
const licenseeAliasSQL = camelCase(getConfigProperty('settings.licenseeAlias'))

const licenceId = `${licenceAliasSQL}Id`
const licenceNumber = `${licenceAliasSQL}Number`
const licenceCategory = `${licenceAliasSQL}Category`

const licenseeName = `${licenseeAliasSQL}Name`
const licenseeBusinessName = `${licenseeAliasSQL}BusinessName`
const licenseeAddress1 = `${licenseeAliasSQL}Address1`
const licenseeAddress2 = `${licenseeAliasSQL}Address2`
const licenseeCity = `${licenseeAliasSQL}City`
const licenseeProvince = `${licenseeAliasSQL}Province`
const licenseePostalCode = `${licenseeAliasSQL}PostalCode`

function getLicencesByLicenceCategorySQL(licenceCategoryKey: string): {
  sql: string
  sqlParameters: string[]
} {
  const licenceCategoryDefinition =
    cacheFunctions.getLicenceCategory(licenceCategoryKey)

  const sqlParameters = []

  let fieldsSql = ''

  const fieldColumnNames = new Set<string>()

  for (const licenceField of licenceCategoryDefinition.licenceCategoryFields) {
    let fieldColumnName = ''

    for (
      let fieldColumnNameIndex = 0;
      fieldColumnNameIndex <= 100;
      fieldColumnNameIndex += 1
    ) {
      fieldColumnName = `field_${camelCase(licenceField.licenceField)}${
        fieldColumnNameIndex === 0 ? '' : `_${fieldColumnNameIndex}`
      }`

      if (!fieldColumnNames.has(fieldColumnName)) {
        fieldColumnNames.add(fieldColumnName)
        break
      }
    }

    fieldsSql += ` max(case when f.licenceFieldKey = ? then f.licenceFieldValue else null end) as ${fieldColumnName},`
    sqlParameters.push(licenceField.licenceFieldKey)
  }

  const sql = `select l.licenceId as ${licenceId},
      c.licenceCategory as ${licenceCategory},
      l.licenceNumber as ${licenceNumber},
      l.licenseeName as ${licenseeName},
      l.licenseeBusinessName as ${licenseeBusinessName},
      l.licenseeAddress1 as ${licenseeAddress1},
      l.licenseeAddress2 as ${licenseeAddress2},
      l.licenseeCity as ${licenseeCity},
      l.licenseeProvince as ${licenseeProvince},
      l.licenseePostalCode as ${licenseePostalCode},
      ${fieldsSql}
      userFn_dateIntegerToString(l.startDate) as startDateString,
      userFn_dateIntegerToString(l.endDate) as endDateString,
      userFn_dateIntegerToString(l.issueDate) as issueDateString
      from Licences l
      left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey
      left join LicenceFields f on l.licenceId = f.licenceId
      where l.licenceCategoryKey = ?
      group by l.licenceId, c.licenceCategory, l.licenceNumber,
        l.licenseeName, l.licenseeBusinessName,
        l.licenseeAddress1, l.licenseeAddress2, l.licenseeCity, l.licenseeProvince, l.licenseePostalCode,
        l.startDate, l.endDate
      order by l.startDate desc, l.endDate desc, l.licenceId`

  sqlParameters.push(licenceCategoryKey)

  return {
    sql,
    sqlParameters
  }
}

export default function getReportData(
  reportName: string,
  reportParameters: ReportParameters = {}
): unknown[] | undefined {
  let sql: string
  let sqlParameters: Array<string | number> = []

  const customReport = getCustomReport(reportName)

  if (customReport) {
    sql = customReport.sql
  } else {
    switch (reportName) {
      case 'licences-all': {
        sql = 'select * from Licences'
        break
      }

      case 'licences-byLicenceCategory': {
        const report = getLicencesByLicenceCategorySQL(
          reportParameters.licenceCategoryKey as string
        )

        sql = report.sql
        sqlParameters = report.sqlParameters
        break
      }

      case 'licences-formatted': {
        let issuedFilter = ''

        if (reportParameters.issued && reportParameters.issued !== '') {
          issuedFilter =
            reportParameters.issued === 'false'
              ? ' and l.issueDate is null'
              : ' and l.issueDate is not null'
        }

        sql = `select l.licenceId as ${licenceId},
            c.licenceCategory as ${licenceCategory},
            l.licenceNumber as ${licenceNumber},
            l.licenseeName as ${licenseeName},
            l.licenseeBusinessName as ${licenseeBusinessName},
            l.licenseeAddress1 as ${licenseeAddress1},
            l.licenseeAddress2 as ${licenseeAddress2},
            l.licenseeCity as ${licenseeCity},
            l.licenseeProvince as ${licenseeProvince},
            l.licenseePostalCode as ${licenseePostalCode},
            userFn_dateIntegerToString(l.startDate) as startDateString,
            userFn_dateIntegerToString(l.endDate) as endDateString,
            userFn_dateIntegerToString(l.issueDate) as issueDateString
            from Licences l
            left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey
            where l.recordDelete_timeMillis is null
            ${issuedFilter}
            order by startDate desc, endDate desc, licenceId`

        break
      }

      case 'licenceAdditionalFees-all': {
        sql = 'select * from LicenceAdditionalFees'
        break
      }

      case 'licenceApprovals-all': {
        sql = 'select * from LicenceApprovals'
        break
      }

      case 'licenceCategories-all': {
        sql = 'select * from LicenceCategories'
        break
      }

      case 'licenceCategoryAdditionalFees-all': {
        sql = 'select * from LicenceCategoryAdditionalFees'
        break
      }

      case 'licenceCategoryApprovals-all': {
        sql = 'select * from LicenceCategoryApprovals'
        break
      }

      case 'licenceCategoryFees-all': {
        sql = 'select * from LicenceCategoryFees'
        break
      }

      case 'licenceCategoryFields-all': {
        sql = 'select * from LicenceCategoryFields'
        break
      }

      case 'licenceFields-all': {
        sql = 'select * from LicenceFields'
        break
      }

      case 'licenceTransactions-all': {
        sql = 'select * from LicenceTransactions'
        break
      }

      case 'licenceTransactions-byDate': {
        let dateFilter = ''

        if (
          reportParameters.transactionDateString &&
          reportParameters.transactionDateString !== ''
        ) {
          dateFilter = ' and t.transactionDate = ?'
          sqlParameters.push(
            dateTimeFunctions.dateStringToInteger(
              reportParameters.transactionDateString as string
            )
          )
        }

        if (
          reportParameters.batchDateString &&
          reportParameters.batchDateString !== ''
        ) {
          dateFilter = ' and t.batchDate = ?'
          sqlParameters.push(
            dateTimeFunctions.dateStringToInteger(
              reportParameters.batchDateString as string
            )
          )
        }

        sql = `select c.licenceCategory as ${licenceCategory},
            l.licenceNumber as ${licenceNumber},
            l.licenseeName, l.licenseeBusinessName,
            userFn_dateIntegerToString(t.transactionDate) as transactionDateString,
            userFn_timeIntegerToString(t.transactionTime) as transactionTimeString,
            t.transactionAmount,
            ${
              getConfigProperty('settings.includeBatches')
                ? ` userFn_dateIntegerToString(t.batchDate) as batchDateString,
                      userFn_getCanadianBankName(t.bankInstitutionNumber, t.bankTransitNumber) as bankName,
                      t.bankInstitutionNumber,
                      t.bankTransitNumber,
                      t.bankAccountNumber,`
                : ''
            }
            t.externalReceiptNumber,
            t.transactionNote
            from LicenceTransactions t
            left join Licences l on t.licenceId = l.licenceId
            left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey
            where t.recordDelete_timeMillis is null
            ${dateFilter}
            order by t.transactionDate, t.transactionTime`

        break
      }

      case 'relatedLicences-all': {
        sql = 'select * from RelatedLicences'
        break
      }

      default: {
        return undefined
      }
    }
  }

  const database = sqlite(databasePath, {
    readonly: true
  })

  database.function(
    'userFn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )
  database.function(
    'userFn_timeIntegerToString',
    dateTimeFunctions.timeIntegerToString
  )
  database.function(
    'userFn_getCanadianBankName',
    (institutionNumber: string, transitNumber?: string) => {
      return getCanadianBankName(institutionNumber, transitNumber)
    }
  )

  const rows = database.prepare(sql).all(sqlParameters)

  database.close()

  return rows
}

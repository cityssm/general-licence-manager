import { EFTGenerator } from '@cityssm/eft-generator'
import * as modernJulianDate from '@cityssm/modern-julian-date'

import type * as recordTypes from '../../types/recordTypes.js'

import type { GetBatchExportReturn } from '../batchExport.js'
import { getProperty } from '../../helpers/functions.config.js'
import { ConfigBatchExport_CPA005 } from '../../types/configTypes.js'
import {
  dateIntegerToDate,
  dateStringToDate
} from '@cityssm/expressjs-server-js/dateTimeFns.js'
import {
  calculateCustomerNumber,
  calculateFileCreationNumber
} from './batchHelpers.js'

const batchExportConfig = getProperty(
  'exports.batches'
) as ConfigBatchExport_CPA005

export default function getBatchExport(
  outstandingBatchTransactions: recordTypes.LicenceTransaction[]
): GetBatchExportReturn {
  const batchDate = dateStringToDate(
    outstandingBatchTransactions[0].batchDateString
  )

  const fileCreationNumber = calculateFileCreationNumber(batchDate)

  const eftGenerator = new EFTGenerator({
    fileCreationNumber,
    fileCreationDate: batchDate,
    originatorId: batchExportConfig.config.originatorId,
    originatorLongName: batchExportConfig.config.originatorLongName,
    originatorShortName: batchExportConfig.config.originatorShortName
  })

  for (const transaction of outstandingBatchTransactions) {
    const customerNumber = calculateCustomerNumber(transaction)

    eftGenerator.addDebitTransaction({
      paymentDate: dateIntegerToDate(transaction.batchDate),
      cpaCode: batchExportConfig.config.cpaCode,
      amount: transaction.transactionAmount,
      bankInstitutionNumber: transaction.bankInstitutionNumber,
      bankTransitNumber: transaction.bankTransitNumber,
      bankAccountNumber: transaction.bankAccountNumber,
      payeeName:
        transaction.licenseeName +
        (transaction.licenseeBusinessName === ''
          ? ''
          : ' - ' + transaction.licenseeBusinessName)
    })
  }

  const output = eftGenerator.toCPA005()

  return {
    fileContentType: 'text/plain',
    fileName: 'batch-' + outstandingBatchTransactions[0].batchDate.toString() + '.txt',
    fileData: output
  }
}

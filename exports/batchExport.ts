import * as configFunctions from '../helpers/functions.config.js'
import { getBatchTransactions } from '../helpers/licencesDB/getBatchTransactions.js'

import cpa005_getBatchExport from './batches/cpa005.js'
import rbcPreauthorized_getBatchExport from './batches/rbcPreauthorized.js'

export interface GetBatchExportReturn {
  fileName: string
  fileData: string
  fileContentType: string
}

export function getBatchExport(
  batchDate: number
): GetBatchExportReturn | undefined {
  const outstandingBatchTransactions = getBatchTransactions(batchDate, true)

  console.log(outstandingBatchTransactions)

  if (outstandingBatchTransactions.length === 0) {
    return undefined
  }

  const batchExportConfig = configFunctions.getConfigProperty('exports.batches')

  if (!batchExportConfig) {
    return undefined
  }

  switch (batchExportConfig.exportType) {
    case 'cpa005': {
      return cpa005_getBatchExport(outstandingBatchTransactions)
    }
    case 'rbcPreauthorized': {
      return rbcPreauthorized_getBatchExport(outstandingBatchTransactions)
    }
  }
}

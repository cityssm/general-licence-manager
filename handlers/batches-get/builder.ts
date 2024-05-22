import type { Request, Response } from 'express'

import getBatchableLicences from '../../helpers/licencesDB/getBatchableLicences.js'
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js'

export default function handler(_request: Request, response: Response): void {
  const licences = getBatchableLicences()
  const batchTransactions = getOutstandingBatchTransactions()

  response.render('batch-builder', {
    headTitle: 'Transaction Batch Builder',
    licences,
    batchTransactions
  })
}

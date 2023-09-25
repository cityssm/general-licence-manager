import type { RequestHandler } from 'express'

import { getBatchableLicences } from '../../helpers/licencesDB/getBatchableLicences.js'
import { getOutstandingBatchTransactions } from '../../helpers/licencesDB/getOutstandingBatchTransactions.js'

export const handler: RequestHandler = (_request, response) => {
  const licences = getBatchableLicences()
  const batchTransactions = getOutstandingBatchTransactions()

  response.render('batch-builder', {
    headTitle: 'Transaction Batch Builder',
    licences,
    batchTransactions
  })
}

export default handler

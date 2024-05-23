import type { Request, Response } from 'express'

import clearBatchTransactionsByBatchDate from '../../helpers/licencesDB/clearBatchTransactionsByBatchDate.js'
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js'

export default function handler(request: Request, response: Response): void {
  const success = clearBatchTransactionsByBatchDate(
    request.body.batchDateString as string,
    request.session.user as GLMUser
  )
  const batchTransactions = getOutstandingBatchTransactions()

  response.json({
    success,
    batchTransactions
  })
}

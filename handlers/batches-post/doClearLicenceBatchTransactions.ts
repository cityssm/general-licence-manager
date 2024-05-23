import type { Request, Response } from 'express'

import clearBatchTransactionsByLicence from '../../database/clearBatchTransactionsByLicence.js'
import getOutstandingBatchTransactions from '../../database/getOutstandingBatchTransactions.js'

export default function handler(request: Request, response: Response): void {
  const licenceIds: [] = request.body.licenceIds

  let success = 1

  for (const licenceId of licenceIds) {
    success = Math.min(
      success,
      clearBatchTransactionsByLicence(licenceId, request.session.user as GLMUser) ? 1 : 0
    )
  }

  const batchTransactions = getOutstandingBatchTransactions()

  response.json({
    success: success === 1,
    batchTransactions
  })
}

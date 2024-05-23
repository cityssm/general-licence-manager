import type { Request, Response } from 'express'

import createOrUpdateBatchTransaction, {
  type CreateOrUpdateBatchTransactionForm
} from '../../database/createOrUpdateBatchTransaction.js'
import getOutstandingBatchTransactions from '../../database/getOutstandingBatchTransactions.js'

export default function handler(request: Request, response: Response): void {
  const results = createOrUpdateBatchTransaction(
    request.body as CreateOrUpdateBatchTransactionForm,
    request.session.user as GLMUser
  )
  results.batchTransactions = getOutstandingBatchTransactions()

  response.json(results)
}

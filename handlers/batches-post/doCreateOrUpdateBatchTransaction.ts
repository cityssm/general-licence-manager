import type { Request, Response } from 'express'

import createOrUpdateBatchTransaction, {
  type CreateOrUpdateBatchTransactionForm
} from '../../helpers/licencesDB/createOrUpdateBatchTransaction.js'
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js'

export default function handler(request: Request, response: Response): void {
  const results = createOrUpdateBatchTransaction(
    request.body as CreateOrUpdateBatchTransactionForm,
    request.session
  )
  results.batchTransactions = getOutstandingBatchTransactions()

  response.json(results)
}

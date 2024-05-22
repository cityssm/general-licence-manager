import type { Request, Response } from 'express'

import addLicenceTransaction, {
  type AddLicenceTransactionForm
} from '../../helpers/licencesDB/addLicenceTransaction.js'
import getLicenceTransactions from '../../helpers/licencesDB/getLicenceTransactions.js'

export default function handler(request: Request, response: Response): void {
  const transactionIndex = addLicenceTransaction(
    request.body as AddLicenceTransactionForm,
    request.session
  )
  const licenceTransactions = getLicenceTransactions(
    request.body.licenceId as string
  )

  response.json({
    success: true,
    transactionIndex,
    licenceTransactions
  })
}

import type { Request, Response } from 'express'

import deleteLicenceTransaction from '../../helpers/licencesDB/deleteLicenceTransaction.js'
import getLicenceTransactions from '../../helpers/licencesDB/getLicenceTransactions.js'

export default function handler(request: Request, response: Response): void {
  const success = deleteLicenceTransaction(
    request.body.licenceId as string,
    request.body.transactionIndex as string,
    request.session.user as GLMUser
  )
  const licenceTransactions = getLicenceTransactions(
    request.body.licenceId as string
  )

  response.json({
    success,
    licenceTransactions
  })
}

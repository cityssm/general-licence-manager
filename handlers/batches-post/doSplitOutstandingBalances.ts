import type { Request, Response } from 'express'

import createOrUpdateBatchTransaction from '../../helpers/licencesDB/createOrUpdateBatchTransaction.js'
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js'

export default function handler(request: Request, response: Response): void {
  const licenceOutstandingBalances: Array<{
    licenceId: string
    outstandingBalance: string
  }> = request.body.licenceOutstandingBalances

  const batchDateStrings: string[] = request.body.batchDateStrings

  for (const licenceOutstandingBalance of licenceOutstandingBalances) {
    const licenceId = licenceOutstandingBalance.licenceId
    const outstandingBalance = Number.parseFloat(
      licenceOutstandingBalance.outstandingBalance
    )

    const transactionAmount =
      Math.floor((outstandingBalance / batchDateStrings.length) * 100) / 100

    let leftoverPennies =
      Math.round(
        (outstandingBalance - transactionAmount * batchDateStrings.length) * 100
      ) / 100

    for (const batchDateString of batchDateStrings) {
      createOrUpdateBatchTransaction(
        {
          licenceId,
          batchDateString,
          transactionAmount: (transactionAmount + leftoverPennies).toFixed(2)
        },
        request.session
      )

      leftoverPennies = 0
    }
  }

  const batchTransactions = getOutstandingBatchTransactions()

  response.json({
    success: true,
    batchTransactions
  })
}

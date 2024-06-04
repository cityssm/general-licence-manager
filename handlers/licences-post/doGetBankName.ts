import getCanadianBankName from '@cityssm/get-canadian-bank-name'
import type { Request, Response } from 'express'

export default function handler(request: Request, response: Response): void {
  const bankName = getCanadianBankName(
    request.body.bankInstitutionNumber as string,
    request.body.bankTransitNumber as string
  )

  response.json({
    bankName
  })
}

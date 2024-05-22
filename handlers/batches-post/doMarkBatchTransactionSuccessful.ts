import type { Request, Response } from 'express'

import markBatchTransactionSuccessful, {
  type MarkBatchTransactionSuccessfulForm
} from '../../helpers/licencesDB/markBatchTransactionSuccessful.js'

export default function handler(request: Request, response: Response): void {
  const success = markBatchTransactionSuccessful(
    request.body as MarkBatchTransactionSuccessfulForm,
    request.session
  )

  response.json({
    success
  })
}

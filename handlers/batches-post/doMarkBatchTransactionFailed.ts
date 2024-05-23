import type { Request, Response } from 'express'

import markBatchTransactionFailed, {
  type MarkBatchTransactionFailedForm
} from '../../helpers/licencesDB/markBatchTransactionFailed.js'

export function handler(request: Request, response: Response): void {
  const success = markBatchTransactionFailed(
    request.body as MarkBatchTransactionFailedForm,
    request.session.user as GLMUser
  )

  response.json({
    success
  })
}

export default handler

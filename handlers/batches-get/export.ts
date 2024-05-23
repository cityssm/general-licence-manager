import type { Request, Response } from 'express'

import { getBatchExport } from '../../exports/batchExport.js'
import { getConfigProperty } from '../../helpers/functions.config.js'

export default function handler(request: Request, response: Response): void {
  const batchDate = Number.parseInt(request.params.batchDate, 10)

  const batchExport = getBatchExport(batchDate)

  if (batchExport === undefined) {
    response.redirect(
      getConfigProperty('reverseProxy.urlPrefix') +
        '/dashboard/?error=batchExportError'
    )
    return
  }

  response.setHeader(
    'Content-Disposition',
    `attachment; filename=${batchExport.fileName}`
  )

  response.setHeader('Content-Type', batchExport.fileContentType)

  response.send(batchExport.fileData)
}

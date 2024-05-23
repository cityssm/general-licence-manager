import type { Request, Response } from 'express'

import cleanupDatabase from '../../database/cleanupDatabase.js'

export default function handler(_request: Request, response: Response): void {
  const rowCount = cleanupDatabase()

  response.json({
    success: true,
    rowCount
  })
}

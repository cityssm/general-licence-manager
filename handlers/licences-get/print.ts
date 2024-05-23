import path from 'node:path'

import { convertHTMLToPDF } from '@cityssm/pdf-puppeteer'
import * as ejs from 'ejs'
import type { NextFunction, Request, Response } from 'express'

import getLicence from '../../database/getLicence.js'
import { getLicenceCategory } from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'
import * as printFunctions from '../../helpers/functions.print.js'

export default async function handler(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const licenceId = request.params.licenceId

  const licence = getLicence(licenceId)

  if (!licence?.issueDate) {
    next(
      `${configFunctions.getConfigProperty(
        'settings.licenceAlias'
      )} not available for printing.`
    )
    return
  }

  const licenceCategory = getLicenceCategory(licence.licenceCategoryKey)

  if (
    licenceCategory === undefined ||
    (licenceCategory.printEJS ?? '') === ''
  ) {
    next(
      configFunctions.getConfigProperty('settings.licenceAlias') +
        ' does not have a print template set.'
    )
    return
  }

  const reportPath = path.join('.', 'print', `${licenceCategory.printEJS}.ejs`)

  await ejs.renderFile(
    reportPath,
    {
      configFunctions,
      printFunctions,
      licence,
      licenceCategory
    },
    {},
    async (ejsError, ejsData) => {
      if (ejsError) {
        next(ejsError)
        return
      }

      const pdf = await convertHTMLToPDF(ejsData, {
        format: 'letter',
        printBackground: true,
        preferCSSPageSize: true
      })

      const fileName = `${configFunctions
        .getConfigProperty('settings.licenceAlias')
        .toLowerCase()}-${licenceId}-${(
        licence.recordUpdate_timeMillis ?? 0
      ).toString()}.pdf`

      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName}`
      )

      response.setHeader('Content-Type', 'application/pdf')

      response.send(pdf)
    }
  )
}

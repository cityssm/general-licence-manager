import path from 'node:path'

import { convertHTMLToPDF } from '@cityssm/pdf-puppeteer'
import * as ejs from 'ejs'
import type { NextFunction, Request, Response } from 'express'

import { getLicenceCategory } from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'
import * as printFunctions from '../../helpers/functions.print.js'
import getLicence from '../../helpers/licencesDB/getLicence.js'

export default async function handler(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const licenceId = request.params.licenceId

  const licence = getLicence(licenceId)

  if (!licence?.issueDate) {
    next(
      configFunctions.getProperty('settings.licenceAlias') +
        ' not available for printing.'
    )
    return
  }

  const licenceCategory = getLicenceCategory(licence.licenceCategoryKey)

  if (!licenceCategory.printEJS || licenceCategory.printEJS === '') {
    next(
      configFunctions.getProperty('settings.licenceAlias') +
        ' does not have a print template set.'
    )
    return
  }

  const reportPath = path.join('.', 'print', licenceCategory.printEJS + '.ejs')

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

      response.setHeader(
        'Content-Disposition',
        'attachment;' +
          ' filename=' +
          configFunctions.getProperty('settings.licenceAlias').toLowerCase() +
          '-' +
          licenceId +
          '-' +
          licence.recordUpdate_timeMillis.toString() +
          '.pdf'
      )

      response.setHeader('Content-Type', 'application/pdf')

      response.send(pdf)
    }
  )
}

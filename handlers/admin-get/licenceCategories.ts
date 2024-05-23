import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import {
  getAdditionalFeeFunctionNames,
  getConfigProperty,
  getLicenceLengthFunctionNames
} from '../../helpers/functions.config.js'
import { getPrintEJSList } from '../../helpers/functions.print.js'

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  cacheFunctions.clearAll()

  const licenceCategories = cacheFunctions.getLicenceCategories()

  const licenceLengthFunctionNames = getLicenceLengthFunctionNames() ?? []
  const additionalFeeFunctionNames = getAdditionalFeeFunctionNames() ?? []

  const printEJSList = await getPrintEJSList()

  response.render('admin-licenceCategories', {
    headTitle: `${getConfigProperty('settings.licenceAlias')} Categories`,
    licenceCategories,
    licenceLengthFunctionNames,
    additionalFeeFunctionNames,
    printEJSList
  })
}

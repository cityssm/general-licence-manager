import { type RequestHandler, Router } from 'express'

import handler_cleanup from '../handlers/admin-get/cleanup.js'
import handler_licenceCategories from '../handlers/admin-get/licenceCategories.js'
import handler_yearEnd from '../handlers/admin-get/yearEnd.js'
import handler_doAddLicenceCategory from '../handlers/admin-post/doAddLicenceCategory.js'
import handler_doAddLicenceCategoryAdditionalFee from '../handlers/admin-post/doAddLicenceCategoryAdditionalFee.js'
import handler_doAddLicenceCategoryApproval from '../handlers/admin-post/doAddLicenceCategoryApproval.js'
import handler_doAddLicenceCategoryFee from '../handlers/admin-post/doAddLicenceCategoryFee.js'
import handler_doAddLicenceCategoryField from '../handlers/admin-post/doAddLicenceCategoryField.js'
import handler_doBackupDatabase from '../handlers/admin-post/doBackupDatabase.js'
import handler_doCleanupDatabase from '../handlers/admin-post/doCleanupDatabase.js'
import handler_doDeleteLicenceCategory from '../handlers/admin-post/doDeleteLicenceCategory.js'
import handler_doDeleteLicenceCategoryAdditionalFee from '../handlers/admin-post/doDeleteLicenceCategoryAdditionalFee.js'
import handler_doDeleteLicenceCategoryApproval from '../handlers/admin-post/doDeleteLicenceCategoryApproval.js'
import handler_doDeleteLicenceCategoryFee from '../handlers/admin-post/doDeleteLicenceCategoryFee.js'
import handler_doDeleteLicenceCategoryField from '../handlers/admin-post/doDeleteLicenceCategoryField.js'
import handler_doGetLicenceCategories from '../handlers/admin-post/doGetLicenceCategories.js'
import handler_doGetLicenceCategory from '../handlers/admin-post/doGetLicenceCategory.js'
import handler_doMoveLicenceCategoryAdditionalFee from '../handlers/admin-post/doMoveLicenceCategoryAdditionalFee.js'
import handler_doMoveLicenceCategoryApproval from '../handlers/admin-post/doMoveLicenceCategoryApproval.js'
import handler_doMoveLicenceCategoryField from '../handlers/admin-post/doMoveLicenceCategoryField.js'
import handler_doRefreshDatabase from '../handlers/admin-post/doRefreshDatabase.js'
import handler_doUpdateLicenceCategory from '../handlers/admin-post/doUpdateLicenceCategory.js'
import handler_doUpdateLicenceCategoryAdditionalFee from '../handlers/admin-post/doUpdateLicenceCategoryAdditionalFee.js'
import handler_doUpdateLicenceCategoryApproval from '../handlers/admin-post/doUpdateLicenceCategoryApproval.js'
import handler_doUpdateLicenceCategoryFee from '../handlers/admin-post/doUpdateLicenceCategoryFee.js'
import handler_doUpdateLicenceCategoryField from '../handlers/admin-post/doUpdateLicenceCategoryField.js'
import * as permissionHandlers from '../handlers/permissions.js'
import { getConfigProperty } from '../helpers/functions.config.js'

export const router = Router()

// Licence Categories

router.get(
  '/licenceCategories',
  permissionHandlers.adminGetHandler,
  handler_licenceCategories as RequestHandler
)

router.post(
  '/doGetLicenceCategories',
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategories
)

router.post(
  '/doGetLicenceCategory',
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategory
)

router.post(
  '/doAddLicenceCategory',
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategory
)

router.post(
  '/doUpdateLicenceCategory',
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategory
)

router.post(
  '/doDeleteLicenceCategory',
  permissionHandlers.adminPostHandler,
  handler_doDeleteLicenceCategory
)

// Licence Category Field

router.post(
  '/doAddLicenceCategoryField',
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategoryField
)

router.post(
  '/doUpdateLicenceCategoryField',
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategoryField
)

router.post(
  '/doMoveLicenceCategoryField',
  permissionHandlers.adminPostHandler,
  handler_doMoveLicenceCategoryField
)

router.post(
  '/doDeleteLicenceCategoryField',
  permissionHandlers.adminPostHandler,
  handler_doDeleteLicenceCategoryField
)

// Licence Category Approval

router.post(
  '/doAddLicenceCategoryApproval',
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategoryApproval
)

router.post(
  '/doUpdateLicenceCategoryApproval',
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategoryApproval
)

router.post(
  '/doMoveLicenceCategoryApproval',
  permissionHandlers.adminPostHandler,
  handler_doMoveLicenceCategoryApproval
)

router.post(
  '/doDeleteLicenceCategoryApproval',
  permissionHandlers.adminPostHandler,
  handler_doDeleteLicenceCategoryApproval
)

// Licence Category Fee

router.post(
  '/doAddLicenceCategoryFee',
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategoryFee
)

router.post(
  '/doUpdateLicenceCategoryFee',
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategoryFee
)

router.post(
  '/doDeleteLicenceCategoryFee',
  permissionHandlers.adminPostHandler,
  handler_doDeleteLicenceCategoryFee
)

// Licence Category Additional Fee

router.post(
  '/doAddLicenceCategoryAdditionalFee',
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategoryAdditionalFee
)

router.post(
  '/doUpdateLicenceCategoryAdditionalFee',
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategoryAdditionalFee
)

router.post(
  '/doMoveLicenceCategoryAdditionalFee',
  permissionHandlers.adminPostHandler,
  handler_doMoveLicenceCategoryAdditionalFee
)

router.post(
  '/doDeleteLicenceCategoryAdditionalFee',
  permissionHandlers.adminPostHandler,
  handler_doDeleteLicenceCategoryAdditionalFee
)

/*
 * Backup Database
 */

router.post(
  '/doBackupDatabase',
  permissionHandlers.adminPostHandler,
  handler_doBackupDatabase as RequestHandler
)

/*
 * Year-End
 */

if (getConfigProperty('settings.includeYearEnd')) {
  router.get('/yearEnd', permissionHandlers.adminGetHandler, handler_yearEnd)

  router.post(
    '/doRefreshDatabase',
    permissionHandlers.adminPostHandler,
    handler_doRefreshDatabase
  )
}

/*
 * Database Cleanup
 */

router.get('/cleanup', permissionHandlers.adminGetHandler, handler_cleanup)

router.post(
  '/doCleanupDatabase',
  permissionHandlers.adminPostHandler,
  handler_doCleanupDatabase
)

export default router

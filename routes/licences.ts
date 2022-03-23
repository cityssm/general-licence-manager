import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_search from "../handlers/licences-get/search.js";
import handler_doSearch from "../handlers/licences-post/doSearch.js";

import handler_licenceCategorySummary from "../handlers/licences-get/licenceCategorySummary.js";
import handler_doGetLicenceCategorySummary from "../handlers/licences-post/doGetLicenceCategorySummary.js";

import handler_view from "../handlers/licences-get/view.js";

import handler_new from "../handlers/licences-get/new.js";
import handler_edit from "../handlers/licences-get/edit.js";

import handler_doGetLicenceCategory from "../handlers/licences-post/doGetLicenceCategory.js";
import handler_doGetLicenceEndDate from "../handlers/licences-post/doGetLicenceEndDate.js";

import handler_doCreateLicence from "../handlers/licences-post/doCreateLicence.js";
import handler_doUpdateLicence from "../handlers/licences-post/doUpdateLicence.js";
import handler_doIssueLicence from "../handlers/licences-post/doIssueLicence.js";
import handler_doDeleteLicence from "../handlers/licences-post/doDeleteLicence.js";

import handler_doDeleteRelatedLicence from "../handlers/licences-post/doDeleteRelatedLicence.js";

import handler_doGetBankName from "../handlers/licences-post/doGetBankName.js";
import handler_doAddLicenceTransaction from "../handlers/licences-post/doAddLicenceTransaction.js";
import handler_doDeleteLicenceTransaction from "../handlers/licences-post/doDeleteLicenceTransaction.js";

import handler_print from "../handlers/licences-get/print.js";


export const router = Router();


/*
 * Licence Search
 */


router.get("/", handler_search);


router.post("/doSearch",
  handler_doSearch);


/*
 * Licence Category Summary
 */


router.get("/licenceCategorySummary", handler_licenceCategorySummary);


router.post("/doGetLicenceCategorySummary",
  handler_doGetLicenceCategorySummary);


/*
 * Licence View / Edit
 */


router.get("/new",
  permissionHandlers.updateGetHandler,
  handler_new);


router.get("/:licenceId",
  handler_view);


router.get("/:licenceId/edit",
  permissionHandlers.updateGetHandler,
  handler_edit);


router.post("/doGetLicenceCategory",
  permissionHandlers.updatePostHandler,
  handler_doGetLicenceCategory);


router.post("/doGetLicenceEndDate",
  permissionHandlers.updatePostHandler,
  handler_doGetLicenceEndDate);


router.post("/doCreateLicence",
  permissionHandlers.updatePostHandler,
  handler_doCreateLicence);


router.post("/doUpdateLicence",
  permissionHandlers.updatePostHandler,
  handler_doUpdateLicence);


router.post("/doIssueLicence",
  permissionHandlers.updatePostHandler,
  handler_doIssueLicence);


router.post("/doDeleteLicence",
  permissionHandlers.updatePostHandler,
  handler_doDeleteLicence);


router.post("/doDeleteRelatedLicence",
  permissionHandlers.updatePostHandler,
  handler_doDeleteRelatedLicence);


router.post("/doGetBankName",
  permissionHandlers.updatePostHandler,
  handler_doGetBankName);


router.post("/doAddLicenceTransaction",
  permissionHandlers.updatePostHandler,
  handler_doAddLicenceTransaction);


router.post("/doDeleteLicenceTransaction",
  permissionHandlers.updatePostHandler,
  handler_doDeleteLicenceTransaction);


/*
 * Licence Print
 */


router.get("/:licenceId/print",
  handler_print);


export default router;

import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_licenceCategories from "../handlers/admin-get/licenceCategories.js";

import handler_doGetLicenceCategories from "../handlers/admin-post/doGetLicenceCategories.js";
import handler_doGetLicenceCategory from "../handlers/admin-post/doGetLicenceCategory.js";
import handler_doAddLicenceCategory from "../handlers/admin-post/doAddLicenceCategory.js";
import handler_doUpdateLicenceCategory from "../handlers/admin-post/doUpdateLicenceCategory.js";

import handler_doAddLicenceCategoryField from "../handlers/admin-post/doAddLicenceCategoryField.js";
import handler_doUpdateLicenceCategoryField from "../handlers/admin-post/doUpdateLicenceCategoryField.js";
import handler_doMoveLicenceCategoryField from "../handlers/admin-post/doMoveLicenceCategoryField.js";
import handler_doDeleteLicenceCategoryField from "../handlers/admin-post/doDeleteLicenceCategoryField.js";


export const router = Router();


// Licence Categories

router.get("/licenceCategories",
  permissionHandlers.adminGetHandler,
  handler_licenceCategories);

router.post("/doGetLicenceCategories",
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategories);

router.post("/doGetLicenceCategory",
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategory);

router.post("/doAddLicenceCategory",
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategory);

router.post("/doUpdateLicenceCategory",
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategory);

// Licence Category Field

router.post("/doAddLicenceCategoryField",
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategoryField);

router.post("/doUpdateLicenceCategoryField",
  permissionHandlers.adminPostHandler,
  handler_doUpdateLicenceCategoryField);

router.post("/doMoveLicenceCategoryField",
  permissionHandlers.adminPostHandler,
  handler_doMoveLicenceCategoryField);

router.post("/doDeleteLicenceCategoryField",
  permissionHandlers.adminPostHandler,
  handler_doDeleteLicenceCategoryField);


export default router;

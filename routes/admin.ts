import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_licenceCategories from "../handlers/admin-get/licenceCategories.js";

// import handler_doGetLicenceCategories from "../handlers/admin-post/doGetLicenceCategories.js";
import handler_doGetLicenceCategory from "../handlers/admin-post/doGetLicenceCategory.js";
import handler_doAddLicenceCategory from "../handlers/admin-post/doAddLicenceCategory.js";


export const router = Router();


// Licence Categories

router.get("/licenceCategories",
  permissionHandlers.adminGetHandler,
  handler_licenceCategories);

/*
router.post("/doGetLicenceCategories",
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategories);
*/

router.post("/doGetLicenceCategory",
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategory);

router.post("/doAddLicenceCategory",
  permissionHandlers.adminPostHandler,
  handler_doAddLicenceCategory);


export default router;

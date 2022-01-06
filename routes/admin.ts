import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_licenceCategories from "../handlers/admin-get/licenceCategories.js";

import handler_doGetLicenceCategories from "../handlers/admin-post/doGetLicenceCategories.js";


export const router = Router();


// Licence Categories

router.get("/licenceCategories",
  permissionHandlers.adminGetHandler,
  handler_licenceCategories);

router.post("/doGetLicenceCategories",
  permissionHandlers.adminPostHandler,
  handler_doGetLicenceCategories);


export default router;

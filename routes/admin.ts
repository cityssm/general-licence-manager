import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_licenceCategories from "../handlers/admin-get/licenceCategories.js";


export const router = Router();


// Licence Categories

router.get("/licenceCategories",
  permissionHandlers.adminGetHandler,
  handler_licenceCategories);


export default router;

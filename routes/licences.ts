import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";


import handler_search from "../handlers/licences-get/search.js";
import handler_doSearch from "../handlers/licences-post/doSearch.js";

import handler_view from "../handlers/licences-get/view.js";

import handler_new from "../handlers/licences-get/new.js";
import handler_edit from "../handlers/licences-get/edit.js";
import handler_doGetLicenceCategory from "../handlers/licences-post/doGetLicenceCategory.js";

import handler_print from "../handlers/licences-get/print.js";


export const router = Router();


/*
 * Licence Search
 */


router.get("/", handler_search);


router.post("/doSearch",
  handler_doSearch);


/*
 * Licence View / Edit
 */


router.get("/new",
  permissionHandlers.updateGetHandler,
  handler_new);


router.get("/:licenceID",
  handler_view);


router.get("/:licenceID/edit",
  permissionHandlers.updateGetHandler,
  handler_edit);


router.post("/doGetLicenceCategory",
  permissionHandlers.updatePostHandler,
  handler_doGetLicenceCategory);

/*
 * Licence Print
 */


router.get("/:licenceID/print",
  handler_print);


export default router;

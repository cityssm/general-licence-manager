import { Router } from "express";
import * as permissionHandlers from "../handlers/permissions.js";
import handler_view from "../handlers/licences-get/view.js";
import handler_new from "../handlers/licences-get/new.js";
import handler_edit from "../handlers/licences-get/edit.js";
import handler_print from "../handlers/licences-get/print.js";
export const router = Router();
router.get("/", (_request, response) => {
    response.render("licence-search", {
        headTitle: "Licences"
    });
});
router.get("/new", permissionHandlers.updateGetHandler, handler_new);
router.get("/:licenceID", handler_view);
router.get("/:licenceID/edit", permissionHandlers.updateGetHandler, handler_edit);
router.get("/:licenceID/print", handler_print);
export default router;

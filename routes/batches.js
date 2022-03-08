import { Router } from "express";
import * as permissionHandlers from "../handlers/permissions.js";
import handler_builder from "../handlers/batches-get/builder.js";
export const router = Router();
router.get("/builder", permissionHandlers.updateGetHandler, handler_builder);
export default router;

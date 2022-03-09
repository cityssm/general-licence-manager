import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_builder from "../handlers/batches-get/builder.js";
import handler_doCreateOrUpdateBatchTransaction from "../handlers/batches-post/doCreateOrUpdateBatchTransaction.js";


export const router = Router();


router.get("/builder",
  permissionHandlers.updateGetHandler,
  handler_builder);


router.post("/doCreateOrUpdateBatchTransaction",
  permissionHandlers.updatePostHandler,
  handler_doCreateOrUpdateBatchTransaction);


export default router;

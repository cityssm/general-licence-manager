import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_builder from "../handlers/batches-get/builder.js";
import handler_doCreateOrUpdateBatchTransaction from "../handlers/batches-post/doCreateOrUpdateBatchTransaction.js";
import handler_doClearBatchTransactions from "../handlers/batches-post/doClearBatchTransactions.js";
import handler_doSplitOutstandingBalances from "../handlers/batches-post/doSplitOutstandingBalances.js";
import handler_doClearLicenceBatchTransactions from "../handlers/batches-post/doClearLicenceBatchTransactions.js";

import handler_reconcile from "../handlers/batches-get/reconcile.js";
import handler_doMarkBatchTransactionSuccessful from "../handlers/batches-post/doMarkBatchTransactionSuccessful.js";
import handler_doMarkBatchTransactionFailed from "../handlers/batches-post/doMarkBatchTransactionFailed.js";

import handler_export from "../handlers/batches-get/export.js";


export const router = Router();


router.get("/builder",
  permissionHandlers.updateGetHandler,
  handler_builder);


router.post("/doCreateOrUpdateBatchTransaction",
  permissionHandlers.updatePostHandler,
  handler_doCreateOrUpdateBatchTransaction);


router.post("/doClearBatchTransactions",
  permissionHandlers.updatePostHandler,
  handler_doClearBatchTransactions);


router.post("/doSplitOutstandingBalances",
  permissionHandlers.updatePostHandler,
  handler_doSplitOutstandingBalances);


router.post("/doClearLicenceBatchTransactions",
  permissionHandlers.updatePostHandler,
  handler_doClearLicenceBatchTransactions);


router.get("/reconcile/:batchDate",
  permissionHandlers.updateGetHandler,
  handler_reconcile);


router.post("/doMarkBatchTransactionSuccessful",
  permissionHandlers.updatePostHandler,
  handler_doMarkBatchTransactionSuccessful);


router.post("/doMarkBatchTransactionFailed",
  permissionHandlers.updatePostHandler,
  handler_doMarkBatchTransactionFailed);


router.get("/export/:batchDate",
  permissionHandlers.updateGetHandler,
  handler_export);


export default router;

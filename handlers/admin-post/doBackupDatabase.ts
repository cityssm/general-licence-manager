import type { RequestHandler } from "express";

import { backupDatabase } from "../../helpers/functions.database.js";


export const handler: RequestHandler = async (_request, response) => {

  const backupDatabasePath = await backupDatabase()

  const backupDatabasePathSplit = backupDatabasePath.split(/[/\\]/g);

  const fileName = backupDatabasePathSplit[backupDatabasePathSplit.length - 1];

  response.json({
    success: true,
    fileName
  });
};


export default handler;

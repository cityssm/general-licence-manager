import * as configFunctions from "../helpers/functions.config.js";

import { getBatchTransactions } from "../helpers/licencesDB/getBatchTransactions.js";

import rbcPreauthorized_getBatchExport from "./batches/rbcPreauthorized.js";


export interface GetBatchExportReturn {
  fileName: string;
  fileData: string;
  fileContentType: string;
}

export const getBatchExport = (batchDate: number): GetBatchExportReturn => {

  const outstandingBatchTransactions = getBatchTransactions(batchDate, true);

  if (outstandingBatchTransactions.length === 0) {
    return undefined;
  }

  const batchExportConfig = configFunctions.getProperty("exports.batches");

  if (!batchExportConfig) {
    return undefined;
  }

  switch (batchExportConfig.exportType) {
    case "rbcPreauthorized":
      return rbcPreauthorized_getBatchExport(outstandingBatchTransactions);
  }
};

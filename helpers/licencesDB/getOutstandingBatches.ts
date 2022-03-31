import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


export const getOutstandingBatches = (): recordTypes.Batch[] => {

  const database = sqlite(databasePath, {
    readonly: true
  });

  database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
  database.function("userFn_dateMillisToString", (dateMillis: number) => {
    return dateTimeFunctions.dateToString(new Date(dateMillis));
  });

  const batches = database.prepare("select t.batchDate," +
    " userFn_dateIntegerToString(t.batchDate) as batchDateString," +
    " userFn_dateMillisToString(max(recordUpdate_timeMillis)) as recordUpdate_dateString," +
    " count(licenceId) as transactionCount" +
    " from LicenceTransactions t" +
    " where t.recordDelete_timeMillis is null" +
    " and t.batchDate is not null" +
    " and (t.externalReceiptNumber is null or t.externalReceiptNumber = '')" +
    " and t.licenceId in (select licenceId from Licences where recordDelete_timeMillis is null)" +
    " group by t.batchDate" +
    " order by t.batchDate")
    .all() as recordTypes.Batch[];

  database.close();

  return batches;
};


export default getOutstandingBatches;

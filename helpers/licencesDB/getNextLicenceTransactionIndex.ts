import sqlite from "better-sqlite3";


export const getNextLicenceTransactionIndex =
  (licenceId: number | string, database: sqlite.Database): number => {

    let transactionIndex = 0;

    const row: { transactionIndex: number } = database.prepare("select transactionIndex" +
      " from LicenceTransactions" +
      " where licenceId = ?" +
      " order by transactionIndex desc" +
      " limit 1")
      .get(licenceId);

    if (row) {
      transactionIndex = row.transactionIndex + 1;
    }

    return transactionIndex;
  };


export default getNextLicenceTransactionIndex;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetLicencesFilters {
  licenceCategoryKey?: string;
  licensee?: string;
  licenceStatus?: "" | "active" | "past"
}


export const getLicences = (filters: GetLicencesFilters, options: {
  limit: number;
  offset: number;
}): {
    count: number;
    licences: recordTypes.Licence[];
  } => {

  const database = sqlite(databasePath, {
    readonly: true
  });

  const currentDate = dateTimeFunctions.dateToInteger(new Date());

  const sqlParameters = [];

  let sqlWhereClause = " where l.recordDelete_timeMillis is null";

  if (filters.licenceCategoryKey && filters.licenceCategoryKey !== "") {
    sqlWhereClause += " and l.licenceCategoryKey = ?";
    sqlParameters.push(filters.licenceCategoryKey);
  }

  if (filters.licensee && filters.licensee !== "") {
    const licenseePieces = filters.licensee.trim().split(" ");

    for (const licenseePiece of licenseePieces) {
      sqlWhereClause += " and (l.licenseeName like '%' || ? || '%' or l.licenseeBusinessName like '%' || ? || '%')";
      sqlParameters.push(licenseePiece, licenseePiece);
    }
  }

  if (filters.licenceStatus) {
    if (filters.licenceStatus === "active") {
      sqlWhereClause += " and l.startDate <= ? and l.endDate >= ?";
      sqlParameters.push(currentDate, currentDate);

    } else if (filters.licenceStatus === "past") {
      sqlWhereClause += " and l.endDate < ?";
      sqlParameters.push(currentDate);
    }
  }

  let count = 0;

  if (options.limit !== -1) {

    count = database.prepare("select ifnull(count(*), 0)" +
      " from Licences l" +
      sqlWhereClause)
      .pluck()
      .get(sqlParameters);
  }

  let sql = "select l.licenceId," +
    " l.licenceCategoryKey, c.licenceCategory," +
    " l.licenceNumber," +
    " l.licenseeName, l.licenseeBusinessName," +
    " l.licenseeAddress1, l.licenseeAddress2," +
    " l.licenseeCity, l.licenseeProvince, l.licenseePostalCode," +
    " l.startDate, userFn_dateIntegerToString(l.startDate) as startDateString," +
    " l.endDate, userFn_dateIntegerToString(l.endDate) as endDateString," +
    " l.issueDate, userFn_dateIntegerToString(l.issueDate) as issueDateString" +
    " from Licences l" +
    " left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey" +
    sqlWhereClause +
    " order by startDate desc, endDate desc, licenceId";

  if (options.limit !== -1) {
    sql += " limit " + options.limit.toString() +
      " offset " + (options.offset || 0).toString();
  }

  database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);

  const rows: recordTypes.Licence[] = database
    .prepare(sql)
    .all(sqlParameters);

  database.close();

  return {
    count,
    licences: rows
  };
};


export default getLicences;

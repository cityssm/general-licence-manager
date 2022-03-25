import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getLicenceFields } from "./getLicenceFields.js";
import { getLicenceTransactions } from "./getLicenceTransactions.js";

import type * as recordTypes from "../../types/recordTypes";


interface GetLicencesFilters {
  licenceCategoryKey?: string;
  licensee?: string;
  licenceStatus?: "" | "active" | "past",
  startDateMin?: number;
  startDateMax?: number;
  relatedLicenceId?: number | string;
  notRelatedLicenceId?: number | string;
  searchString?: string;
}


export const getLicences = (filters: GetLicencesFilters, options: {
  limit: number;
  offset: number;
  includeFields?: boolean;
  includeTransactions?: boolean;
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

  if (filters.startDateMin) {
    sqlWhereClause += " and l.startDate >= ?";
    sqlParameters.push(filters.startDateMin);
  }

  if (filters.startDateMax) {
    sqlWhereClause += " and l.startDate <= ?";
    sqlParameters.push(filters.startDateMax);
  }

  if (filters.relatedLicenceId) {
    sqlWhereClause += " and (" +
      "l.licenceId in (select licenceIdA from RelatedLicences where licenceIdB = ?)" +
      " or l.licenceId in (select licenceIdB from RelatedLicences where licenceIdA = ?))" +
      " and l.licenceId <> ?";

    sqlParameters.push(filters.relatedLicenceId, filters.relatedLicenceId, filters.relatedLicenceId);
  }

  if (filters.notRelatedLicenceId) {
    sqlWhereClause +=
      " and l.licenceId not in (select licenceIdA from RelatedLicences where licenceIdB = ?)" +
      " and l.licenceId not in (select licenceIdB from RelatedLicences where licenceIdA = ?)" +
      " and l.licenceId <> ?";

    sqlParameters.push(filters.notRelatedLicenceId, filters.notRelatedLicenceId, filters.notRelatedLicenceId);
  }

  if (filters.searchString && filters.searchString !== "") {

    const searchStringPieces = filters.searchString.trim().split(" ");

    for (const searchStringPiece of searchStringPieces) {
      sqlWhereClause += " and (" +
        " l.licenceNumber like '%' || ? || '%'" +
        " or c.licenceCategory like '%' || ? || '%'" +
        " or l.licenseeName like '%' || ? || '%'" +
        " or l.licenseeBusinessName like '%' || ? || '%'" +
        " or l.bankAccountNumber like '%' || ? || '%'" +
        ")";

      sqlParameters.push(searchStringPiece,
        searchStringPiece,
        searchStringPiece,
        searchStringPiece,
        searchStringPiece);
    }
  }

  let count = 0;

  if (options.limit !== -1) {

    count = database.prepare("select ifnull(count(*), 0)" +
      " from Licences l" +
      " left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey" +
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
    " order by startDate desc, endDate desc, licenceId desc";

  if (options.limit !== -1) {
    sql += " limit " + options.limit.toString() +
      " offset " + (options.offset || 0).toString();
  }

  database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);

  const rows: recordTypes.Licence[] = database
    .prepare(sql)
    .all(sqlParameters);

  if (options.limit === -1) {
    count = rows.length;
  }

  if (options.includeFields) {
    for (const licence of rows) {
      licence.licenceFields = getLicenceFields(licence.licenceId, licence.licenceCategoryKey, database);
    }
  }

  if (options.includeTransactions) {
    for (const licence of rows) {
      licence.licenceTransactions = getLicenceTransactions(licence.licenceId, database);
    }
  }

  database.close();

  return {
    count,
    licences: rows
  };
};


export default getLicences;

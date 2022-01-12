import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as configFunctions from "../functions.config.js";

import type * as recordTypes from "../../types/recordTypes";


const getNextYearFourDigitsLicenceNumber = (database: sqlite.Database): string => {

  const currentYear = new Date().getFullYear();

  let licenceNumber = database.prepare("select licenceNumber from Licences" +
    " where length(licenceNumber) = 9" +
    " and licecneNumber like '" + currentYear.toString() + "-%'" +
    " order by licenceNumber desc")
    .pluck()
    .get() as string;
};


export const getNextLicenceNumber = (database?: sqlite.Database): string => {

  let doCloseDatabase = false;

  if (!database) {

    database = sqlite(databasePath, {
      readonly: true
    });

    doCloseDatabase = true;
  }

  let licenceNumber = "";

  switch (configFunctions.getProperty("defaults.licenceNumberFunction")) {
    case "year-fourDigits":
      licenceNumber = getNextYearFourDigitsLicenceNumber(database);
      break;
  }

  if (doCloseDatabase) {
    database.close();
  }

  return licenceNumber;
};


export default getNextLicenceNumber;

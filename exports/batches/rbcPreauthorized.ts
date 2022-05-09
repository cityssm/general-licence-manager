import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import * as modernJulianDate from "@cityssm/modern-julian-date";
import stringHash from "string-hash";

import type * as recordTypes from "../../types/recordTypes";

import type { GetBatchExportReturn } from "../batchExport";


const batchExportConfig = configFunctions.getProperty("exports.batches");

const NEWLINE = "\n";
const HEADER_LINE1 = "$$AAPASTD0152[" +
  (batchExportConfig.isTesting ? "TEST" : "PROD") +
  "[80$$";


const leftPad = (unpaddedString: string, paddingCharacter: string, finalLength: number): string => {
  return unpaddedString.padStart(finalLength, paddingCharacter).slice(-1 * finalLength);
};

const rightPad = (unpaddedString: string, paddingCharacter: string, finalLength: number): string => {
  return unpaddedString.padEnd(finalLength, paddingCharacter).slice(0, finalLength);
};

const calculateFileCreationNumber = (batchDate: Date): string => {
  const dayCount = ((batchDate.getFullYear() - 2022) * 366) + modernJulianDate.getDayOfYear(batchDate, true);
  return leftPad(dayCount.toString(), "0", 4);
};

const calculateCustomerNumber = (transaction: recordTypes.LicenceTransaction): string => {

  const textToHash = transaction.licenseeName.toLowerCase() + "::" +
    transaction.licenseeBusinessName.toLowerCase() + "::" +
    transaction.bankInstitutionNumber + "::" +
    transaction.bankTransitNumber + "::" +
    transaction.bankAccountNumber;

  return rightPad(stringHash(textToHash).toString(), " ", 19);
};

export const getBatchExport = (outstandingBatchTransactions: recordTypes.LicenceTransaction[]): GetBatchExportReturn => {

  const batchDate = dateTimeFunctions.dateStringToDate(outstandingBatchTransactions[0].batchDateString);

  const customerNumberMap = new Map<string, number>();

  let output = HEADER_LINE1 + NEWLINE;

  let recordCounter = 1;

  output += leftPad(recordCounter.toString(), "0", 6) +
    "A" +
    "HDR" +
    rightPad(batchExportConfig.header.clientNumber, "0", 10) +
    rightPad(batchExportConfig.header.clientName, " ", 30) +
    (batchExportConfig.isTesting ? "TEST" : calculateFileCreationNumber(batchDate)) +
    modernJulianDate.toModernJulianDate(batchDate) +
    batchExportConfig.header.currencyType +
    "1" +
    " ".padEnd(15) +
    NEWLINE;

  recordCounter += 1;

  output += leftPad(recordCounter.toString(), "0", 6) +
    " ".padEnd(8) +
    " ".padEnd(9) +
    " ".padEnd(46) +
    " ".padEnd(2) +
    " ".padEnd(8) +
    " " +
    NEWLINE;

  let totalValue = 0;

  for (const batchTransaction of outstandingBatchTransactions) {

    const customerNumber = calculateCustomerNumber(batchTransaction);

    let paymentNumber = 0;

    if (customerNumberMap.has(customerNumber)) {
      paymentNumber = customerNumberMap.get(customerNumber) + 1;
    }

    customerNumberMap.set(customerNumber, paymentNumber);

    recordCounter += 1;

    output += leftPad(recordCounter.toString(), "0", 6) +
      "D" +
      batchExportConfig.record.transactionCode +
      rightPad(batchExportConfig.header.clientNumber, "0", 10) +
      " " +
      customerNumber +
      leftPad(paymentNumber.toString(), "0", 2) +
      leftPad(batchTransaction.bankInstitutionNumber, "0", 4) +
      leftPad(batchTransaction.bankTransitNumber, "0", 5) +
      rightPad(batchTransaction.bankAccountNumber, " ", 18) +
      " " +
      leftPad(Math.round(batchTransaction.transactionAmount * 100).toString(), "0", 10) +
      NEWLINE;

    recordCounter += 1;

    output += leftPad(recordCounter.toString(), "0", 6) +
      modernJulianDate.toModernJulianDate(dateTimeFunctions.dateStringToDate(batchTransaction.batchDateString)) +
      rightPad(batchTransaction.licenseeName + (batchTransaction.licenseeBusinessName === "" ? "" : " - " + batchTransaction.licenseeBusinessName), " ", 30) +
      batchExportConfig.record.languageCode +
      " " +
      rightPad(batchExportConfig.record.clientShortName, " ", 15) +
      batchExportConfig.header.currencyType +
      " " +
      batchExportConfig.record.destinationCountry +
      " ".padEnd(2) +
      " ".padEnd(2) +
      "N" +
      " ".padEnd(8) +
      NEWLINE;

    totalValue += batchTransaction.transactionAmount;
  }

  recordCounter += 1;

  output += leftPad(recordCounter.toString(), "0", 6) +
    "Z" +
    "TRL" +
    rightPad(batchExportConfig.header.clientNumber, "0", 10) +
    "0".padEnd(6, "0") +
    "0".padEnd(14, "0") +
    leftPad(outstandingBatchTransactions.length.toString(), "0", 6) +
    leftPad(Math.round(totalValue * 100).toString(), "0", 14) +
    "0".padEnd(2, "0") +
    "0".padEnd(6, "0") +
    "0".padEnd(12, "0") +
    NEWLINE;

  recordCounter += 1;

  output += leftPad(recordCounter.toString(), "0", 6) +
    " ".padEnd(63) +
    " ".padEnd(2) +
    " " +
    " ".padEnd(8) +
    NEWLINE;

  return {
    fileContentType: "text/plain",
    fileName: "batch-" + outstandingBatchTransactions[0].batchDate.toString() + ".txt",
    fileData: output
  };
};

export default getBatchExport;

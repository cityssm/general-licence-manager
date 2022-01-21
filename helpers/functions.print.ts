import fs from "fs/promises";
import path from "path";

import type * as recordTypes from "../types/recordTypes";

let printEJSList: string[] = [];


export const getPrintEJSList = async (): Promise<string[]> => {

  if (printEJSList.length === 0) {

    const printPath = path.join("print");

    const allFiles = await fs.readdir(printPath);

    const ejsList: string[] = [];

    for (const fileName of allFiles) {

      const filePath = path.join(printPath, fileName);

      const fileStats = await fs.stat(filePath);

      if (fileStats.isFile() && fileName.toLowerCase().endsWith(".ejs")) {
        ejsList.push(fileName.slice(0, -4));
      }
    }

    printEJSList = ejsList;
  }

  return printEJSList;
};


export const getLicenceFieldByPrintKey = (licence: recordTypes.Licence, printKey: string): recordTypes.LicenceField => {
  return licence.licenceFields.find((currentLicenceField) => {
    return currentLicenceField.printKey === printKey;
  });
};


export const getLicenceApprovalByPrintKey = (licence: recordTypes.Licence, printKey: string): recordTypes.LicenceApproval => {
  return licence.licenceApprovals.find((currentLicenceApproval) => {
    return currentLicenceApproval.printKey === printKey;
  });
};

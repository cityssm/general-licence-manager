import sqlite from "better-sqlite3";


export const saveLicenceApprovals =
  (licenceId: number | string,
    licenceApprovalKeys: string[],
    licenceForm: { [approvalKey: string]: string },
    database: sqlite.Database): boolean => {

    for (const licenceApprovalKey of licenceApprovalKeys) {

      if (licenceForm["approval--" + licenceApprovalKey]) {

      database
        .prepare("insert into LicenceApprovals" +
          "(licenceId, licenceApprovalKey)" +
          " values (?, ?)")
        .run(licenceId,
          licenceApprovalKey);
        }
    }

    return true;
  };


export default saveLicenceApprovals;

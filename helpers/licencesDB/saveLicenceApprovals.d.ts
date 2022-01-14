import sqlite from "better-sqlite3";
export declare const saveLicenceApprovals: (licenceId: number | string, licenceApprovalKeys: string[], licenceForm: {
    [approvalKey: string]: string;
}, database: sqlite.Database) => boolean;
export default saveLicenceApprovals;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../data/databasePaths.js";
import debug from "debug";
const debugSQL = debug("general-licence-manager:databaseInitializer");
const recordColumns = " recordCreate_userName varchar(30) not null," +
    " recordCreate_timeMillis integer not null," +
    " recordUpdate_userName varchar(30) not null," +
    " recordUpdate_timeMillis integer not null," +
    " recordDelete_userName varchar(30)," +
    " recordDelete_timeMillis integer";
export const initLicencesDB = () => {
    const licencesDB = sqlite(databasePath);
    const row = licencesDB
        .prepare("select name from sqlite_master where type = 'table' and name = 'LicenceCategories'")
        .get();
    if (!row) {
        debugSQL("Creating licences.db");
        licencesDB.prepare("create table if not exists LicenceCategories (" +
            "licenceCategoryKey varchar(20) primary key," +
            " licenceCategory varchar(100) not null," +
            " bylawNumber varchar(20) default ''," +
            " licenceLengthYears smallint not null default 1," +
            " licenceLengthMonths smallint default 0," +
            " licenceLengthDays smallint not null default 0," +
            " printEJS varchar(50) not null default ''," +
            recordColumns +
            ") without rowid").run();
        licencesDB.prepare("create table if not exists LicenceCategoryFees (" +
            "licenceCategoryKey varchar(20) not null," +
            " effectiveStartDate integer not null," +
            " effectiveEndDate integer," +
            " licenceFee decimal(10, 2) not null default 0," +
            " renewalFee decimal(10, 2)," +
            " replacementFee decimal(10, 2)," +
            recordColumns + "," +
            " primary key (licenceCategoryKey, effectiveStartDate)," +
            " foreign key (licenceCategoryKey) references LicenceCategories (licenceCategoryKey)" +
            ") without rowid").run();
        licencesDB.prepare("create table if not exists LicenceCategoryFields (" +
            "licenceFieldKey varchar(50) not null primary key," +
            " licenceCategoryKey varchar(20) not null," +
            " licenceField varchar(100) not null," +
            " licenceFieldDescription text," +
            " isRequired bit not null default 0," +
            " minimumLength smallint not null default 1," +
            " maximumLength smallint not null default 100," +
            " pattern varchar(100)," +
            " orderNumber smallint not null default 0," +
            recordColumns + "," +
            " foreign key (licenceCategoryKey) references LicenceCategories (licenceCategoryKey)" +
            ") without rowid").run();
        licencesDB.prepare("create table if not exists LicenceCategoryApprovals (" +
            "licenceApprovalKey varchar(50) not null primary key," +
            " licenceCategoryKey varchar(20) not null," +
            " licenceApproval varchar(100) not null," +
            " licenceApprovalDescription text," +
            " isRequiredForNew bit not null default 0," +
            " isRequiredForRenewal bit not null default 0," +
            " orderNumber smallint not null default 0," +
            recordColumns + "," +
            " foreign key (licenceCategoryKey) references LicenceCategories (licenceCategoryKey)" +
            ") without rowid").run();
        licencesDB.prepare("create table if not exists Licences (" +
            "licenceId integer primary key autoincrement," +
            " licenceCategoryKey varchar(20) not null," +
            " licenceNumber varchar(20)," +
            " licenseeName varchar(100) not null," +
            " licenseeBusinessName varchar(100)," +
            " licenseeAddress1 varchar(50)," +
            " licenseeAddress2 varchar(50)," +
            " licenseeCity varchar(20)," +
            " licenseeProvince varchar(2)," +
            " licenseePostalCode varchar(7)," +
            " isRenewal bit not null default 0," +
            " startDate integer, endDate integer," +
            " issueDate integer, issueTime integer," +
            " licenceFee decimal(10, 2) not null," +
            " replacementFee decimal(10, 2) not null," +
            recordColumns + "," +
            " foreign key (licenceCategoryKey) references LicenceCategories (licenceCategoryKey)" +
            ")").run();
        licencesDB.prepare("create table if not exists LicenceFields (" +
            "licenceId integer not null," +
            " licenceFieldKey varchar(50) not null," +
            " licenceFieldValue text," +
            " primary key (licenceId, licenceFieldKey)" +
            " foreign key (licenceId) references Licences (licenceId)" +
            ") without rowid").run();
        licencesDB.prepare("create table if not exists LicenceApprovals (" +
            "licenceId integer not null," +
            " licenceApprovalKey varchar(50) not null," +
            " primary key (licenceId, licenceApprovalKey)" +
            " foreign key (licenceId) references Licences (licenceId)" +
            ") without rowid").run();
        licencesDB.prepare("create table if not exists LicenceTransactions (" +
            "licenceId integer not null," +
            " transactionIndex integer not null," +
            " transactionDate integer not null," +
            " transactionTime integer not null," +
            " externalReceiptNumber varchar(20)," +
            " transactionAmount decimal(10, 2) not null," +
            " transactionNote text," +
            recordColumns + "," +
            " primary key (licenceId, transactionIndex)," +
            " foreign key (licenceId) references Licences (licenceId)" +
            ") without rowid").run();
        licencesDB.close();
        return true;
    }
    return false;
};

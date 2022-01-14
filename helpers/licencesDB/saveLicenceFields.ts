import sqlite from "better-sqlite3";


export const saveLicenceFields =
  (licenceId: number | string,
    licenceFieldKeys: string[],
    licenceForm: { [fieldKey: string]: string },
    database: sqlite.Database): boolean => {

    for (const licenceFieldKey of licenceFieldKeys) {

      const licenceFieldValue = licenceForm["field--" + licenceFieldKey];

      database
        .prepare("insert into LicenceFields" +
          "(licenceId, licenceFieldKey, licenceFieldValue)" +
          " values (?, ?, ?)")
        .run(licenceId,
          licenceFieldKey,
          licenceFieldValue);
    }

    return true;
  };


export default saveLicenceFields;

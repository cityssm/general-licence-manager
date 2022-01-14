export const saveLicenceFields = (licenceId, licenceFieldKeys, licenceForm, database) => {
    for (const licenceFieldKey of licenceFieldKeys) {
        const licenceFieldValue = licenceForm["field--" + licenceFieldKey];
        database
            .prepare("insert into LicenceFields" +
            "(licenceId, licenceFieldKey, licenceFieldValue)" +
            " values (?, ?, ?)")
            .run(licenceId, licenceFieldKey, licenceFieldValue);
    }
    return true;
};
export default saveLicenceFields;

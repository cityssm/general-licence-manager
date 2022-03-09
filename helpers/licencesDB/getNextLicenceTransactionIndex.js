export const getNextLicenceTransactionIndex = (licenceId, database) => {
    let transactionIndex = 0;
    const row = database.prepare("select transactionIndex" +
        " from LicenceTransactions" +
        " where licenceId = ?" +
        " order by transactionIndex desc" +
        " limit 1")
        .get(licenceId);
    if (row) {
        transactionIndex = row.transactionIndex + 1;
    }
    return transactionIndex;
};
export default getNextLicenceTransactionIndex;

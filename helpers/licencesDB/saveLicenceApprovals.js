export const saveLicenceApprovals = (licenceId, licenceApprovalKeys, licenceForm, database) => {
    for (const licenceApprovalKey of licenceApprovalKeys) {
        if (licenceForm["approval--" + licenceApprovalKey]) {
            database
                .prepare("insert into LicenceApprovals" +
                "(licenceId, licenceApprovalKey)" +
                " values (?, ?)")
                .run(licenceId, licenceApprovalKey);
        }
    }
    return true;
};
export default saveLicenceApprovals;

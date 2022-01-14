import type * as expressSession from "express-session";
interface UpdateLicenceForm {
    licenceId: string;
    licenceNumber: string;
    licenseeName: string;
    licenseeBusinessName: string;
    licenseeAddress1: string;
    licenseeAddress2: string;
    licenseeCity: string;
    licenseeProvince: string;
    licenseePostalCode: string;
    isRenewal?: string;
    startDateString: string;
    endDateString: string;
    licenceFee: string;
    replacementFee: string;
    licenceFieldKeys?: string;
    licenceApprovalKeys?: string;
    [fieldOrApprovalKey: string]: string;
}
export declare const updateLicence: (licenceForm: UpdateLicenceForm, requestSession: expressSession.Session) => boolean;
export default updateLicence;

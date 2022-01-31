import type * as recordTypes from "../../types/recordTypes";
interface CreateLicenceForm {
    licenceCategoryKey: string;
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
export declare const createLicence: (licenceForm: CreateLicenceForm, requestSession: recordTypes.PartialSession) => number;
export default createLicence;

import type * as recordTypes from "../../types/recordTypes";
interface CreateLicenceForm {
    licenceCategoryKey: string;
    licenceNumber: string;
    relatedLicenceId?: string;
    licenseeName: string;
    licenseeBusinessName: string;
    licenseeAddress1: string;
    licenseeAddress2: string;
    licenseeCity: string;
    licenseeProvince: string;
    licenseePostalCode: string;
    bankInstitutionNumber: string;
    bankTransitNumber: string;
    bankAccountNumber: string;
    isRenewal?: string;
    startDateString: string;
    endDateString: string;
    baseLicenceFee: string;
    baseReplacementFee: string;
    licenceFieldKeys?: string;
    licenceApprovalKeys?: string;
    [fieldOrApprovalKey: string]: string;
}
export declare const createLicence: (licenceForm: CreateLicenceForm, requestSession: recordTypes.PartialSession) => number;
export default createLicence;

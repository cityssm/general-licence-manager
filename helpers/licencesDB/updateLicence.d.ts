export interface UpdateLicenceForm {
    licenceId: string;
    licenceNumber: string;
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
    baseLicenceFee?: string;
    baseReplacementFee?: string;
    licenceFee: string;
    replacementFee: string;
    licenceFieldKeys?: string;
    licenceApprovalKeys?: string;
    [fieldOrApprovalKey: string]: string;
}
export default function updateLicence(licenceForm: UpdateLicenceForm, sessionUser: GLMUser): boolean;

interface DeleteLicenceAdditionalFeeReturn {
    licenceFee: number;
}
export default function deleteLicenceAdditionalFee(licenceId: string | number, licenceAdditionalFeeKey: string, sessionUser: GLMUser): DeleteLicenceAdditionalFeeReturn;
export {};

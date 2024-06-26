import addLicenceAdditionalFee from '../../database/addLicenceAdditionalFee.js';
export default function handler(request, response) {
    const feeDetails = addLicenceAdditionalFee(request.body.licenceId, request.body.licenceAdditionalFeeKey, request.session.user);
    const additionalFee = {
        licenceAdditionalFeeKey: feeDetails.licenceCategoryAdditionalFee.licenceAdditionalFeeKey,
        additionalFeeAmount: feeDetails.additionalFeeAmount,
        additionalFee: feeDetails.licenceCategoryAdditionalFee.additionalFee
    };
    response.json({
        success: true,
        licenceFee: feeDetails.licenceFee,
        additionalFee
    });
}

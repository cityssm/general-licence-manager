import addLicenceAdditionalFee from '../../helpers/licencesDB/addLicenceAdditionalFee.js';
export async function handler(request, response) {
    const feeDetails = addLicenceAdditionalFee(request.body.licenceId, request.body.licenceAdditionalFeeKey, request.session);
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
export default handler;

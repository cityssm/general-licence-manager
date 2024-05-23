import deleteLicenceAdditionalFee from '../../database/deleteLicenceAdditionalFee.js';
export default function handler(request, response) {
    const feeDetails = deleteLicenceAdditionalFee(request.body.licenceId, request.body.licenceAdditionalFeeKey, request.session.user);
    response.json({
        success: true,
        licenceFee: feeDetails.licenceFee
    });
}

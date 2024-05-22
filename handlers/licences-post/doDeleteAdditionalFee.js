import deleteLicenceAdditionalFee from '../../helpers/licencesDB/deleteLicenceAdditionalFee.js';
export default function handler(request, response) {
    const feeDetails = deleteLicenceAdditionalFee(request.body.licenceId, request.body.licenceAdditionalFeeKey, request.session);
    response.json({
        success: true,
        licenceFee: feeDetails.licenceFee
    });
}

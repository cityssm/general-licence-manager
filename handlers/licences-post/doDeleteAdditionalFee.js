import { deleteLicenceAdditionalFee } from "../../helpers/licencesDB/deleteLicenceAdditionalFee.js";
export const handler = async (request, response) => {
    const feeDetails = deleteLicenceAdditionalFee(request.body.licenceId, request.body.licenceAdditionalFeeKey, request.session);
    response.json({
        success: (feeDetails ? true : false),
        licenceFee: feeDetails.licenceFee
    });
};
export default handler;

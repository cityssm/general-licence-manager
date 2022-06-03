import type { RequestHandler } from "express";

import { addLicenceAdditionalFee } from "../../helpers/licencesDB/addLicenceAdditionalFee.js";

import * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = async (request, response) => {

  const feeDetails = addLicenceAdditionalFee(
    request.body.licenceId, request.body.licenceAdditionalFeeKey, request.session);

  const additionalFee: recordTypes.LicenceAdditionalFee = {
    licenceAdditionalFeeKey: feeDetails.licenceCategoryAdditionalFee.licenceAdditionalFeeKey,
    additionalFeeAmount: feeDetails.additionalFeeAmount,
    additionalFee: feeDetails.licenceCategoryAdditionalFee.additionalFee
  };

  response.json({
    success: (additionalFee ? true : false),
    licenceFee: feeDetails.licenceFee,
    additionalFee
  });
};


export default handler;

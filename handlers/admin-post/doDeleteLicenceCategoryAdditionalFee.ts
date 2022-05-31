import type { RequestHandler } from "express";

import { deleteLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/deleteLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceAdditionalFeeKey = request.body.licenceAdditionalFeeKey as string;

  const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey);

  if (licenceCategoryAdditionalFee) {
    deleteLicenceCategoryAdditionalFee(licenceAdditionalFeeKey, request.session);

    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryAdditionalFee.licenceCategoryKey);

    response.json({
      success: true,
      licenceCategoryAdditionalFees
    });

  } else {

    response.json({
      success: false
    });
  }
};


export default handler;

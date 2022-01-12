import type { RequestHandler } from "express";

import { deleteLicenceCategoryFee } from "../../helpers/licencesDB/deleteLicenceCategoryFee.js";
import { getLicenceCategoryFee } from "../../helpers/licencesDB/getLicenceCategoryFee.js";
import { getLicenceCategoryFees } from "../../helpers/licencesDB/getLicenceCategoryFees.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceFeeId = request.body.licenceFeeId as string;

  const licenceCategoryFee = getLicenceCategoryFee(licenceFeeId);

  if (licenceCategoryFee) {
    deleteLicenceCategoryFee(licenceFeeId, request.session);
    const licenceCategoryFees = getLicenceCategoryFees(licenceCategoryFee.licenceCategoryKey, "all");

    response.json({
      success: true,
      licenceCategoryFees
    });

  } else {

    response.json({
      success: false
    });
  }
};


export default handler;

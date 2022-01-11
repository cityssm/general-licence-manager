import type { RequestHandler } from "express";

import { deleteLicenceCategoryField } from "../../helpers/licencesDB/deleteLicenceCategoryField.js";
import { getLicenceCategoryField } from "../../helpers/licencesDB/getLicenceCategoryField.js";
import { getLicenceCategoryFields } from "../../helpers/licencesDB/getLicenceCategoryFields.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceFieldKey = request.body.licenceFieldKey as string;

  const licenceCategoryField = getLicenceCategoryField(licenceFieldKey);

  if (licenceCategoryField) {
    deleteLicenceCategoryField(licenceFieldKey, request.session);
    const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryField.licenceCategoryKey);

    response.json({
      success: true,
      licenceCategoryFields
    });

  } else {

    response.json({
      success: false
    });
  }


};


export default handler;

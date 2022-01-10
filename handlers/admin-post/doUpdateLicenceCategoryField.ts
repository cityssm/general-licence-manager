import type { RequestHandler } from "express";

import { updateLicenceCategoryField } from "../../helpers/licencesDB/updateLicenceCategoryField.js";
import { getLicenceCategoryField } from "../../helpers/licencesDB/getLicenceCategoryField.js";
import { getLicenceCategoryFields } from "../../helpers/licencesDB/getLicenceCategoryFields.js";


export const handler: RequestHandler = async (request, response) => {

  const success = updateLicenceCategoryField(request.body, request.session);

  const licenceCategoryField = getLicenceCategoryField(request.body.licenceFieldKey);

  const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryField.licenceCategoryKey);

  response.json({
    success,
    licenceCategoryFields
  });
};


export default handler;

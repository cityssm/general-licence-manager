import type { RequestHandler } from "express";

import { moveLicenceCategoryField } from "../../helpers/licencesDB/moveLicenceCategoryField.js";
import { getLicenceCategoryFields } from "../../helpers/licencesDB/getLicenceCategoryFields.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceFieldKey_from = request.body.licenceFieldKey_from as string;
  const licenceFieldKey_to = request.body.licenceFieldKey_to as string;

  const licenceCategoryKey = moveLicenceCategoryField(licenceFieldKey_from, licenceFieldKey_to, request.session);

  const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryKey);

  response.json({
    licenceCategoryFields
  });
};


export default handler;

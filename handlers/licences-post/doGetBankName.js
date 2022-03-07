import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";
export const handler = async (request, response) => {
    const bankName = getCanadianBankName(request.body.bankInstitutionNumber, request.body.bankTransitNumber);
    response.json({
        bankName
    });
};
export default handler;

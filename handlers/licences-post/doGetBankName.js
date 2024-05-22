import { getCanadianBankName } from '@cityssm/get-canadian-bank-name';
export default function handler(request, response) {
    const bankName = getCanadianBankName(request.body.bankInstitutionNumber, request.body.bankTransitNumber);
    response.json({
        bankName
    });
}

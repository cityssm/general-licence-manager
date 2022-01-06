import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";
export const handler = async (_request, response) => {
    const licenceCategories = getLicenceCategories();
    response.json({
        licenceCategories
    });
};
export default handler;

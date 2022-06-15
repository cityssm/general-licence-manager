import { cleanupDatabase } from "../../helpers/licencesDB/cleanupDatabase.js";
export const handler = async (_request, response) => {
    const rowCount = cleanupDatabase();
    response.json({
        success: true,
        rowCount
    });
};
export default handler;

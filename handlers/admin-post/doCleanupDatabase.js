import cleanupDatabase from '../../database/cleanupDatabase.js';
export default function handler(_request, response) {
    const rowCount = cleanupDatabase();
    response.json({
        success: true,
        rowCount
    });
}

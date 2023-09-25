import * as configFunctions from '../../helpers/functions.config.js';
import { getBatchExport } from '../../exports/batchExport.js';
export const handler = (request, response) => {
    const batchDate = Number.parseInt(request.params.batchDate, 10);
    const batchExport = getBatchExport(batchDate);
    if (!batchExport) {
        return response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=batchExportError');
    }
    response.setHeader('Content-Disposition', 'attachment; filename=' + batchExport.fileName);
    response.setHeader('Content-Type', batchExport.fileContentType);
    response.send(batchExport.fileData);
};
export default handler;

import { getBatchExport } from '../../exports/batchExport.js';
import * as configFunctions from '../../helpers/functions.config.js';
export default function handler(request, response) {
    const batchDate = Number.parseInt(request.params.batchDate, 10);
    const batchExport = getBatchExport(batchDate);
    if (batchExport === undefined) {
        response.redirect(configFunctions.getConfigProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=batchExportError');
        return;
    }
    response.setHeader('Content-Disposition', `attachment; filename=${batchExport.fileName}`);
    response.setHeader('Content-Type', batchExport.fileContentType);
    response.send(batchExport.fileData);
}

import path from 'node:path';
import * as configFunctions from './helpers/functions.config.js';
const __dirname = '.';
export const serviceConfig = {
    name: configFunctions.getProperty('application.applicationName'),
    description: 'A web application for managing the licences issued by municipalities.',
    script: path.join(__dirname, 'bin', 'www.js')
};

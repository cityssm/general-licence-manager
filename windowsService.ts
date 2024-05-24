import path from 'node:path'

import type { ServiceConfig } from 'node-windows'

import { getConfigProperty } from './helpers/functions.config.js'

const __dirname = '.'

export const serviceConfig: ServiceConfig = {
  name: getConfigProperty('application.applicationName'),
  description:
    'A web application for managing the licences issued by municipalities.',
  script: path.join(__dirname, 'bin', 'www.js')
}

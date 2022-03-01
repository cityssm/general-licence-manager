import path from "path";

import * as configFunctions from "./helpers/functions.config.js";

import type { ServiceConfig } from "node-windows";


const __dirname = ".";


export const serviceConfig: ServiceConfig = {
  name: configFunctions.getProperty("application.applicationName"),
  description: "A web application for managing the licences issued by municipalities.",
  script: path.join(__dirname, "bin", "www.js")
};

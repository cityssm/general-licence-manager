import path from "path";
import type { ServiceConfig } from "node-windows";


const __dirname = ".";

export const serviceConfig: ServiceConfig = {
  name: "General Licence Manager",
  description: "A web application for managing the licences issued by municipalities.",
  script: path.join(__dirname, "bin", "www.js")
};

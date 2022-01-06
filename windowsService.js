import path from "path";
const __dirname = ".";
export const serviceConfig = {
    name: "General Licence Manager",
    description: "A web application for managing the licences issued by municipalities.",
    script: path.join(__dirname, "bin", "www.js")
};

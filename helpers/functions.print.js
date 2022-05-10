import fs from "fs/promises";
import path from "path";
let printEJSList = [];
export const getPrintEJSList = async () => {
    if (printEJSList.length === 0) {
        const printPath = path.join("print");
        const allFiles = await fs.readdir(printPath);
        const ejsList = [];
        for (const fileName of allFiles) {
            const filePath = path.join(printPath, fileName);
            const fileStats = await fs.stat(filePath);
            if (fileStats.isFile() && fileName.toLowerCase().endsWith(".ejs")) {
                ejsList.push(fileName.slice(0, -4));
            }
        }
        printEJSList = ejsList;
    }
    return printEJSList;
};
export const getLicenceFieldByPrintKey = (licence, printKey) => {
    return licence.licenceFields.find((currentLicenceField) => {
        return currentLicenceField.printKey === printKey;
    });
};
export const getLicenceFieldsByPrintKeyPiece = (licence, printKeyPiece) => {
    return licence.licenceFields.filter((currentLicenceField) => {
        return currentLicenceField.printKey.includes(printKeyPiece);
    });
};
export const getLicenceApprovalByPrintKey = (licence, printKey) => {
    return licence.licenceApprovals.find((currentLicenceApproval) => {
        return currentLicenceApproval.printKey === printKey;
    });
};

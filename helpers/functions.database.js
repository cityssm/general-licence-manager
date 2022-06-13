import fs from "node:fs";
import { licencesDB as databasePath, backupFolder } from "../data/databasePaths.js";
export const backupDatabase = async () => {
    const databasePathSplit = databasePath.split(/[/\\]/g);
    const backupDatabasePath = backupFolder + "/" +
        databasePathSplit[databasePathSplit.length - 1] + "." + Date.now().toString();
    await fs.promises.copyFile(databasePath, backupDatabasePath);
    return backupDatabasePath;
};

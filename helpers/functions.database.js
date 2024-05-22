import fs from 'node:fs';
import { backupFolder, licencesDB as databasePath } from '../data/databasePaths.js';
export async function backupDatabase() {
    const databasePathSplit = databasePath.split(/[/\\]/g);
    const backupDatabasePath = `${backupFolder}/${databasePathSplit.at(-1)}.${Date.now().toString()}`;
    await fs.promises.copyFile(databasePath, backupDatabasePath);
    return backupDatabasePath;
}

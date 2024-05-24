import fs from 'node:fs'
import path from 'node:path'

import {
  backupFolder,
  licencesDB as databasePath
} from '../data/databasePaths.js'

export async function backupDatabase(): Promise<string> {
  const databasePathSplit = databasePath.split(/[/\\]/)

  const backupDatabasePath = path.join(
    backupFolder,
    `${databasePathSplit.at(-1)}.${Date.now().toString()}`
  )

  await fs.promises.copyFile(databasePath, backupDatabasePath)

  return backupDatabasePath
}

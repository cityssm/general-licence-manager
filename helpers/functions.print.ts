import fs from "fs/promises";
import path from "path";

let printEJSList: string[] = [];

export const getPrintEJSList = async (): Promise<string[]> => {

  if (printEJSList.length === 0) {

    const printPath = path.join("print");

    const allFiles = await fs.readdir(printPath);

    const ejsList: string[] = [];

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

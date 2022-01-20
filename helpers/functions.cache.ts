import Debug from "debug";

import database_getLicenceCategories from "./licencesDB/getLicenceCategories.js";
import database_getLicenceCategory from "./licencesDB/getLicenceCategory.js";

import type * as recordTypes from "../types/recordTypes";

const debug = Debug("general-licence-manager:cache");


let licenceCategoriesList: recordTypes.LicenceCategory[];
const licenceCategoriesMap = new Map<string, recordTypes.LicenceCategory>();


export const getLicenceCategories = (): recordTypes.LicenceCategory[] => {

  if (!licenceCategoriesList) {
    debug("Cache miss: getLicenceCategories");
    licenceCategoriesList = database_getLicenceCategories();
  }
  return licenceCategoriesList;
};


export const getLicenceCategory = (licenceCategoryKey: string): recordTypes.LicenceCategory => {

  if (!licenceCategoriesMap.has(licenceCategoryKey)) {
    debug("Cache miss: getLicenceCategory(" + licenceCategoryKey + ")");
    licenceCategoriesMap.set(licenceCategoryKey, database_getLicenceCategory(licenceCategoryKey, {
      includeFields: true,
      includeFees: "current",
      includeApprovals: true
    }));
  }

  return licenceCategoriesMap.get(licenceCategoryKey);
};


export const clearAll = (): void => {
  licenceCategoriesList = undefined;
  licenceCategoriesMap.clear();
};

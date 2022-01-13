import Debug from "debug";
import database_getLicenceCategories from "./licencesDB/getLicenceCategories.js";
import database_getLicenceCategory from "./licencesDB/getLicenceCategory.js";
const debug = Debug("general-licence-manager:cache");
let licenceCategoriesList;
const licenceCategoriesMap = new Map();
export const getLicenceCategories = () => {
    if (!licenceCategoriesList) {
        debug("Cache miss: getLicenceCategories");
        licenceCategoriesList = database_getLicenceCategories();
    }
    return licenceCategoriesList;
};
export const getLicenceCategory = (licenceCategoryKey) => {
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
export const clearAll = () => {
    licenceCategoriesList = undefined;
    licenceCategoriesMap.clear();
};

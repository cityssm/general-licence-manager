"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const aliasSettingNames = ["licenceAlias", "licenceAliasPlural",
        "licenseeAlias", "licenseeAliasPlural",
        "renewalAlias"];
    const populateAliases = (containerElement, settingName) => {
        const alias = exports[settingName];
        const elements = containerElement.querySelectorAll("[data-setting='" + settingName + "']");
        for (const element of elements) {
            element.textContent = alias;
        }
    };
    const glm = {
        populateAliases: (containerElement) => {
            for (const settingName of aliasSettingNames) {
                populateAliases(containerElement, settingName);
            }
        },
        getBankName: (bankInstitutionNumber, bankTransitNumber, callbackFunction) => {
            cityssm.postJSON(urlPrefix + "/licences/doGetBankName", {
                bankInstitutionNumber,
                bankTransitNumber
            }, (responseJSON) => {
                callbackFunction(responseJSON.bankName);
            });
        }
    };
    exports.glm = glm;
})();

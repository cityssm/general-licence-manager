"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
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
        }
    };
    exports.glm = glm;
})();

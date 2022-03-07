/* eslint-disable unicorn/prefer-module */

import type { GLM } from "../types/globalTypes";


(() => {

  const aliasSettingNames = ["licenceAlias", "licenceAliasPlural",
    "licenseeAlias", "licenseeAliasPlural",
    "renewalAlias"];

  const populateAliases = (containerElement: HTMLElement, settingName: string) => {

    const alias = exports[settingName] as string;

    const elements = containerElement.querySelectorAll("[data-setting='" + settingName + "']");
    for (const element of elements) {
      element.textContent = alias;
    }
  };

  const glm: GLM = {

    populateAliases: (containerElement: HTMLElement) => {

      for (const settingName of aliasSettingNames) {
        populateAliases(containerElement, settingName);
      }
    }
  };


  exports.glm = glm;

})();

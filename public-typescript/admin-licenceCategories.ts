/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {

  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  let licenceCategories: recordTypes.LicenceCategory[] = exports.licenceCategories;

  const licenceCategoriesContainerElement = document.querySelector("#container--licenceCategories") as HTMLElement;

  const renderLicenceCategories = () => {

    if (licenceCategories.length === 0) {
      licenceCategoriesContainerElement.innerHTML = "<div class=\"message is-warning\">" +
        "<p class=\"message-body\">There are no licence categories available.</p>" +
        "</div>";

      return;
    }

    const panelElement = document.createElement("div");
    panelElement.className = "panel";

    for (const licenceCategory of licenceCategories) {

      const panelBlockElement = document.createElement("a");
      panelBlockElement.className = "panel-block is-block";
      panelBlockElement.dataset.licenceCategoryKey = licenceCategory.licenceCategoryKey;

      panelBlockElement.innerHTML = "<strong>" + cityssm.escapeHTML(licenceCategory.licenceCategory) + "</strong><br />" +
        "<div class=\"columns\">" +
        ("<div class=\"column has-text-centered\">" +
          (licenceCategory.hasEffectiveFee
            ? "<i class=\"fas fa-check has-text-success\"></i><br /><span class=\"is-size-7\">Effective Fee</span>"
            : "<i class=\"fas fa-exclamation-triangle has-text-danger\"></i><br /><span class=\"is-size-7\">No Effective Fee</span>") +
          "</div>") +
        ("<div class=\"column has-text-centered\">" +
          (licenceCategory.printEJS === ""
            ? "<i class=\"fas fa-exclamation-triangle has-text-danger\"></i><br /><span class=\"is-size-7\">No Print Template</span>"
            : "<i class=\"fas fa-check has-text-success\"></i><br /><span class=\"is-size-7\">Print Template</span>") +
          "</div>") +
        "</div>";

      panelBlockElement.addEventListener("click", openEditLicenceCategoryModalByClick);

      panelElement.append(panelBlockElement);
    }

    licenceCategoriesContainerElement.innerHTML = "";
    licenceCategoriesContainerElement.append(panelElement);
  };

  /*
  const getLicenceCategories = () => {

    licenceCategoriesContainerElement.innerHTML = "<p class=\"has-text-centered has-text-grey-lighter\">" +
      "<i class=\"fas fa-3x fa-circle-notch fa-spin\" aria-hidden=\"true\"></i><br />" +
      "<em>Loading licence categories...</em>" +
      "</p>";

    cityssm.postJSON(urlPrefix + "/admin/doGetLicenceCategories", {},
      (responseJSON: { licenceCategories: recordTypes.LicenceCategory[] }) => {
        licenceCategories = responseJSON.licenceCategories;
        renderLicenceCategories();
      });
  };
  */

  /*
   * Edit Licence Category
   */

  const openEditLicenceCategoryModal = (licenceCategoryKey: string) => {

    cityssm.openHtmlModal("licenceCategory-edit", {
      onshow: (modalElement) => {

        (modalElement.querySelector("#licenceCategoryEdit--licenceCategoryKey") as HTMLInputElement).value = licenceCategoryKey;

        const printEJSElement = document.querySelector("#licenceCategoryEdit--printEJS") as HTMLSelectElement;

        for (const printEJS of (exports.printEJSList as string[])) {
          const optionElement = document.createElement("option");
          optionElement.value = printEJS;
          optionElement.textContent = printEJS;
          printEJSElement.append(optionElement);
        }


        cityssm.postJSON(urlPrefix + "/admin/doGetLicenceCategory", {
          licenceCategoryKey
        }, (responseJSON: { success?: boolean; licenceCategory?: recordTypes.LicenceCategory }) => {

          if (!responseJSON.success) {
            bulmaJS.alert({
              message: "Error loading Licence Category.",
              contextualColorName: "danger"
            });

            return;
          }

          const licenceCategory = responseJSON.licenceCategory;

          (modalElement.querySelector("#licenceCategoryEdit--licenceCategory") as HTMLInputElement).value = licenceCategory.licenceCategory;
          (modalElement.querySelector("#licenceCategoryEdit--bylawNumber") as HTMLInputElement).value = licenceCategory.bylawNumber;
        });
      },
      onshown: (modalElement, closeModalFunction) => {

        bulmaJS.toggleHtmlClipped();
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  };

  const openEditLicenceCategoryModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const licenceCategoryKey = (clickEvent.currentTarget as HTMLElement).dataset.licenceCategoryKey;
    openEditLicenceCategoryModal(licenceCategoryKey);
  };

  /*
   * Add Licence Category
   */

  const openAddLicenceCategoryModal = () => {

    let addLicenceCategoryCloseModalFunction: () => void;

    const addLicenceCategorySubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategory",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; licenceCategories?: recordTypes.LicenceCategory[]; licenceCategoryKey?: string }) => {

          if (responseJSON.success) {
            licenceCategories = responseJSON.licenceCategories;
            renderLicenceCategories();

            addLicenceCategoryCloseModalFunction();

            openEditLicenceCategoryModal(responseJSON.licenceCategoryKey);
          }
        });
    };

    cityssm.openHtmlModal("licenceCategory-add", {
      onshown: (modalElement, closeModalFunction) => {
        bulmaJS.toggleHtmlClipped();
        addLicenceCategoryCloseModalFunction = closeModalFunction;
        modalElement.querySelector("form").addEventListener("submit", addLicenceCategorySubmitFunction);
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  };

  /*
   * Initialize
   */

  renderLicenceCategories();

  document.querySelector("#button--addLicenceCategory").addEventListener("click", openAddLicenceCategoryModal);
})();

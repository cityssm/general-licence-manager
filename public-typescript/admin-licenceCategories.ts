/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;

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


  };

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

  renderLicenceCategories();

  /*
   * Add Licence Category
   */

  const openAddLicenceCategoryModal = () => {

    let addLicenceCategoryCloseModalFunction: () => void;

    const addLicenceCategorySubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategory",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; errorMessage?: string; licenceCategoryKey?: string }) => {

        });
    };

    cityssm.openHtmlModal("licenceCategory-add", {
      onshown: (modalElement, closeModalFunction) => {
        addLicenceCategoryCloseModalFunction = closeModalFunction;
        modalElement.querySelector("form").addEventListener("submit", addLicenceCategorySubmitFunction);
      }
    });
  };

  document.querySelector("#button--addLicenceCategory").addEventListener("click", openAddLicenceCategoryModal);
})();

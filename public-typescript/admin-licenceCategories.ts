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

  /*
   * Edit Licence Category
   */

  let doRefreshOnClose = false;
  let editModalElement: HTMLElement;

  // Licence Category Fields

  let licenceCategoryFields: recordTypes.LicenceCategoryField[];

  const openEditLicenceCategoryFieldModal = (licenceFieldKey: string) => {

    let editLicenceCategoryFieldModalCloseFunction: () => void;

    const updateLicenceCategoryFieldSubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategoryField",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; licenceCategoryFields: recordTypes.LicenceCategoryField[] }) => {
          if (responseJSON.success) {
            licenceCategoryFields = responseJSON.licenceCategoryFields;
            editLicenceCategoryFieldModalCloseFunction();
            renderLicenceCategoryFields();
          }
        });
    };

    const licenceCategoryField = licenceCategoryFields.find((possibleField) => {
      return possibleField.licenceFieldKey === licenceFieldKey;
    });

    cityssm.openHtmlModal("licenceCategoryField-edit", {
      onshow: (modalElement) => {

        (modalElement.querySelector("#licenceCategoryFieldEdit--licenceFieldKey") as HTMLInputElement).value = licenceFieldKey;

        (modalElement.querySelector("#licenceCategoryFieldEdit--licenceField") as HTMLInputElement).value = licenceCategoryField.licenceField;
        (modalElement.querySelector("#licenceCategoryFieldEdit--licenceFieldDescription") as HTMLTextAreaElement).value = licenceCategoryField.licenceFieldDescription;

        if (licenceCategoryField.isRequired) {
          (modalElement.querySelector("#licenceCategoryFieldEdit--isRequired") as HTMLInputElement).checked = true;
        }

        const minimumLengthElement = modalElement.querySelector("#licenceCategoryFieldEdit--minimumLength") as HTMLInputElement;
        const maximumLengthElement = modalElement.querySelector("#licenceCategoryFieldEdit--maximumLength") as HTMLInputElement;

        minimumLengthElement.value = licenceCategoryField.minimumLength.toString();

        minimumLengthElement.addEventListener("keyup", () => {
          maximumLengthElement.min = minimumLengthElement.value;
        });

        maximumLengthElement.value = licenceCategoryField.maximumLength.toString();
        maximumLengthElement.min = licenceCategoryField.minimumLength.toString();

        (modalElement.querySelector("#licenceCategoryFieldEdit--pattern") as HTMLInputElement).value = licenceCategoryField.pattern;
      },
      onshown: (modalElement, closeModalFunction) => {
        editLicenceCategoryFieldModalCloseFunction = closeModalFunction;

        modalElement.querySelector("#form--licenceCategoryFieldEdit")
          .addEventListener("submit", updateLicenceCategoryFieldSubmitFunction)
      }
    });
  };

  const openEditLicenceCategoryFieldModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const licenceFieldKey = (clickEvent.currentTarget as HTMLElement).dataset.licenceFieldKey;
    openEditLicenceCategoryFieldModal(licenceFieldKey);
  };

  const renderLicenceCategoryFields = () => {

    const fieldsContainerElement = editModalElement.querySelector("#container--licenceCategoryFields") as HTMLElement;

    if (licenceCategoryFields.length === 0) {
      fieldsContainerElement.innerHTML = "<div class=\"message is-info\">" +
        "<p class=\"message-body\">There are no additional fields captured with this licence.</p>" +
        "</div>";
    } else {

      const fieldsPanelElement = document.createElement("div");
      fieldsPanelElement.className = "panel";

      for (const categoryField of licenceCategoryFields) {

        const panelBlockElement = document.createElement("a");
        panelBlockElement.className = "panel-block is-block";
        panelBlockElement.dataset.licenceFieldKey = categoryField.licenceFieldKey;

        panelBlockElement.innerHTML = "<h4>" + cityssm.escapeHTML(categoryField.licenceField) + "</h4>" +
          "<p class=\"is-size-7\">" + cityssm.escapeHTML(categoryField.licenceFieldDescription) + "</p>";

        panelBlockElement.addEventListener("click", openEditLicenceCategoryFieldModalByClick);

        fieldsPanelElement.append(panelBlockElement);
      }

      fieldsContainerElement.innerHTML = "";
      fieldsContainerElement.append(fieldsPanelElement);
    }
  };

  // Licence Approvals

  let licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[];

  const openEditLicenceCategoryApprovalModal = (licenceApprovalKey: string) => {

  };

  const renderLicenceCategoryApprovals = () => {

  };

  // Licence Fees

  let licenceCategoryFees: recordTypes.LicenceCategoryFee[];

  const renderLicenceCategoryFees = () => {

  };

  // Main Details

  const openEditLicenceCategoryModal = (licenceCategoryKey: string) => {

    const updateLicenceCategorySubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      const formElement = formEvent.currentTarget;

      cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategory",
        formElement,
        (responseJSON: { success: boolean; errorMessage?: string; }) => {

          if (responseJSON.success) {
            bulmaJS.alert({
              message: "Licence Category updated successfully.",
              contextualColorName: "success"
            });

            doRefreshOnClose = true;

          } else {
            bulmaJS.alert({
              title: "Error Updating Licence Category",
              message: responseJSON.errorMessage,
              contextualColorName: "danger"
            });
          }
        });
    };

    const addLicenceCategoryFieldSubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      const formElement = formEvent.currentTarget as HTMLFormElement;

      cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategoryField",
        formElement,
        (responseJSON: { success: boolean; errorMessage?: string; licenceFieldKey?: string; licenceCategoryFields?: recordTypes.LicenceCategoryField[] }) => {

          if (responseJSON.success) {
            doRefreshOnClose = true;

            formElement.reset();

            licenceCategoryFields = responseJSON.licenceCategoryFields;

            renderLicenceCategoryFields();

            openEditLicenceCategoryFieldModal(responseJSON.licenceFieldKey);
          }
        });
    };

    const addLicenceCategoryApprovalSubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      const formElement = formEvent.currentTarget as HTMLFormElement;

      cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategoryApproval",
        formElement,
        (responseJSON: { success: boolean; errorMessage?: string; licenceApprovalKey?: string; licenceCategoryApprovals?: recordTypes.LicenceCategoryApproval[] }) => {

          if (responseJSON.success) {
            doRefreshOnClose = true;

            formElement.reset();

            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;

            renderLicenceCategoryApprovals();

            openEditLicenceCategoryApprovalModal(responseJSON.licenceApprovalKey);
          }
        });
    };

    const renderEditLicenceCategory = (responseJSON: { success?: boolean; licenceCategory?: recordTypes.LicenceCategory }) => {

      if (!responseJSON.success) {

        bulmaJS.alert({
          message: "Error loading Licence Category.",
          contextualColorName: "danger"
        });

        doRefreshOnClose = true;

        return;
      }

      const licenceCategory = responseJSON.licenceCategory;

      (editModalElement.querySelector("#licenceCategoryEdit--licenceCategory") as HTMLInputElement).value = licenceCategory.licenceCategory;
      (editModalElement.querySelector("#licenceCategoryEdit--bylawNumber") as HTMLInputElement).value = licenceCategory.bylawNumber;

      const printEJSElement = editModalElement.querySelector("#licenceCategoryEdit--printEJS") as HTMLSelectElement;

      if (!printEJSElement.querySelector("option[value='" + licenceCategory.printEJS + "']")) {
        const optionElement = document.createElement("option");
        optionElement.value = licenceCategory.printEJS;
        optionElement.textContent = licenceCategory.printEJS + " (Missing)";
        printEJSElement.append(optionElement);
      }

      printEJSElement.value = licenceCategory.printEJS;

      (editModalElement.querySelector("#licenceCategoryEdit--licenceLengthYears") as HTMLInputElement).value = licenceCategory.licenceLengthYears.toString();
      (editModalElement.querySelector("#licenceCategoryEdit--licenceLengthMonths") as HTMLInputElement).value = licenceCategory.licenceLengthMonths.toString();
      (editModalElement.querySelector("#licenceCategoryEdit--licenceLengthDays") as HTMLInputElement).value = licenceCategory.licenceLengthDays.toString();

      licenceCategoryFields = licenceCategory.licenceCategoryFields;
      renderLicenceCategoryFields();

      licenceCategoryApprovals = licenceCategory.licenceCategoryApprovals;
      renderLicenceCategoryApprovals();

      licenceCategoryFees = licenceCategory.licenceCategoryFees;
      renderLicenceCategoryFees();
    }

    doRefreshOnClose = false;

    cityssm.openHtmlModal("licenceCategory-edit", {
      onshow: (modalElement) => {

        editModalElement = modalElement;

        (modalElement.querySelector("#licenceCategoryEdit--licenceCategoryKey") as HTMLInputElement).value = licenceCategoryKey;
        (modalElement.querySelector("#licenceCategoryFieldAdd--licenceCategoryKey") as HTMLInputElement).value = licenceCategoryKey;
        (modalElement.querySelector("#licenceCategoryApprovalAdd--licenceCategoryKey") as HTMLInputElement).value = licenceCategoryKey;

        const printEJSElement = modalElement.querySelector("#licenceCategoryEdit--printEJS") as HTMLSelectElement;

        for (const printEJS of (exports.printEJSList as string[])) {
          const optionElement = document.createElement("option");
          optionElement.value = printEJS;
          optionElement.textContent = printEJS;
          printEJSElement.append(optionElement);
        }

        cityssm.postJSON(urlPrefix + "/admin/doGetLicenceCategory", {
          licenceCategoryKey
        },
          renderEditLicenceCategory);
      },
      onshown: (modalElement) => {

        modalElement.querySelector("#form--licenceCategoryEdit")
          .addEventListener("submit", updateLicenceCategorySubmitFunction);

        modalElement.querySelector("#form--licenceCategoryFieldAdd")
          .addEventListener("submit", addLicenceCategoryFieldSubmitFunction);

        modalElement.querySelector("#form--licenceCategoryApprovalAdd")
          .addEventListener("submit", addLicenceCategoryApprovalSubmitFunction);

        bulmaJS.toggleHtmlClipped();
      },
      onhidden: () => {
        if (doRefreshOnClose) {
          getLicenceCategories();
        }
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

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
            doRefreshOnClose = true;
          }
        });
    };

    const deleteLicenceCategoryFieldFunction = () => {

      cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategoryField", {
        licenceFieldKey
      },
        (responseJSON: { success: true; licenceCategoryFields: recordTypes.LicenceCategoryField[]; }) => {

          if (responseJSON.success) {
            licenceCategoryFields = responseJSON.licenceCategoryFields;
            renderLicenceCategoryFields();
            editLicenceCategoryFieldModalCloseFunction();
            doRefreshOnClose = true;
          }
        });
    };

    const confirmDeleteLicenceCategoryFieldFunction = (clickEvent: Event) => {

      clickEvent.preventDefault();

      bulmaJS.confirm({
        title: "Delete Licence Field",
        message: "Are you sure you want to delete this licence field?",
        contextualColorName: "warning",
        okButton: {
          text: "Yes, Delete It",
          callbackFunction: deleteLicenceCategoryFieldFunction
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
          .addEventListener("submit", updateLicenceCategoryFieldSubmitFunction);

        modalElement.querySelector(".is-delete-button")
          .addEventListener("click", confirmDeleteLicenceCategoryFieldFunction);

        bulmaJS.init(modalElement);
      }
    });
  };

  const openEditLicenceCategoryFieldModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const licenceFieldKey = (clickEvent.currentTarget as HTMLElement).dataset.licenceFieldKey;
    openEditLicenceCategoryFieldModal(licenceFieldKey);
  };

  const licenceCategoryField_dragDataPrefix = "licenceFieldKey:";

  const licenceCategoryField_dragstart = (dragEvent: DragEvent) => {
    dragEvent.dataTransfer.dropEffect = "move";
    const data = licenceCategoryField_dragDataPrefix + (dragEvent.target as HTMLElement).dataset.licenceFieldKey;
    dragEvent.dataTransfer.setData("text/plain", data);
  };

  const licenceCategoryField_dragover = (dragEvent: DragEvent) => {

    if (dragEvent.dataTransfer.getData("text/plain").startsWith(licenceCategoryField_dragDataPrefix)) {

      const licenceFieldKey_drag = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryField_dragDataPrefix.length);
      const licenceFieldKey_drop = (dragEvent.currentTarget as HTMLElement).dataset.licenceFieldKey;

      if (licenceFieldKey_drag !== licenceFieldKey_drop) {
        dragEvent.preventDefault();
        dragEvent.dataTransfer.dropEffect = "move";
      }
    }
  };

  const licenceCategoryField_drop = (dragEvent: DragEvent) => {

    dragEvent.preventDefault();

    const licenceFieldKey_from = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryField_dragDataPrefix.length);
    const licenceFieldKey_to = (dragEvent.currentTarget as HTMLElement).dataset.licenceFieldKey;

    cityssm.postJSON(urlPrefix + "/admin/doMoveLicenceCategoryField", {
      licenceFieldKey_from,
      licenceFieldKey_to
    },
      (responseJSON: { licenceCategoryFields: recordTypes.LicenceCategoryField[] }) => {
        licenceCategoryFields = responseJSON.licenceCategoryFields;
        renderLicenceCategoryFields();
        doRefreshOnClose = true;
      });
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
        panelBlockElement.draggable = true;
        panelBlockElement.dataset.licenceFieldKey = categoryField.licenceFieldKey;

        panelBlockElement.innerHTML = "<div class=\"columns is-mobile\">" +
          ("<div class=\"column\">" +
            "<h4>" + cityssm.escapeHTML(categoryField.licenceField) + "</h4>" +
            "<p class=\"is-size-7\">" + cityssm.escapeHTML(categoryField.licenceFieldDescription) + "</p>" +
            "</div>") +
          (categoryField.isRequired
            ? "<div class=\"column is-narrow\">" +
            "<i class=\"fas fa-asterisk\" aria-hidden=\"true\"</i>" +
            "</div>"
            : "") +
          "</div>";

        panelBlockElement.addEventListener("click", openEditLicenceCategoryFieldModalByClick);

        if (licenceCategoryFields.length > 1) {
          panelBlockElement.addEventListener("dragstart", licenceCategoryField_dragstart);
          panelBlockElement.addEventListener("dragover", licenceCategoryField_dragover);
          panelBlockElement.addEventListener("drop", licenceCategoryField_drop);
        }

        fieldsPanelElement.append(panelBlockElement);
      }

      fieldsContainerElement.innerHTML = "";
      fieldsContainerElement.append(fieldsPanelElement);
    }
  };

  // Licence Approvals

  let licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[];

  const openEditLicenceCategoryApprovalModal = (licenceApprovalKey: string) => {

    let editLicenceCategoryApprovalModalCloseFunction: () => void;

    const updateLicenceCategoryApprovalSubmitFunction = (formEvent: SubmitEvent) => {

      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategoryApproval",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[] }) => {
          if (responseJSON.success) {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
            editLicenceCategoryApprovalModalCloseFunction();
            renderLicenceCategoryApprovals();
            doRefreshOnClose = true;
          }
        });
    };

    const deleteLicenceCategoryApprovalFunction = () => {

      cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategoryApproval", {
        licenceApprovalKey
      },
        (responseJSON: { success: true; licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]; }) => {

          if (responseJSON.success) {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
            renderLicenceCategoryApprovals();
            editLicenceCategoryApprovalModalCloseFunction();
            doRefreshOnClose = true;
          }
        });
    };

    const confirmDeleteLicenceCategoryApprovalFunction = (clickEvent: Event) => {

      clickEvent.preventDefault();

      bulmaJS.confirm({
        title: "Delete Licence Approval",
        message: "Are you sure you want to delete this licence approval?",
        contextualColorName: "warning",
        okButton: {
          text: "Yes, Delete It",
          callbackFunction: deleteLicenceCategoryApprovalFunction
        }
      });
    };

    const licenceCategoryApproval = licenceCategoryApprovals.find((possibleField) => {
      return possibleField.licenceApprovalKey === licenceApprovalKey;
    });

    cityssm.openHtmlModal("licenceCategoryApproval-edit", {
      onshow: (modalElement) => {

        (modalElement.querySelector("#licenceCategoryApprovalEdit--licenceApprovalKey") as HTMLInputElement).value = licenceApprovalKey;

        (modalElement.querySelector("#licenceCategoryApprovalEdit--licenceApproval") as HTMLInputElement).value = licenceCategoryApproval.licenceApproval;
        (modalElement.querySelector("#licenceCategoryApprovalEdit--licenceApprovalDescription") as HTMLTextAreaElement).value = licenceCategoryApproval.licenceApprovalDescription;

        if (licenceCategoryApproval.isRequiredForNew) {
          (modalElement.querySelector("#licenceCategoryApprovalEdit--isRequiredForNew") as HTMLInputElement).checked = true;
        }

        if (licenceCategoryApproval.isRequiredForRenewal) {
          (modalElement.querySelector("#licenceCategoryApprovalEdit--isRequiredForRenewal") as HTMLInputElement).checked = true;
        }

      },
      onshown: (modalElement, closeModalFunction) => {
        editLicenceCategoryApprovalModalCloseFunction = closeModalFunction;

        modalElement.querySelector("#form--licenceCategoryApprovalEdit")
          .addEventListener("submit", updateLicenceCategoryApprovalSubmitFunction);

        modalElement.querySelector(".is-delete-button")
          .addEventListener("click", confirmDeleteLicenceCategoryApprovalFunction);

        bulmaJS.init(modalElement);
      }
    });
  };

  const openEditLicenceCategoryApprovalModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const licenceApprovalKey = (clickEvent.currentTarget as HTMLElement).dataset.licenceApprovalKey;
    openEditLicenceCategoryApprovalModal(licenceApprovalKey);
  };

  const licenceCategoryApproval_dragDataPrefix = "licenceApprovalKey:";

  const licenceCategoryApproval_dragstart = (dragEvent: DragEvent) => {
    dragEvent.dataTransfer.dropEffect = "move";
    const data = licenceCategoryApproval_dragDataPrefix + (dragEvent.target as HTMLElement).dataset.licenceApprovalKey;
    dragEvent.dataTransfer.setData("text/plain", data);
  };

  const licenceCategoryApproval_dragover = (dragEvent: DragEvent) => {

    if (dragEvent.dataTransfer.getData("text/plain").startsWith(licenceCategoryApproval_dragDataPrefix)) {

      const licenceApprovalKey_drag = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryApproval_dragDataPrefix.length);
      const licenceApprovalKey_drop = (dragEvent.currentTarget as HTMLElement).dataset.licenceApprovalKey;

      if (licenceApprovalKey_drag !== licenceApprovalKey_drop) {
        dragEvent.preventDefault();
        dragEvent.dataTransfer.dropEffect = "move";
      }
    }
  };

  const licenceCategoryApproval_drop = (dragEvent: DragEvent) => {

    dragEvent.preventDefault();

    const licenceApprovalKey_from = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryApproval_dragDataPrefix.length);
    const licenceApprovalKey_to = (dragEvent.currentTarget as HTMLElement).dataset.licenceApprovalKey;

    cityssm.postJSON(urlPrefix + "/admin/doMoveLicenceCategoryApproval", {
      licenceApprovalKey_from,
      licenceApprovalKey_to
    },
      (responseJSON: { licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[] }) => {
        licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
        renderLicenceCategoryApprovals();
        doRefreshOnClose = true;
      });
  };

  const renderLicenceCategoryApprovals = () => {

    const approvalsContainerElement = editModalElement.querySelector("#container--licenceCategoryApprovals") as HTMLElement;

    if (licenceCategoryApprovals.length === 0) {
      approvalsContainerElement.innerHTML = "<div class=\"message is-info\">" +
        "<p class=\"message-body\">There are no approvals associated with this licence.</p>" +
        "</div>";
    } else {

      const approvalsPanelElement = document.createElement("div");
      approvalsPanelElement.className = "panel";

      for (const categoryApproval of licenceCategoryApprovals) {

        const panelBlockElement = document.createElement("a");
        panelBlockElement.className = "panel-block is-block";
        panelBlockElement.draggable = true;
        panelBlockElement.dataset.licenceApprovalKey = categoryApproval.licenceApprovalKey;

        panelBlockElement.innerHTML = "<div class=\"columns is-mobile\">" +
          ("<div class=\"column\">" +
            "<h4>" + cityssm.escapeHTML(categoryApproval.licenceApproval) + "</h4>" +
            "<p class=\"is-size-7\">" + cityssm.escapeHTML(categoryApproval.licenceApprovalDescription) + "</p>" +
            "</div>") +
          (categoryApproval.isRequiredForNew || categoryApproval.isRequiredForRenewal
            ? "<div class=\"column is-narrow\">" +
            "<i class=\"fas fa-asterisk\" aria-hidden=\"true\"</i>" +
            "</div>"
            : "") +
          "</div>";

        panelBlockElement.addEventListener("click", openEditLicenceCategoryApprovalModalByClick);

        if (licenceCategoryApprovals.length > 1) {
          panelBlockElement.addEventListener("dragstart", licenceCategoryApproval_dragstart);
          panelBlockElement.addEventListener("dragover", licenceCategoryApproval_dragover);
          panelBlockElement.addEventListener("drop", licenceCategoryApproval_drop);
        }

        approvalsPanelElement.append(panelBlockElement);
      }

      approvalsContainerElement.innerHTML = "";
      approvalsContainerElement.append(approvalsPanelElement);
    }
  };

  // Licence Fees

  let licenceCategoryFees: recordTypes.LicenceCategoryFee[];

  const renderLicenceCategoryFees = () => {

  };

  // Main Details

  const openEditLicenceCategoryModal = (licenceCategoryKey: string) => {

    let categoryCloseModalFunction: () => void;

    const deleteLicenceCategoryFunction = () => {

      cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategory", {
        licenceCategoryKey
      },
        (responseJSON: { success: boolean; licenceCategories: recordTypes.LicenceCategory[]; }) => {
          if (responseJSON.success) {

            doRefreshOnClose = false;
            licenceCategories = responseJSON.licenceCategories;

            categoryCloseModalFunction();

            renderLicenceCategories();
          }
        });
    };

    const deleteLicenceCategoryConfirmFunction = (clickEvent: Event) => {

      clickEvent.preventDefault();

      bulmaJS.confirm({
        title: "Delete Licence Category",
        message: "Are you sure you want to delete this category?",
        contextualColorName: "warning",
        okButton: {
          text: "Yes, Delete It",
          callbackFunction: deleteLicenceCategoryFunction
        }
      });
    };

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
      onshown: (modalElement, closeModalFunction) => {

        categoryCloseModalFunction = closeModalFunction;

        modalElement.querySelector("#form--licenceCategoryEdit")
          .addEventListener("submit", updateLicenceCategorySubmitFunction);

        modalElement.querySelector("#form--licenceCategoryFieldAdd")
          .addEventListener("submit", addLicenceCategoryFieldSubmitFunction);

        modalElement.querySelector("#form--licenceCategoryApprovalAdd")
          .addEventListener("submit", addLicenceCategoryApprovalSubmitFunction);

        modalElement.querySelector(".is-delete-button")
          .addEventListener("click", deleteLicenceCategoryConfirmFunction);

        bulmaJS.toggleHtmlClipped();
        bulmaJS.init();
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

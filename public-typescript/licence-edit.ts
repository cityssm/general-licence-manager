/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  const licenceId = (document.querySelector("#licenceEdit--licenceId") as HTMLInputElement).value;

  const isCreate = (licenceId === "");

  /*
   * Form Submit
   */

  let hasUnsavedChanges = false;

  const setUnsavedChanges = () => {
    hasUnsavedChanges = true;
    cityssm.enableNavBlocker();
  };

  const editFormElement = document.querySelector("#form--licenceEdit");

  editFormElement.addEventListener("submit", (formEvent: SubmitEvent) => {

    formEvent.preventDefault();

    const submitURL = urlPrefix + "/licences/" +
      (isCreate
        ? "doCreateLicence"
        : "doUpdateLicence");

    cityssm.postJSON(submitURL, formEvent.currentTarget,
      (responseJSON: { success: boolean; errorMessage?: string; licenceId?: number }) => {

        if (responseJSON.success) {

          hasUnsavedChanges = false;
          cityssm.disableNavBlocker();

          if (isCreate) {
            window.location.href = urlPrefix + "/licences/" + responseJSON.licenceId.toString() + "/edit";
          } else {
            bulmaJS.alert({
              message: "Licence Updated Successfully",
              contextualColorName: "success"
            });
          }
        } else {
          bulmaJS.alert({
            title: "Error Updating Licence",
            message: responseJSON.errorMessage,
            contextualColorName: "danger"
          });
        }
      });
  });

  const inputElements = editFormElement.querySelectorAll("input, select");

  for (const inputElement of inputElements) {
    if (inputElement.hasAttribute("name")) {
      inputElement.addEventListener("change", setUnsavedChanges);
    }
  }

  /*
   * End Date
   */

  const licenceCategoryKeyElement = document.querySelector("#licenceEdit--licenceCategoryKey") as HTMLSelectElement;

  const isRenewalElement = document.querySelector("#licenceEdit--isRenewal") as HTMLInputElement;

  const startDateStringElement = document.querySelector("#licenceEdit--startDateString") as HTMLInputElement;
  const endDateStringElement = document.querySelector("#licenceEdit--endDateString") as HTMLInputElement;

  const refreshEndDate = () => {

    const endDate = startDateStringElement.valueAsDate;

    if (!endDate || licenceCategoryKeyElement.value === "") {
      endDateStringElement.value = "";
      return;
    }

    const licenceCategoryOptionElement = licenceCategoryKeyElement.selectedOptions[0];

    const licenceLengthYears = Number.parseInt(licenceCategoryOptionElement.dataset.licenceLengthYears);
    const licenceLengthMonths = Number.parseInt(licenceCategoryOptionElement.dataset.licenceLengthMonths);
    const licenceLengthDays = Number.parseInt(licenceCategoryOptionElement.dataset.licenceLengthDays);

    if (licenceLengthYears > 0) {
      endDate.setFullYear(endDate.getFullYear() + licenceLengthYears);
      endDate.setDate(endDate.getDate() - 1);
    }

    if (licenceLengthMonths > 0) {
      endDate.setMonth(endDate.getMonth() + licenceLengthMonths);
      endDate.setDate(endDate.getDate() - 1);
    }

    if (licenceLengthDays > 0) {
      endDate.setDate(endDate.getDate() + licenceLengthDays - 1);
    }

    endDateStringElement.valueAsDate = endDate;
  };

  if (isCreate) {
    licenceCategoryKeyElement.addEventListener("change", refreshEndDate);
  }

  startDateStringElement.addEventListener("change", refreshEndDate);

  /*
   * Category Change
   */

  let licenceCategory: recordTypes.LicenceCategory;

  const renderLicenceCategoryFields = () => {

    const licenceFieldsContainerElement = document.querySelector("#container--licenceFields") as HTMLElement;

    if (!licenceCategory || licenceCategory.licenceCategoryFields.length === 0) {
      licenceFieldsContainerElement.innerHTML = "";
      licenceFieldsContainerElement.classList.add("is-hidden");
      return;
    }

    licenceFieldsContainerElement.classList.remove("is-hidden");
    licenceFieldsContainerElement.innerHTML = "<h2 class=\"panel-heading\">Fields</h2>";

    const licenceFieldKeys: string[] = [];

    for (const licenceCategoryField of licenceCategory.licenceCategoryFields) {

      const panelBlockElement = document.createElement("div");
      panelBlockElement.className = "panel-block is-block";

      panelBlockElement.innerHTML = "<div class=\"field\">" +
        "<label class=\"label\"></label>" +
        "<div class=\"control\">" +
        "<input class=\"input\" type=\"text\" />" +
        "</div>" +
        "</div>";

      const inputId = "licenceFieldEdit--" + licenceCategoryField.licenceFieldKey;

      const labelElement = panelBlockElement.querySelector("label");
      labelElement.setAttribute("for", inputId);
      labelElement.textContent = licenceCategoryField.licenceField;

      const inputElement = panelBlockElement.querySelector("input");

      inputElement.id = inputId;
      inputElement.name = "field--" + licenceCategoryField.licenceFieldKey;
      inputElement.minLength = licenceCategoryField.minimumLength;
      inputElement.maxLength = licenceCategoryField.maximumLength;

      if (licenceCategoryField.pattern !== "") {
        inputElement.pattern = licenceCategoryField.pattern;
      }

      if (licenceCategoryField.isRequired) {
        inputElement.required = true;
      }

      if (licenceCategoryField.licenceFieldDescription !== "") {
        const helpElement = document.createElement("p");
        helpElement.className = "help";
        helpElement.textContent = licenceCategoryField.licenceFieldDescription;
        panelBlockElement.append(helpElement);
      }

      licenceFieldsContainerElement.append(panelBlockElement);

      licenceFieldKeys.push(licenceCategoryField.licenceFieldKey);
    }

    const licenceFieldKeysElement = document.createElement("input");
    licenceFieldKeysElement.type = "hidden";
    licenceFieldKeysElement.name = "licenceFieldKeys";
    licenceFieldKeysElement.value = licenceFieldKeys.join(",");

    licenceFieldsContainerElement.append(licenceFieldKeysElement);
  };

  const renderLicenceCategoryApprovals = () => {

    const licenceApprovalsContainerElement = document.querySelector("#container--licenceApprovals") as HTMLElement;

    if (!licenceCategory || licenceCategory.licenceCategoryApprovals.length === 0) {
      licenceApprovalsContainerElement.innerHTML = "";
      licenceApprovalsContainerElement.classList.add("is-hidden");
      return;
    }

    licenceApprovalsContainerElement.classList.remove("is-hidden");
    licenceApprovalsContainerElement.innerHTML = "<h2 class=\"panel-heading\">Approvals</h2>";

    const licenceApprovalKeys: string[] = [];

    for (const licenceCategoryApproval of licenceCategory.licenceCategoryApprovals) {

      const panelBlockElement = document.createElement("div");
      panelBlockElement.className = "panel-block is-block";

      panelBlockElement.innerHTML = "<div class=\"facheck\">" +
        "<input type=\"checkbox\" />" +
        "<label></label>" +
        "</div>";

      const inputId = "licenceApprovalEdit--" + licenceCategoryApproval.licenceApprovalKey;

      const labelElement = panelBlockElement.querySelector("label");
      labelElement.setAttribute("for", inputId);
      labelElement.textContent = licenceCategoryApproval.licenceApproval;

      const inputElement = panelBlockElement.querySelector("input");

      inputElement.id = inputId;
      inputElement.name = "approval--" + licenceCategoryApproval.licenceApprovalKey;
      inputElement.dataset.isRequiredForNew = licenceCategoryApproval.isRequiredForNew ? "true" : "false";
      inputElement.dataset.isRequiredForRenewal = licenceCategoryApproval.isRequiredForRenewal ? "true" : "false";

      if ((isRenewalElement.checked && licenceCategoryApproval.isRequiredForRenewal) ||
        (!isRenewalElement.checked && licenceCategoryApproval.isRequiredForNew)) {
        inputElement.required = true;
      }

      if (licenceCategoryApproval.licenceApprovalDescription !== "") {
        const helpElement = document.createElement("p");
        helpElement.className = "help";
        helpElement.textContent = licenceCategoryApproval.licenceApprovalDescription;
        panelBlockElement.append(helpElement);
      }

      licenceApprovalsContainerElement.append(panelBlockElement);

      licenceApprovalKeys.push(licenceCategoryApproval.licenceApprovalKey);
    }

    const licenceApprovalKeysElement = document.createElement("input");
    licenceApprovalKeysElement.type = "hidden";
    licenceApprovalKeysElement.name = "licenceApprovalKeys";
    licenceApprovalKeysElement.value = licenceApprovalKeys.join(",");

    licenceApprovalsContainerElement.append(licenceApprovalKeysElement);
  };

  const refreshLicenceCategoryFees = () => {

    const licenceFeeElement = document.querySelector("#licenceEdit--licenceFee") as HTMLInputElement;
    const replacementFeeElement = document.querySelector("#licenceEdit--replacementFee") as HTMLInputElement;

    if (!licenceCategory || licenceCategory.licenceCategoryFees.length === 0) {
      licenceFeeElement.value = "";
      replacementFeeElement.value = "";
      return;
    }

    licenceFeeElement.value = (isRenewalElement.checked
      ? licenceCategory.licenceCategoryFees[0].renewalFee.toFixed(2)
      : licenceCategory.licenceCategoryFees[0].licenceFee.toFixed(2));

    replacementFeeElement.value = licenceCategory.licenceCategoryFees[0].replacementFee.toFixed(2);
  };

  const renderLicenceCategory = () => {
    renderLicenceCategoryFields();
    renderLicenceCategoryApprovals();
    refreshLicenceCategoryFees();
  };

  const refreshLicenceCategory = () => {

    if (licenceCategoryKeyElement.value === "") {
      licenceCategory = undefined;
      renderLicenceCategory();
      return;
    }

    cityssm.postJSON(urlPrefix + "/licences/doGetLicenceCategory", {
      licenceCategoryKey: licenceCategoryKeyElement.value
    },
      (responseJSON: { licenceCategory: recordTypes.LicenceCategory }) => {
        licenceCategory = responseJSON.licenceCategory;
        renderLicenceCategory();
      });
  };

  if (isCreate) {
    licenceCategoryKeyElement.addEventListener("change", refreshLicenceCategory);

    if (licenceCategoryKeyElement.value !== "") {
      refreshLicenceCategory();
    }

  } else {
    licenceCategory = exports.licenceCategory;
  }

  /*
   * Is Renewal Change
   */

  isRenewalElement.addEventListener("change", () => {

    // Approvals

    const approvalInputElements = document.querySelector("#container--licenceApprovals").querySelectorAll("input");

    for (const approvalInputElement of approvalInputElements) {

      approvalInputElement.required =
        (isRenewalElement.checked && approvalInputElement.dataset.isRequiredForRenewal === "true") ||
          (!isRenewalElement.checked && approvalInputElement.dataset.isRequiredForNew === "true")
          ? true
          : false;
    }

    // Fees

    refreshLicenceCategoryFees();
  });

  /*
   * Transactions
   */

  const licenceTransactionsTableElement = document.querySelector("#table--licenceTransactions") as HTMLTableElement;

  let licenceTransactions: recordTypes.LicenceTransaction[];

  const getOutstandingBalance = () => {

    const licenceFeeString = (document.querySelector("#licenceEdit--licenceFee") as HTMLInputElement).value;

    const transactionAmountTotalString = licenceTransactionsTableElement.querySelectorAll("tfoot th")[1].textContent.slice(1);

    const outstandingBalance = Math.max(Number.parseFloat(licenceFeeString) - Number.parseFloat(transactionAmountTotalString), 0);

    return outstandingBalance;
  };

  const renderLicenceTransactions = () => {

    const tbodyElement = licenceTransactionsTableElement.querySelector("tbody");

    tbodyElement.innerHTML = "";

    let transactionTotal = 0;

    for (const licenceTransaction of licenceTransactions) {

      const trElement = document.createElement("tr");

      trElement.dataset.transactionIndex = licenceTransaction.transactionIndex.toString();

      trElement.innerHTML = "<td>" + licenceTransaction.transactionDateString + "</td>" +
        "<td class=\"has-text-right\">$" + licenceTransaction.transactionAmount.toFixed(2) + "</td>";

      tbodyElement.append(trElement);

      transactionTotal += licenceTransaction.transactionAmount;
    }

    licenceTransactionsTableElement.querySelectorAll("tfoot th")[1].textContent =
      "$" + transactionTotal.toFixed(2);
  };

  const openAddTransactionModal = (clickEvent: Event) => {

    clickEvent.preventDefault();

    let addTransactionModalElement: HTMLElement;
    let addTransactionCloseModalFunction: () => void;

    const addTransactionSubmitFunction = (formEvent: SubmitEvent) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/licences/doAddLicenceTransaction",
        formEvent.currentTarget,
        (responseJSON: { success: true; licenceTransactions: recordTypes.LicenceTransaction[]; }) => {
          if (responseJSON.success) {
            licenceTransactions = responseJSON.licenceTransactions;
            renderLicenceTransactions();
            addTransactionCloseModalFunction();
          }
        });
    };

    const setTransactionAmountFunction = (clickEvent: Event) => {
      clickEvent.preventDefault();

      const transactionAmountSpanId = (clickEvent.currentTarget as HTMLElement).dataset.spanId;

      (addTransactionModalElement.querySelector("#transactionAdd--transactionAmount") as HTMLInputElement).value =
        addTransactionModalElement.querySelector("#" + transactionAmountSpanId).textContent;
    };

    cityssm.openHtmlModal("transaction-add", {
      onshow: (modalElement) => {

        (modalElement.querySelector("#transactionAdd--licenceId") as HTMLInputElement).value = licenceId;

        const licenceFeeString = (document.querySelector("#licenceEdit--licenceFee") as HTMLInputElement).value;

        modalElement.querySelector("#transactionAdd--licenceFee").textContent = licenceFeeString;

        modalElement.querySelector("#transactionAdd--replacementFee").textContent =
          (document.querySelector("#licenceEdit--replacementFee") as HTMLInputElement).value;

        const outstandingBalance = getOutstandingBalance();

        modalElement.querySelector("#transactionAdd--outstandingBalance").textContent = outstandingBalance.toFixed(2);
      },
      onshown: (modalElement, closeModalFunction) => {

        addTransactionModalElement = modalElement;
        addTransactionCloseModalFunction = closeModalFunction;

        const setTransactionAmountButtonElements = modalElement.querySelectorAll(".is-set-transaction-amount-button");

        for (const setTransactionAmountButtonElement of setTransactionAmountButtonElements) {
          setTransactionAmountButtonElement.addEventListener("click", setTransactionAmountFunction);
        }

        modalElement.querySelector("#form--transactionAdd").addEventListener("submit", addTransactionSubmitFunction);
      }
    });
  };

  if (!isCreate) {
    document.querySelector("#button--addTransaction").addEventListener("click", openAddTransactionModal);
  }

  /*
   * Issue Licence
   */

  const issueLicenceButtonElement = document.querySelector("#is-issue-licence-button");

  if (issueLicenceButtonElement) {

    const doIssue = () => {

      cityssm.postJSON(urlPrefix + "/licences/doIssueLicence", {
        licenceId
      },
        (responseJSON: { success: boolean }) => {

          if (responseJSON.success) {
            window.location.reload();
          }
        });
    };

    issueLicenceButtonElement.addEventListener("click", (clickEvent) => {
      clickEvent.preventDefault();


      if (hasUnsavedChanges) {
        bulmaJS.alert({
          title: "Licence Has Unsaved Changes",
          message: "Please save your licence changes before issuing the licence.",
          contextualColorName: "warning"
        });

      } else if (getOutstandingBalance() > 0) {

        bulmaJS.confirm({
          title: "Licence Has an Outstanding Balance",
          message: "Are you sure you want to issue this licence with an outstanding balance?",
          contextualColorName: "warning",
          okButton: {
            text: "Yes, Issue with Outstanding Balance",
            callbackFunction: doIssue
          }
        });

      } else {

        bulmaJS.confirm({
          title: "Issue Licence",
          message: "Are you sure you want to issue this licence?",
          contextualColorName: "info",
          okButton: {
            text: "Yes, Issue Licence",
            callbackFunction: doIssue
          }
        });
      }
    });
  }

  /*
   * Delete Licence
   */

  if (!isCreate) {

    document.querySelector("#is-delete-licence-button").addEventListener("click", (clickEvent) => {

      clickEvent.preventDefault();

      const isIssued = !issueLicenceButtonElement;
      const isPast = endDateStringElement.value < cityssm.dateToString(new Date());

      const doDelete = () => {

        cityssm.postJSON(urlPrefix + "/licences/doDeleteLicence", {
          licenceId
        },
          (responseJSON: { success: boolean }) => {
            if (responseJSON.success) {
              window.location.href = urlPrefix + "/licences";
            }
          });
      };

      bulmaJS.confirm({
        title: "Delete Licence",
        message: "<p>Are you sure you want to delete this licence?</p>" +
          (isIssued
            ? "<p>Note that <strong>this licence has been issued</strong>, and deleting it may cause confusion.</p>"
            : ""),
        messageIsHtml: true,
        contextualColorName: (isPast ? "info" : "warning"),
        okButton: {
          text: "Yes, Delete Licence",
          callbackFunction: doDelete
        }
      });
    });
  }
})();

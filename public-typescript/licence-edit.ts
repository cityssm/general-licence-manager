/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  const licenceAlias = exports.licenceAlias as string;

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
   * Unlock Buttons
   */

  const unlockField = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const inputElement = (clickEvent.currentTarget as HTMLButtonElement)
      .closest(".field")
      .querySelector("input");

    inputElement.readOnly = false;

    inputElement.focus();
  };

  const unlockButtonElements = editFormElement.querySelectorAll(".is-unlock-button");

  for (const unlockButtonElement of unlockButtonElements) {
    unlockButtonElement.addEventListener("click", unlockField);
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

    endDateStringElement.readOnly = true;

    if (!endDate || licenceCategoryKeyElement.value === "") {
      endDateStringElement.value = "";
      return;
    }

    const licenceCategoryOptionElement = licenceCategoryKeyElement.selectedOptions[0];

    const licenceLengthFunction = licenceCategoryOptionElement.dataset.licenceLengthFunction;

    if (licenceLengthFunction === "") {

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

    } else {

      cityssm.postJSON(urlPrefix + "/licences/doGetLicenceEndDate", {
        licenceLengthFunction,
        startDateString: startDateStringElement.value
      }, (responseJSON: { success: boolean; errorMessage?: string; endDateString?: string; }) => {

        if (responseJSON.success) {
          endDateStringElement.value = responseJSON.endDateString;
        } else {
          bulmaJS.alert({
            title: "End Date Error",
            message: responseJSON.errorMessage,
            contextualColorName: "danger"
          });
        }
      });
    }
  };

  if (isCreate) {
    licenceCategoryKeyElement.addEventListener("change", refreshEndDate);

    if (licenceCategoryKeyElement.value !== "") {
      refreshEndDate();
    }
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

  const deleteLicenceTransaction = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const transactionIndex = (clickEvent.currentTarget as HTMLButtonElement)
      .closest("tr").dataset.transactionIndex;

    const doDelete = () => {

      cityssm.postJSON(urlPrefix + "/licences/doDeleteLicenceTransaction", {
        licenceId,
        transactionIndex
      }, (responseJSON: { success: boolean; licenceTransactions: recordTypes.LicenceTransaction[] }) => {

        if (responseJSON.success) {
          licenceTransactions = responseJSON.licenceTransactions;
          renderLicenceTransactions();
        }
      });
    };

    bulmaJS.confirm({
      title: "Delete Transaction",
      message: "Are you sure you want to delete this transaction?" +
        " In the event of a refund, it may be better to create a new negative transaction.",
      contextualColorName: "danger",
      okButton: {
        text: "Yes, Delete the Transaction",
        callbackFunction: doDelete
      }
    })
  };

  const renderLicenceTransactions = () => {

    const tbodyElement = licenceTransactionsTableElement.querySelector("tbody");

    tbodyElement.innerHTML = "";

    let transactionTotal = 0;

    for (const licenceTransaction of licenceTransactions) {

      const trElement = document.createElement("tr");

      trElement.dataset.transactionIndex = licenceTransaction.transactionIndex.toString();

      trElement.innerHTML = "<td>" + licenceTransaction.transactionDateString + "</td>" +
        "<td class=\"has-text-right\">$" + licenceTransaction.transactionAmount.toFixed(2) + "</td>" +
        ("<td>" +
          "<button class=\"button is-small is-danger is-inverted\" type=\"button\">" +
          "<i class=\"fas fa-trash\" aria-label=\"Delete Transaction\"></i>" +
          "</button>" +
          "</td>");

      trElement.querySelector("button").addEventListener("click", deleteLicenceTransaction);

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

        (modalElement.querySelector("#transactionAdd--transactionAmount") as HTMLInputElement).value =
          (outstandingBalance > 0
            ? outstandingBalance.toFixed(2)
            : (document.querySelector("#licenceEdit--replacementFee") as HTMLInputElement).value);
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

    const deleteTransactionButtonElements = document.querySelectorAll(".is-delete-transaction-button");

    for (const deleteTransactionButtonElement of deleteTransactionButtonElements) {
      deleteTransactionButtonElement.addEventListener("click", deleteLicenceTransaction);
    }
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
          title: licenceAlias + " Has Unsaved Changes",
          message: "Please save your " + licenceAlias.toLowerCase() + " changes before issuing the " + licenceAlias.toLowerCase() + ".",
          contextualColorName: "warning"
        });

      } else if (getOutstandingBalance() > 0) {

        bulmaJS.confirm({
          title: licenceAlias + " Has an Outstanding Balance",
          message: "Are you sure you want to issue this " + licenceAlias.toLowerCase() + " with an outstanding balance?",
          contextualColorName: "warning",
          okButton: {
            text: "Yes, Issue with Outstanding Balance",
            callbackFunction: doIssue
          }
        });

      } else if (startDateStringElement.value < cityssm.dateToString(new Date())) {

        bulmaJS.confirm({
          title: licenceAlias + " Has a Start Date in the Past",
          message: "Are you sure you want to issue this " + licenceAlias.toLowerCase() + " with a start date in the past?",
          contextualColorName: "warning",
          okButton: {
            text: "Yes, Issue with a Past Start Date",
            callbackFunction: doIssue
          }
        });

      } else {

        bulmaJS.confirm({
          title: "Issue " + licenceAlias,
          message: "Are you sure you want to issue this " + licenceAlias.toLowerCase() + "?",
          contextualColorName: "info",
          okButton: {
            text: "Yes, Issue " + licenceAlias,
            callbackFunction: doIssue
          }
        });
      }
    });
  }

  /*
   * Renew Licence
   */

  if (!isCreate && !issueLicenceButtonElement) {


    const doRenew = () => {

      const url = new URL(window.location.protocol + "//" +
        window.location.host +
        urlPrefix + "/licences/new");

      url.searchParams.append("licenceCategoryKey", licenceCategoryKeyElement.value);
      url.searchParams.append("isRenewal", "true");
      url.searchParams.append("licenseeName", (document.querySelector("#licenceEdit--licenseeName") as HTMLInputElement).value);
      url.searchParams.append("licenseeBusinessName", (document.querySelector("#licenceEdit--licenseeBusinessName") as HTMLInputElement).value);
      url.searchParams.append("licenseeAddress1", (document.querySelector("#licenceEdit--licenseeAddress1") as HTMLInputElement).value);
      url.searchParams.append("licenseeAddress2", (document.querySelector("#licenceEdit--licenseeAddress2") as HTMLInputElement).value);
      url.searchParams.append("licenseeCity", (document.querySelector("#licenceEdit--licenseeCity") as HTMLInputElement).value);
      url.searchParams.append("licenseeProvince", (document.querySelector("#licenceEdit--licenseeProvince") as HTMLInputElement).value);
      url.searchParams.append("licenseePostalCode", (document.querySelector("#licenceEdit--licenseePostalCode") as HTMLInputElement).value);

      let newStartDate = endDateStringElement.valueAsDate;
      newStartDate.setDate(newStartDate.getDate() + 1);

      if (newStartDate.getTime() < Date.now()) {
        newStartDate = new Date();
      }

      url.searchParams.append("startDateString", cityssm.dateToString(newStartDate));

      window.location.href = url.toString();
    };

    document.querySelector("#is-renew-licence-button").addEventListener("click", (clickEvent) => {

      clickEvent.preventDefault();

      bulmaJS.confirm({
        title: "Renew Licence",
        message: "Are you sure you want to renew this " + licenceAlias.toLowerCase() + "?",
        okButton: {
          text: "Yes, Renew this " + licenceAlias,
          callbackFunction: doRenew
        }
      });
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
        title: "Delete " + licenceAlias,
        message: "<p>Are you sure you want to delete this " + licenceAlias.toLowerCase() + "?</p>" +
          (isIssued
            ? "<p>Note that <strong>this " + licenceAlias.toLowerCase() + " has been issued</strong>, and deleting it may cause confusion.</p>"
            : ""),
        messageIsHtml: true,
        contextualColorName: (isPast ? "info" : "warning"),
        okButton: {
          text: "Yes, Delete " + licenceAlias,
          callbackFunction: doDelete
        }
      });
    });
  }
})();

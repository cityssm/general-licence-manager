/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";
import type { GLM } from "../types/globalTypes";

import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;


(() => {
  const glm = exports.glm as GLM;

  const urlPrefix = document.querySelector("main")?.dataset.urlPrefix;

  const licenceAlias = exports.licenceAlias as string;

  const transactionBatchesTableElement = document.querySelector("#table--transactionBatches") as HTMLTableElement;

  let batchDateStrings: string[] = [];

  const clearBatch = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const batchDateString = (clickEvent.currentTarget as HTMLElement).closest("th")?.dataset.batchDateString;

    const doClear = () => {

      cityssm.postJSON(urlPrefix + "/batches/doClearBatchTransactions", {
        batchDateString
      }, (responseJSON: { success: boolean; batchTransactions?: recordTypes.LicenceTransaction[]; }) => {

        if (responseJSON.success) {
          batchTransactions = responseJSON.batchTransactions;
          buildBatchDateStringsList();
          renderBatchDateColumns();
          renderBatchTransactions();
        }
      });
    };

    bulmaJS.confirm({
      title: "Clear and Remove Batch",
      message: "Are you sure you want to clear all amounts in this batch?",
      contextualColorName: "warning",
      okButton: {
        text: "Yes, Clear the Batch",
        callbackFunction: doClear
      }
    });
  };

  const createOrUpdateBatchTransactionAmount = (changeEvent: Event) => {
    changeEvent.preventDefault();

    const transactionAmountElement = changeEvent.currentTarget as HTMLInputElement;

    const transactionAmount = transactionAmountElement.value;
    const batchDateString = transactionAmountElement.closest("td").dataset.batchDateString;
    const licenceId = transactionAmountElement.closest("tr").dataset.licenceId;

    cityssm.postJSON(urlPrefix + "/batches/doCreateOrUpdateBatchTransaction", {
      licenceId,
      batchDateString,
      transactionAmount
    },
      (responseJSON: { success: boolean; message?: string; batchTransactions: recordTypes.LicenceTransaction[]; }) => {

        if (responseJSON.success) {

          batchTransactions = responseJSON.batchTransactions;
          renderBatchTransactions();
        }

        if (responseJSON.message) {

          const licenceNumber = transactionAmountElement.closest("tr").dataset.licenceNumber;

          bulmaJS.alert({
            title: licenceAlias + " #" + licenceNumber + ", Batch " + batchDateString,
            message: responseJSON.message,
            contextualColorName: responseJSON.success ? "warning" : "danger"
          });
        }
      });
  };

  const renderBatchDateColumns = () => {

    // Clear columns

    const tableCellElements = transactionBatchesTableElement.querySelectorAll("[data-batch-date-string]");

    for (const tableCellElement of tableCellElements) {
      tableCellElement.remove();
    }

    // Build columns

    const tableRowElements = transactionBatchesTableElement.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>;

    for (const batchDateString of batchDateStrings) {

      // thead

      const thHeadElement = document.createElement("th");
      thHeadElement.dataset.batchDateString = batchDateString;

      thHeadElement.innerHTML = "<div class=\"level is-mobile mb-0\">" +
        ("<div class=\"level-left\">" +
          "<div class=\"level-item\">" + batchDateString + "</div>" +
          "</div>") +
        ("<div class=\"level-right\">" +
          "<div class=\"level-item\">" +
          ("<div class=\"dropdown is-up is-right has-text-weight-normal\">" +
            "<div class=\"dropdown-trigger\">" +
            "<button class=\"button is-small is-white has-tooltip-left\" data-tooltip=\"Batch Options\" type=\"button\" aria-label=\"Batch Options\">" +
            "<i class=\"fas fa-bars\" aria-hidden=\"true\"></i>" +
            "</button>" +
            "</div>" +
            "<div class=\"dropdown-menu\"><div class=\"dropdown-content\">" +
            "<a class=\"dropdown-item\" href=\"" + urlPrefix + "/reports/licenceTransactions-byDate?batchDateString=" + batchDateString + "\">" +
            "<span class=\"icon\"><i class=\"fas fa-file-csv\" aria-hidden=\"true\"></i></span>" +
            " <span>Transaction Report</span>" +
            "</a>" +
            "<hr class=\"dropdown-divider\">" +
            "<a class=\"dropdown-item is-clear-batch-button\" role=\"button\" href=\"#\">" +
            "<span class=\"icon\"><i class=\"fas fa-trash\" aria-hidden=\"true\"></i></span>" +
            " <span>Clear and Remove Batch</span>" +
            "</a>" +
            "</div></div>" +
            "</div>") +
          "</div>" +
          "</div>") +
        "</div>" +
        "<div class=\"has-text-centered is-size-7\">" + glm.getDayName(batchDateString) + "</div>";

      thHeadElement.querySelector(".is-clear-batch-button").addEventListener("click", clearBatch);

      transactionBatchesTableElement.querySelector("thead th:last-child")
        .insertAdjacentElement("beforebegin", thHeadElement);

      // tfoot

      const thFootElement = document.createElement("th");
      thFootElement.className = "has-text-right";
      thFootElement.dataset.batchDateString = batchDateString;

      transactionBatchesTableElement.querySelector("tfoot th:last-child")
        .insertAdjacentElement("beforebegin", thFootElement);

      // tbody

      for (const tableRowElement of tableRowElements) {

        const tdElement = document.createElement("td");
        tdElement.dataset.batchDateString = batchDateString;

        tdElement.innerHTML = "<div class=\"control has-icons-left\">" +
          "<input class=\"input is-small has-text-right\" data-field=\"transactionAmount\" type=\"number\" min=\"0\" onwheel=\"return false\" />" +
          "<span class=\"icon is-small is-left\">" +
          "<i class=\"fas fa-dollar-sign\" aria-hidden=\"true\"></i>" +
          "</span>" +
          "</div>";

        const inputElement = tdElement.querySelector("input");

        inputElement.min = "0";
        inputElement.max = tableRowElement.dataset.outstandingBalance;
        inputElement.step = "0.01";
        inputElement.addEventListener("change", createOrUpdateBatchTransactionAmount);

        tableRowElement.querySelector("td:last-child")
          .insertAdjacentElement("beforebegin", tdElement);
      }
    }

    bulmaJS.init(transactionBatchesTableElement);
  };

  let batchTransactions = exports.batchTransactions as recordTypes.LicenceTransaction[];

  const buildBatchDateStringsList = () => {

    const batchDateStringsSet = new Set<string>();

    for (const transaction of batchTransactions) {
      batchDateStringsSet.add(transaction.batchDateString);
    }

    batchDateStrings = [...batchDateStringsSet.values()];

    batchDateStrings.sort();
  };

  buildBatchDateStringsList();

  const renderBatchTransactions = () => {

    // Clear all

    const transactionAmountElements = transactionBatchesTableElement.querySelectorAll("input[data-field='transactionAmount']") as NodeListOf<HTMLInputElement>;

    for (const transactionAmountElement of transactionAmountElements) {
      transactionAmountElement.value = "";
    }

    // Loop through transactions

    const licenceTotalsMap = new Map<number, number>();
    const batchTotalsMap = new Map<string, number>();

    for (const transaction of batchTransactions) {

      // Display transaction

      const inputCellElement = transactionBatchesTableElement
        .querySelector("tr[data-licence-id='" + transaction.licenceId.toString() + "']")
        .querySelector("td[data-batch-date-string='" + transaction.batchDateString + "']");

      const inputElement = inputCellElement.querySelector("input");

      const inputValue = Number.parseFloat(inputElement.value) || 0;

      inputElement.value = (inputValue + transaction.transactionAmount).toFixed(2);

      inputElement.classList.remove("has-background-danger-light");

      if (!inputElement.checkValidity()) {
        inputElement.classList.add("has-background-danger-light");
      }

      // Calculate licence total

      if (licenceTotalsMap.has(transaction.licenceId)) {
        licenceTotalsMap.set(transaction.licenceId,
          licenceTotalsMap.get(transaction.licenceId) + transaction.transactionAmount);
      } else {
        licenceTotalsMap.set(transaction.licenceId, transaction.transactionAmount);
      }

      // Calculate batch total

      if (batchTotalsMap.has(transaction.batchDateString)) {
        batchTotalsMap.set(transaction.batchDateString,
          batchTotalsMap.get(transaction.batchDateString) + transaction.transactionAmount);
      } else {
        batchTotalsMap.set(transaction.batchDateString, transaction.transactionAmount);
      }
    }

    // Populate licence totals

    const licenceRowElements = transactionBatchesTableElement.querySelectorAll("tbody tr[data-licence-id]") as NodeListOf<HTMLTableRowElement>;

    for (const licenceRowElement of licenceRowElements) {

      const licenceId = Number.parseInt(licenceRowElement.dataset.licenceId, 10);

      const outstandingBalance = Number.parseFloat(licenceRowElement.dataset.outstandingBalance);

      const licenceTotal = licenceTotalsMap.has(licenceId)
        ? licenceTotalsMap.get(licenceId)
        : 0;

      const totalElement = licenceRowElement.querySelector("td:last-child");

      totalElement.textContent = "$" + licenceTotal.toFixed(2);

      // Set status colors

      totalElement.classList.remove("has-background-success-light", "has-background-danger-light");

      if (outstandingBalance.toFixed(2) === licenceTotal.toFixed(2)) {
        totalElement.classList.add("has-background-success-light");
      } else if (outstandingBalance < licenceTotal) {
        totalElement.classList.add("has-background-danger-light");
      }
    }

    // Populate batch totals

    const batchTotalElements = transactionBatchesTableElement.querySelectorAll("tfoot th[data-batch-date-string]") as NodeListOf<HTMLTableCellElement>;

    for (const batchTotalElement of batchTotalElements) {

      const batchDateString = batchTotalElement.dataset.batchDateString;

      batchTotalElement.textContent = batchTotalsMap.has(batchDateString)
        ? "$" + batchTotalsMap.get(batchDateString).toFixed(2)
        : "$0.00";
    }
  };

  renderBatchDateColumns();
  renderBatchTransactions();

  /*
   * Split Outstanding Balance
   */

  const splitOutstandingBalance = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const licenceTrElement = (clickEvent.currentTarget as HTMLElement).closest("tr");

    const licenceId = licenceTrElement.dataset.licenceId;
    const outstandingBalance = licenceTrElement.dataset.outstandingBalance;

    const doSplit = () => {

      cityssm.postJSON(urlPrefix + "/batches/doSplitOutstandingBalances", {
        licenceOutstandingBalances: [{
          licenceId,
          outstandingBalance
        }],
        batchDateStrings,
      }, (responseJSON: { success: boolean; batchTransactions?: recordTypes.LicenceTransaction[]; }) => {
        if (responseJSON.success) {
          batchTransactions = responseJSON.batchTransactions;
          renderBatchTransactions();
        }
      });
    };

    if (batchDateStrings.length === 0) {
      bulmaJS.alert({
        message: "There are no batches available."
      });
    } else {
      bulmaJS.confirm({
        title: "Split Balance Across Batches",
        message: "Are you sure you want to evenly split the outstanding balance across " + batchDateStrings.length + " batch" + (batchDateStrings.length === 1 ? "" : "es") + "?",
        okButton: {
          text: "Yes, Split the Balance",
          callbackFunction: doSplit
        }
      });
    }
  };

  const splitOutstandingBalances = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const licenceTrElements = transactionBatchesTableElement.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>;

    const licenceOutstandingBalances = [];

    for (const licenceTrElement of licenceTrElements) {

      licenceOutstandingBalances.push({
        licenceId: licenceTrElement.dataset.licenceId,
        outstandingBalance: licenceTrElement.dataset.outstandingBalance
      });
    }

    const doSplit = () => {

      cityssm.postJSON(urlPrefix + "/batches/doSplitOutstandingBalances", {
        licenceOutstandingBalances,
        batchDateStrings,
      }, (responseJSON: { success: boolean; batchTransactions?: recordTypes.LicenceTransaction[]; }) => {
        if (responseJSON.success) {
          batchTransactions = responseJSON.batchTransactions;
          renderBatchTransactions();
        }
      });
    };

    if (batchDateStrings.length === 0) {
      bulmaJS.alert({
        message: "There are no batches available."
      });
    } else {
      bulmaJS.confirm({
        title: "Split Balances Across Batches",
        message: "Are you sure you want to evenly split the outstanding balances across " + batchDateStrings.length + " batch" + (batchDateStrings.length === 1 ? "" : "es") + "?",
        okButton: {
          text: "Yes, Split the Balance",
          callbackFunction: doSplit
        }
      });
    }
  };

  const splitOutstandingBalanceButtons = document.querySelectorAll(".is-split-outstanding-balance-button");

  for (const splitOutstandingBalanceButton of splitOutstandingBalanceButtons) {
    splitOutstandingBalanceButton.addEventListener("click", splitOutstandingBalance);
  }

  document.querySelector(".is-split-outstanding-balances-button").addEventListener("click", splitOutstandingBalances);

  /*
   * Clear Licence Amounts
   */

  const clearLicenceTransactions = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const licenceId = (clickEvent.currentTarget as HTMLElement).closest("tr").dataset.licenceId;

    const doClear = () => {

      cityssm.postJSON(urlPrefix + "/batches/doClearLicenceBatchTransactions", {
        licenceIds: [licenceId],
      }, (responseJSON: { success: boolean; batchTransactions: recordTypes.LicenceTransaction[]; }) => {

        if (responseJSON.success) {
          batchTransactions = responseJSON.batchTransactions;
          renderBatchTransactions();
        }
      });
    };

    bulmaJS.confirm({
      title: "Clear All Transactions",
      message: "Are you sure you want to clear all transaction amounts in this row?",
      contextualColorName: "warning",
      okButton: {
        text: "Yes, Clear All Transactions",
        callbackFunction: doClear
      }
    });
  };

  const clearAllLicenceTransactions = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const licenceTrElements = transactionBatchesTableElement.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>;

    const licenceIds = [];

    for (const licenceTrElement of licenceTrElements) {
      licenceIds.push(licenceTrElement.dataset.licenceId);
    }

    const doClear = () => {

      cityssm.postJSON(urlPrefix + "/batches/doClearLicenceBatchTransactions", {
        licenceIds,
      }, (responseJSON: { success: boolean; batchTransactions: recordTypes.LicenceTransaction[]; }) => {

        if (responseJSON.success) {
          batchTransactions = responseJSON.batchTransactions;
          renderBatchTransactions();
        }
      });
    };

    bulmaJS.confirm({
      title: "Clear All Transactions",
      message: "Are you sure you want to clear all transaction amounts?",
      contextualColorName: "warning",
      okButton: {
        text: "Yes, Clear All Transactions",
        callbackFunction: doClear
      }
    });
  };

  const clearLicenceButtonElements = document.querySelectorAll(".is-clear-licence-button");

  for (const clearLicenceButtonElement of clearLicenceButtonElements) {
    clearLicenceButtonElement.addEventListener("click", clearLicenceTransactions);
  }

  document.querySelector(".is-clear-licences-button").addEventListener("click", clearAllLicenceTransactions);

  /*
   * Add Batch
   */

  document.querySelector("#is-add-batch-button").addEventListener("click", (clickEvent) => {

    clickEvent.preventDefault();

    let addBatch_batchDateStringElement: HTMLInputElement;
    let addBatch_closeModalFunction: () => void;

    const doAddBatch = (formEvent: Event) => {
      formEvent.preventDefault();

      const batchDateString = addBatch_batchDateStringElement.value;

      if (batchDateStrings.includes(batchDateString)) {
        bulmaJS.alert({
          title: "Batch Date Already Included",
          message: "To add a new batch, choose a new date."
        });
      } else {
        batchDateStrings.push(batchDateString);
        batchDateStrings.sort();
        addBatch_closeModalFunction();

        renderBatchDateColumns();
        renderBatchTransactions();
      }
    };

    cityssm.openHtmlModal("batchBuilder-addBatch", {
      onshown: (modalElement, closeModalFunction) => {
        addBatch_batchDateStringElement = modalElement.querySelector("#addBatch--batchDateString");
        addBatch_closeModalFunction = closeModalFunction;

        modalElement.querySelector("#form--addBatch").addEventListener("submit", doAddBatch);
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  });
})();

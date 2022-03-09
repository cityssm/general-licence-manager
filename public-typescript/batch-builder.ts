/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;


(() => {
  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  const licenceAlias = exports.licenceAlias as string;

  const transactionBatchesTableElement = document.querySelector("#table--transactionBatches") as HTMLTableElement;

  const licences = exports.licences as recordTypes.Licence[];

  let batchDateStrings: string[] = [];

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
      thHeadElement.innerHTML = batchDateString;

      transactionBatchesTableElement.querySelector("thead th:last-child")
        .insertAdjacentElement("beforebegin", thHeadElement);

      // tfoot

      const thFootElement = document.createElement("th");
      thHeadElement.dataset.batchDateString = batchDateString;

      transactionBatchesTableElement.querySelector("tfoot th:last-child")
        .insertAdjacentElement("beforebegin", thFootElement);

      // tbody

      for (const tableRowElement of tableRowElements) {

        const tdElement = document.createElement("td");
        tdElement.dataset.batchDateString = batchDateString;

        tdElement.innerHTML = "<div class=\"control has-icons-left\">" +
          "<input class=\"input is-small has-text-right\" data-field=\"transactionAmount\" type=\"number\" min=\"0\" />" +
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

    for (const transaction of batchTransactions) {

      const inputElement = transactionBatchesTableElement
        .querySelector("tr[data-licence-id='" + transaction.licenceId + "']")
        .querySelector("td[data-batch-date-string='" + transaction.batchDateString + "']")
        .querySelector("input");

      inputElement.value = transaction.transactionAmount.toFixed(2);
    }
  };

  renderBatchDateColumns();
  renderBatchTransactions();

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
        })
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
      }
    });
  });
})();

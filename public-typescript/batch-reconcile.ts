/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {

  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  const batchDate = (document.querySelector("#batchReconcile--batchDate") as HTMLInputElement).value;
  const externalReceiptNumberElement = document.querySelector("#batchReconcile--externalReceiptNumber") as HTMLInputElement;

  const getTransactionDetails = (clickEvent: Event) => {

    const panelBlockElement = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    return {
      panelBlockElement,
      successButtonElement: panelBlockElement.querySelector(".is-success-transaction-button") as HTMLButtonElement,
      failButtonElement: panelBlockElement.querySelector(".is-fail-transaction-button") as HTMLButtonElement,
      licenceId: panelBlockElement.dataset.licenceId,
      transactionIndex: panelBlockElement.dataset.transactionIndex,
      transactionAmount: panelBlockElement.dataset.transactionAmount
    }
  };

  const markTransactionAsSuccessful = (clickEvent: Event) => {

    clickEvent.preventDefault();

    if (externalReceiptNumberElement.value === "") {
      bulmaJS.alert({
        title: "Batch Receipt Number Required",
        message: "Enter a receipt number for the batch, and try again.",
        contextualColorName: "warning"
      });

      return;
    }

    const transactionDetails = getTransactionDetails(clickEvent);

    const doSuccess = () => {

      cityssm.postJSON(urlPrefix + "/batches/doMarkBatchTransactionSuccessful", {
        licenceId: transactionDetails.licenceId,
        transactionIndex: transactionDetails.transactionIndex,
        transactionAmount: transactionDetails.transactionAmount,
        batchDate,
        externalReceiptNumber: externalReceiptNumberElement.value
      }, (responseJSON: { success: boolean }) => {

        if (!responseJSON.success) {
          bulmaJS.alert({
            title: "Transaction Not Updated",
            message: "Please try again.",
            contextualColorName: "danger"
          });

          return;
        }

        transactionDetails.successButtonElement.disabled = true;
        transactionDetails.successButtonElement.classList.remove("is-outlined");

        transactionDetails.failButtonElement.disabled = false;
        transactionDetails.failButtonElement.classList.add("is-outlined");
      });
    };

    bulmaJS.confirm({
      title: "Mark Transaction as Received Successfully",
      message: "Are you sure you want to mark this transaction as received successfully?",
      contextualColorName: "success",
      okButton: {
        text: "Yes, Received Succesfully",
        callbackFunction: doSuccess
      }
    })
  };

  const successButtonElements = document.querySelectorAll(".is-success-transaction-button");

  for (const successButtonElement of successButtonElements) {
    successButtonElement.addEventListener("click", markTransactionAsSuccessful);
  }

  const markTransactionAsFailed = (clickEvent: Event) => {

  };

  const failButtonElements = document.querySelectorAll(".is-fail-transaction-button");

  for (const failButtonElement of failButtonElements) {
    failButtonElement.addEventListener("click", markTransactionAsFailed);
  }
})();

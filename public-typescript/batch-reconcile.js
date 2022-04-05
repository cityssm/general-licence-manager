"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const batchDate = document.querySelector("#batchReconcile--batchDate").value;
    const externalReceiptNumberElement = document.querySelector("#batchReconcile--externalReceiptNumber");
    const getTransactionDetails = (clickEvent) => {
        const panelBlockElement = clickEvent.currentTarget.closest(".panel-block");
        return {
            panelBlockElement,
            successButtonElement: panelBlockElement.querySelector(".is-success-transaction-button"),
            failButtonElement: panelBlockElement.querySelector(".is-fail-transaction-button"),
            licenceId: panelBlockElement.dataset.licenceId,
            transactionIndex: panelBlockElement.dataset.transactionIndex,
            transactionAmount: panelBlockElement.dataset.transactionAmount
        };
    };
    const markTransactionAsSuccessful = (clickEvent) => {
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
            }, (responseJSON) => {
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
        });
    };
    const successButtonElements = document.querySelectorAll(".is-success-transaction-button");
    for (const successButtonElement of successButtonElements) {
        successButtonElement.addEventListener("click", markTransactionAsSuccessful);
    }
    const markTransactionAsFailed = (clickEvent) => {
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
        const doFailed = () => {
            cityssm.postJSON(urlPrefix + "/batches/doMarkBatchTransactionFailed", {
                licenceId: transactionDetails.licenceId,
                transactionIndex: transactionDetails.transactionIndex,
                transactionAmount: transactionDetails.transactionAmount,
                batchDate,
                externalReceiptNumber: externalReceiptNumberElement.value
            }, (responseJSON) => {
                if (!responseJSON.success) {
                    bulmaJS.alert({
                        title: "Transaction Not Updated",
                        message: "Please try again.",
                        contextualColorName: "danger"
                    });
                    return;
                }
                transactionDetails.failButtonElement.disabled = true;
                transactionDetails.failButtonElement.classList.remove("is-outlined");
                transactionDetails.successButtonElement.disabled = false;
                transactionDetails.successButtonElement.classList.add("is-outlined");
            });
        };
        bulmaJS.confirm({
            title: "Mark Transaction as Failed",
            message: "Are you sure you want to mark this transaction as failed?",
            contextualColorName: "warning",
            okButton: {
                text: "Yes, It Failed",
                callbackFunction: doFailed
            }
        });
    };
    const failButtonElements = document.querySelectorAll(".is-fail-transaction-button");
    for (const failButtonElement of failButtonElements) {
        failButtonElement.addEventListener("click", markTransactionAsFailed);
    }
})();

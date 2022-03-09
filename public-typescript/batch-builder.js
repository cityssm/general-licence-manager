"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const licenceAlias = exports.licenceAlias;
    const transactionBatchesTableElement = document.querySelector("#table--transactionBatches");
    const licences = exports.licences;
    let batchDateStrings = [];
    const createOrUpdateBatchTransactionAmount = (changeEvent) => {
        changeEvent.preventDefault();
        const transactionAmountElement = changeEvent.currentTarget;
        const transactionAmount = transactionAmountElement.value;
        const batchDateString = transactionAmountElement.closest("td").dataset.batchDateString;
        const licenceId = transactionAmountElement.closest("tr").dataset.licenceId;
        cityssm.postJSON(urlPrefix + "/batches/doCreateOrUpdateBatchTransaction", {
            licenceId,
            batchDateString,
            transactionAmount
        }, (responseJSON) => {
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
        const tableCellElements = transactionBatchesTableElement.querySelectorAll("[data-batch-date-string]");
        for (const tableCellElement of tableCellElements) {
            tableCellElement.remove();
        }
        const tableRowElements = transactionBatchesTableElement.querySelectorAll("tbody tr");
        for (const batchDateString of batchDateStrings) {
            const thHeadElement = document.createElement("th");
            thHeadElement.dataset.batchDateString = batchDateString;
            thHeadElement.innerHTML = batchDateString;
            transactionBatchesTableElement.querySelector("thead th:last-child")
                .insertAdjacentElement("beforebegin", thHeadElement);
            const thFootElement = document.createElement("th");
            thHeadElement.dataset.batchDateString = batchDateString;
            transactionBatchesTableElement.querySelector("tfoot th:last-child")
                .insertAdjacentElement("beforebegin", thFootElement);
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
    let batchTransactions = exports.batchTransactions;
    const buildBatchDateStringsList = () => {
        const batchDateStringsSet = new Set();
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
    document.querySelector("#is-add-batch-button").addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        let addBatch_batchDateStringElement;
        let addBatch_closeModalFunction;
        const doAddBatch = (formEvent) => {
            formEvent.preventDefault();
            const batchDateString = addBatch_batchDateStringElement.value;
            if (batchDateStrings.includes(batchDateString)) {
                bulmaJS.alert({
                    title: "Batch Date Already Included",
                    message: "To add a new batch, choose a new date."
                });
            }
            else {
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

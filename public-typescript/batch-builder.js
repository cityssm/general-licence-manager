"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const transactionBatchesTableElement = document.querySelector("#table--transactionBatches");
    const licences = exports.licences;
    let batchDateStrings = [];
    const updateBatchTransactionAmount = (changeEvent) => {
        changeEvent.preventDefault();
        const transactionAmountElement = changeEvent.currentTarget;
        const transactionAmount = transactionAmountElement.value;
        const batchDateString = transactionAmountElement.closest("td").dataset.batchDateString;
        const licenceId = transactionAmountElement.closest("tr").dataset.licenceId;
        cityssm.postJSON(urlPrefix + "/batches/updateBatchTransaction", {
            licenceId,
            batchDateString,
            transactionAmount
        }, (responseJSON) => {
            if (responseJSON.success) {
                batchTransactions = responseJSON.batchTransactions;
                renderBatchTransactions();
            }
            else {
                bulmaJS.alert({
                    title: "Update Transaction Error",
                    message: "Please try again.",
                    contextualColorName: "danger"
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
            const thElement = document.createElement("th");
            thElement.dataset.batchDateString = batchDateString;
            thElement.innerHTML = batchDateString;
            transactionBatchesTableElement.querySelector("thead th:last-child")
                .insertAdjacentElement("beforebegin", thElement);
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
                inputElement.max = tableRowElement.dataset.max;
                inputElement.addEventListener("change", updateBatchTransactionAmount);
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

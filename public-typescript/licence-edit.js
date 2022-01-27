"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const licenceId = document.querySelector("#licenceEdit--licenceId").value;
    const isCreate = (licenceId === "");
    let hasUnsavedChanges = false;
    const setUnsavedChanges = () => {
        hasUnsavedChanges = true;
        cityssm.enableNavBlocker();
    };
    const editFormElement = document.querySelector("#form--licenceEdit");
    editFormElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        const submitURL = urlPrefix + "/licences/" +
            (isCreate
                ? "doCreateLicence"
                : "doUpdateLicence");
        cityssm.postJSON(submitURL, formEvent.currentTarget, (responseJSON) => {
            if (responseJSON.success) {
                hasUnsavedChanges = false;
                cityssm.disableNavBlocker();
                if (isCreate) {
                    window.location.href = urlPrefix + "/licences/" + responseJSON.licenceId.toString() + "/edit";
                }
                else {
                    bulmaJS.alert({
                        message: "Licence Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
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
    const unlockField = (clickEvent) => {
        clickEvent.preventDefault();
        const inputElement = clickEvent.currentTarget
            .closest(".field")
            .querySelector("input");
        inputElement.readOnly = false;
        inputElement.focus();
    };
    const unlockButtonElements = editFormElement.querySelectorAll(".is-unlock-button");
    for (const unlockButtonElement of unlockButtonElements) {
        unlockButtonElement.addEventListener("click", unlockField);
    }
    const licenceCategoryKeyElement = document.querySelector("#licenceEdit--licenceCategoryKey");
    const isRenewalElement = document.querySelector("#licenceEdit--isRenewal");
    const startDateStringElement = document.querySelector("#licenceEdit--startDateString");
    const endDateStringElement = document.querySelector("#licenceEdit--endDateString");
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
        }
        else {
            cityssm.postJSON(urlPrefix + "/licences/doGetLicenceEndDate", {
                licenceLengthFunction,
                startDateString: startDateStringElement.value
            }, (responseJSON) => {
                if (responseJSON.success) {
                    endDateStringElement.value = responseJSON.endDateString;
                }
                else {
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
    let licenceCategory;
    const renderLicenceCategoryFields = () => {
        const licenceFieldsContainerElement = document.querySelector("#container--licenceFields");
        if (!licenceCategory || licenceCategory.licenceCategoryFields.length === 0) {
            licenceFieldsContainerElement.innerHTML = "";
            licenceFieldsContainerElement.classList.add("is-hidden");
            return;
        }
        licenceFieldsContainerElement.classList.remove("is-hidden");
        licenceFieldsContainerElement.innerHTML = "<h2 class=\"panel-heading\">Fields</h2>";
        const licenceFieldKeys = [];
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
        const licenceApprovalsContainerElement = document.querySelector("#container--licenceApprovals");
        if (!licenceCategory || licenceCategory.licenceCategoryApprovals.length === 0) {
            licenceApprovalsContainerElement.innerHTML = "";
            licenceApprovalsContainerElement.classList.add("is-hidden");
            return;
        }
        licenceApprovalsContainerElement.classList.remove("is-hidden");
        licenceApprovalsContainerElement.innerHTML = "<h2 class=\"panel-heading\">Approvals</h2>";
        const licenceApprovalKeys = [];
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
        const licenceFeeElement = document.querySelector("#licenceEdit--licenceFee");
        const replacementFeeElement = document.querySelector("#licenceEdit--replacementFee");
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
        }, (responseJSON) => {
            licenceCategory = responseJSON.licenceCategory;
            renderLicenceCategory();
        });
    };
    if (isCreate) {
        licenceCategoryKeyElement.addEventListener("change", refreshLicenceCategory);
        if (licenceCategoryKeyElement.value !== "") {
            refreshLicenceCategory();
        }
    }
    else {
        licenceCategory = exports.licenceCategory;
    }
    isRenewalElement.addEventListener("change", () => {
        const approvalInputElements = document.querySelector("#container--licenceApprovals").querySelectorAll("input");
        for (const approvalInputElement of approvalInputElements) {
            approvalInputElement.required =
                (isRenewalElement.checked && approvalInputElement.dataset.isRequiredForRenewal === "true") ||
                    (!isRenewalElement.checked && approvalInputElement.dataset.isRequiredForNew === "true")
                    ? true
                    : false;
        }
        refreshLicenceCategoryFees();
    });
    const licenceTransactionsTableElement = document.querySelector("#table--licenceTransactions");
    let licenceTransactions;
    const getOutstandingBalance = () => {
        const licenceFeeString = document.querySelector("#licenceEdit--licenceFee").value;
        const transactionAmountTotalString = licenceTransactionsTableElement.querySelectorAll("tfoot th")[1].textContent.slice(1);
        const outstandingBalance = Math.max(Number.parseFloat(licenceFeeString) - Number.parseFloat(transactionAmountTotalString), 0);
        return outstandingBalance;
    };
    const deleteLicenceTransaction = (clickEvent) => {
        clickEvent.preventDefault();
        const transactionIndex = clickEvent.currentTarget
            .closest("tr").dataset.transactionIndex;
        const doDelete = () => {
            cityssm.postJSON(urlPrefix + "/licences/doDeleteLicenceTransaction", {
                licenceId,
                transactionIndex
            }, (responseJSON) => {
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
        });
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
    const openAddTransactionModal = (clickEvent) => {
        clickEvent.preventDefault();
        let addTransactionModalElement;
        let addTransactionCloseModalFunction;
        const addTransactionSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/licences/doAddLicenceTransaction", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    licenceTransactions = responseJSON.licenceTransactions;
                    renderLicenceTransactions();
                    addTransactionCloseModalFunction();
                }
            });
        };
        const setTransactionAmountFunction = (clickEvent) => {
            clickEvent.preventDefault();
            const transactionAmountSpanId = clickEvent.currentTarget.dataset.spanId;
            addTransactionModalElement.querySelector("#transactionAdd--transactionAmount").value =
                addTransactionModalElement.querySelector("#" + transactionAmountSpanId).textContent;
        };
        cityssm.openHtmlModal("transaction-add", {
            onshow: (modalElement) => {
                modalElement.querySelector("#transactionAdd--licenceId").value = licenceId;
                const licenceFeeString = document.querySelector("#licenceEdit--licenceFee").value;
                modalElement.querySelector("#transactionAdd--licenceFee").textContent = licenceFeeString;
                modalElement.querySelector("#transactionAdd--replacementFee").textContent =
                    document.querySelector("#licenceEdit--replacementFee").value;
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
        const deleteTransactionButtonElements = document.querySelectorAll(".is-delete-transaction-button");
        for (const deleteTransactionButtonElement of deleteTransactionButtonElements) {
            deleteTransactionButtonElement.addEventListener("click", deleteLicenceTransaction);
        }
    }
    const issueLicenceButtonElement = document.querySelector("#is-issue-licence-button");
    if (issueLicenceButtonElement) {
        const doIssue = () => {
            cityssm.postJSON(urlPrefix + "/licences/doIssueLicence", {
                licenceId
            }, (responseJSON) => {
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
            }
            else if (getOutstandingBalance() > 0) {
                bulmaJS.confirm({
                    title: "Licence Has an Outstanding Balance",
                    message: "Are you sure you want to issue this licence with an outstanding balance?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Issue with Outstanding Balance",
                        callbackFunction: doIssue
                    }
                });
            }
            else {
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
    if (!isCreate && !issueLicenceButtonElement) {
        const doRenew = () => {
            const url = new URL(window.location.protocol + "//" +
                window.location.host +
                urlPrefix + "/licences/new");
            url.searchParams.append("licenceCategoryKey", licenceCategoryKeyElement.value);
            url.searchParams.append("isRenewal", "true");
            url.searchParams.append("licenseeName", document.querySelector("#licenceEdit--licenseeName").value);
            url.searchParams.append("licenseeBusinessName", document.querySelector("#licenceEdit--licenseeBusinessName").value);
            url.searchParams.append("licenseeAddress1", document.querySelector("#licenceEdit--licenseeAddress1").value);
            url.searchParams.append("licenseeAddress2", document.querySelector("#licenceEdit--licenseeAddress2").value);
            url.searchParams.append("licenseeCity", document.querySelector("#licenceEdit--licenseeCity").value);
            url.searchParams.append("licenseeProvince", document.querySelector("#licenceEdit--licenseeProvince").value);
            url.searchParams.append("licenseePostalCode", document.querySelector("#licenceEdit--licenseePostalCode").value);
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
                message: "Are you sure you want to renew this licence?",
                okButton: {
                    text: "Yes, Renew this Licence",
                    callbackFunction: doRenew
                }
            });
        });
    }
    if (!isCreate) {
        document.querySelector("#is-delete-licence-button").addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            const isIssued = !issueLicenceButtonElement;
            const isPast = endDateStringElement.value < cityssm.dateToString(new Date());
            const doDelete = () => {
                cityssm.postJSON(urlPrefix + "/licences/doDeleteLicence", {
                    licenceId
                }, (responseJSON) => {
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

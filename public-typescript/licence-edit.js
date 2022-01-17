"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const licenceId = document.querySelector("#licenceEdit--licenceId").value;
    const isCreate = (licenceId === "");
    document.querySelector("#form--licenceEdit").addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        const submitURL = urlPrefix + "/licences/" +
            (isCreate
                ? "doCreateLicence"
                : "doUpdateLicence");
        cityssm.postJSON(submitURL, formEvent.currentTarget, (responseJSON) => {
            if (responseJSON.success) {
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
    const licenceCategoryKeyElement = document.querySelector("#licenceEdit--licenceCategoryKey");
    const isRenewalElement = document.querySelector("#licenceEdit--isRenewal");
    const startDateStringElement = document.querySelector("#licenceEdit--startDateString");
    const endDateStringElement = document.querySelector("#licenceEdit--endDateString");
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
    const openAddTransactionModal = (clickEvent) => {
        clickEvent.preventDefault();
        cityssm.openHtmlModal("transaction-add", {
            onshow: (modalElement) => {
            }
        });
    };
    if (!isCreate) {
        document.querySelector("#button--addTransaction").addEventListener("click", openAddTransactionModal);
    }
})();

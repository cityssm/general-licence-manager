"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const glm = exports.glm;
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const licenceAlias = exports.licenceAlias;
    const licenceAliasPlural = exports.licenceAliasPlural;
    const licenseeAlias = exports.licenseeAlias;
    const includeReplacementFee = exports.includeReplacementFee;
    const licenceId = document.querySelector("#licenceEdit--licenceId").value;
    const isCreate = (licenceId === "");
    const populateBankName = (bankInstitutionNumberElement, bankTransitNumberElement, bankNameElement) => {
        const bankInstitutionNumber = bankInstitutionNumberElement.value;
        const bankTransitNumber = bankTransitNumberElement.value;
        if (bankInstitutionNumber === "") {
            bankNameElement.value = "";
            return;
        }
        glm.getBankName(bankInstitutionNumber, bankTransitNumber, (bankName) => {
            bankNameElement.value =
                (!bankName || bankName === "")
                    ? "Institution Not Found (" + bankInstitutionNumber + ")"
                    : bankName;
        });
    };
    let hasUnsavedChanges = false;
    let refreshAfterSave = false;
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
                if (isCreate || refreshAfterSave) {
                    window.location.href = urlPrefix + "/licences/" + responseJSON.licenceId.toString() + "/edit?t=" + Date.now();
                }
                else {
                    bulmaJS.alert({
                        message: licenceAlias + " Updated Successfully",
                        contextualColorName: "success"
                    });
                }
            }
            else {
                bulmaJS.alert({
                    title: "Error Updating " + licenceAlias,
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
    if (isCreate && document.querySelector("#is-cancel-related-licence-id-button")) {
        document.querySelector("#is-cancel-related-licence-id-button").addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.currentTarget.closest(".message").remove();
        });
    }
    if (!isCreate && document.querySelector("#panel--relatedLicences")) {
        const currentDateString = cityssm.dateToString(new Date());
        const getRelatedLicenceHTML = (relatedLicence) => {
            const licenceURL = urlPrefix + "/licences/" + relatedLicence.licenceId +
                (relatedLicence.endDateString >= currentDateString
                    ? "/edit"
                    : "");
            return "<div class=\"columns mb-0\">" +
                "<div class=\"column\">" +
                "<a class=\"has-text-weight-bold\" href=\"" + licenceURL + "\" target=\"_blank\">" +
                licenceAlias + " #" + cityssm.escapeHTML(relatedLicence.licenceNumber) +
                "</a>" +
                "</div>" +
                "<div class=\"column is-narrow is-button-container\"></div>" +
                "</div>" +
                "<div class=\"columns is-size-7\">" +
                ("<div class=\"column\">" +
                    "<span data-tooltip=\"" + licenceAlias + " Category\">" + cityssm.escapeHTML(relatedLicence.licenceCategory) + "</span>" +
                    "</div>") +
                ("<div class=\"column\">" +
                    "<span data-tooltip=\"" + licenseeAlias + " Name\">" + cityssm.escapeHTML(relatedLicence.licenseeName) + "</span>" +
                    "</div>") +
                ("<div class=\"column\">" +
                    "<span data-tooltip=\"Start Date\">" + relatedLicence.startDateString + "</span>" +
                    " to " +
                    "<span data-tooltip=\"End Date\">" + relatedLicence.endDateString + "</span>" +
                    "</div>") +
                ("<div class=\"column is-narrow\">" +
                    (relatedLicence.issueDate
                        ? "<span class=\"tag is-success\">Issued</span>"
                        : "<span class=\"tag is-warning\">Pending</span>") +
                    "</div>") +
                "</div>";
        };
        const removeRelatedLicence = (clickEvent) => {
            clickEvent.preventDefault();
            const relatedLicenceId = clickEvent.currentTarget.closest(".panel-block").dataset.relatedLicenceId;
            const doRemove = () => {
                cityssm.postJSON(urlPrefix + "/licences/doDeleteRelatedLicence", {
                    licenceId,
                    relatedLicenceId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        renderRelatedLicences(responseJSON.relatedLicences);
                    }
                });
            };
            bulmaJS.confirm({
                title: "Remove Related " + licenceAlias,
                message: "Are you sure you want to remove this related " + licenceAlias.toLowerCase() + "?<br />" +
                    "Note that only the relationship will be removed, not the " + licenceAlias.toLowerCase() + " itself.",
                messageIsHtml: true,
                okButton: {
                    text: "Yes, Remove the Relationship",
                    callbackFunction: doRemove
                }
            });
        };
        const renderRelatedLicences = (relatedLicences) => {
            const relatedLicencesPanelElement = document.querySelector("#panel--relatedLicences");
            const panelBlockElements = relatedLicencesPanelElement.querySelectorAll(".panel-block");
            for (const panelBlockElement of panelBlockElements) {
                panelBlockElement.remove();
            }
            if (relatedLicences.length === 0) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block is-block";
                panelBlockElement.innerHTML = "<div class=\"message is-small is-info\">" +
                    "<p class=\"message-body\">There are no related " + licenceAliasPlural.toLowerCase() + ".</p>" +
                    "</div>";
                relatedLicencesPanelElement.append(panelBlockElement);
            }
            for (const relatedLicence of relatedLicences) {
                const panelBlockElement = document.createElement("div");
                panelBlockElement.className = "panel-block is-block";
                panelBlockElement.dataset.relatedLicenceId = relatedLicence.licenceId.toString();
                panelBlockElement.innerHTML = getRelatedLicenceHTML(relatedLicence);
                const deleteButtonElement = document.createElement("button");
                deleteButtonElement.className = "button is-small is-inverted is-danger";
                deleteButtonElement.type = "button";
                deleteButtonElement.ariaLabel = "Delete Related Licence";
                deleteButtonElement.innerHTML = "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>";
                deleteButtonElement.addEventListener("click", removeRelatedLicence);
                panelBlockElement.querySelector(".is-button-container")
                    .append(deleteButtonElement);
                relatedLicencesPanelElement.append(panelBlockElement);
            }
        };
        document.querySelector("#button--addRelatedLicence").addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            const addButtonElement = clickEvent.currentTarget;
            let addRelatedLicencesModalElement;
            const doAdd = (clickEvent) => {
                clickEvent.preventDefault();
                const panelBlockElement = clickEvent.currentTarget.closest(".panel-block");
                const relatedLicenceId = panelBlockElement.dataset.licenceId;
                cityssm.postJSON(urlPrefix + "/licences/doAddRelatedLicence", {
                    licenceId,
                    relatedLicenceId
                }, (responseJSON) => {
                    if (responseJSON.success) {
                        panelBlockElement.remove();
                        renderRelatedLicences(responseJSON.relatedLicences);
                    }
                });
            };
            const doSearch = (changeEvent) => {
                if (changeEvent) {
                    changeEvent.preventDefault();
                }
                const containerElement = addRelatedLicencesModalElement.querySelector("#container--relatableLicences");
                containerElement.innerHTML = "<div class=\"my-4 has-text-centered has-text-grey-light\">" +
                    "<i class=\"fas fa-4x fa-spinner fa-pulse\"></i><br />" +
                    "<em>Loading " + licenceAliasPlural.toLowerCase() + "...</em>" +
                    "</div>";
                const searchString = addRelatedLicencesModalElement.querySelector("#addRelatedLicence--searchString").value;
                cityssm.postJSON(urlPrefix + "/licences/doGetRelatableLicences", {
                    licenceId,
                    searchString
                }, (responseJSON) => {
                    if (responseJSON.licences.length === 0) {
                        containerElement.innerHTML = "<div class=\"message is-info\">" +
                            "<p class=\"message-body\">There are no " + licenceAliasPlural.toLowerCase() + " that meet your criteria.</p>" +
                            "</div>";
                        return;
                    }
                    const panelElement = document.createElement("div");
                    panelElement.className = "panel";
                    for (const relatableLicence of responseJSON.licences) {
                        const panelBlockElement = document.createElement("div");
                        panelBlockElement.className = "panel-block is-block";
                        panelBlockElement.dataset.licenceId = relatableLicence.licenceId.toString();
                        panelBlockElement.innerHTML = getRelatedLicenceHTML(relatableLicence);
                        const addButtonElement = document.createElement("button");
                        addButtonElement.className = "button is-small is-success";
                        addButtonElement.type = "button";
                        addButtonElement.ariaLabel = "Add Related Licence";
                        addButtonElement.innerHTML = "<i class=\"fas fa-plus\" aria-hidden=\"true\"></i>";
                        addButtonElement.addEventListener("click", doAdd);
                        panelBlockElement.querySelector(".is-button-container")
                            .append(addButtonElement);
                        panelElement.append(panelBlockElement);
                    }
                    containerElement.innerHTML = "";
                    containerElement.append(panelElement);
                });
            };
            cityssm.openHtmlModal("relatedLicence-add", {
                onshow: (modalElement) => {
                    addRelatedLicencesModalElement = modalElement;
                    glm.populateAliases(modalElement);
                    document.querySelector("#addRelatedLicence--searchString").addEventListener("change", doSearch);
                    doSearch();
                },
                onshown: () => {
                    bulmaJS.toggleHtmlClipped();
                    document.querySelector("#addRelatedLicence--searchString").focus();
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                    addButtonElement.focus();
                }
            });
        });
        renderRelatedLicences(exports.relatedLicences);
    }
    const bankInstitutionNumberElement = document.querySelector("#licenceEdit--bankInstitutionNumber");
    const bankTransitNumberElement = document.querySelector("#licenceEdit--bankTransitNumber");
    if (exports.includeBatches) {
        const refreshBankName = (changeEvent) => {
            changeEvent.preventDefault();
            const bankNameElement = document.querySelector("#licenceEdit--bankName");
            populateBankName(bankInstitutionNumberElement, bankTransitNumberElement, bankNameElement);
        };
        bankInstitutionNumberElement.addEventListener("change", refreshBankName);
        bankTransitNumberElement.addEventListener("change", refreshBankName);
    }
    const isRenewalElement = document.querySelector("#licenceEdit--isRenewal");
    const hasOutstandingRequiredApprovals = () => {
        const isRenewal = isRenewalElement.checked;
        const approvalCheckboxElements = document.querySelectorAll("#container--licenceApprovals input[type='checkbox']");
        for (const approvalCheckboxElement of approvalCheckboxElements) {
            if (!approvalCheckboxElement.checked && ((isRenewal && approvalCheckboxElement.dataset.isRequiredForRenewal === "true") ||
                (!isRenewal && approvalCheckboxElement.dataset.isRequiredForNew === "true"))) {
                return true;
            }
        }
        return false;
    };
    const licenceCategoryKeyElement = document.querySelector("#licenceEdit--licenceCategoryKey");
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
        const baseLicenceFeeElement = document.querySelector("#licenceEdit--baseLicenceFee");
        const baseReplacementFeeElement = document.querySelector("#licenceEdit--baseReplacementFee");
        if (!licenceCategory || licenceCategory.licenceCategoryFees.length === 0) {
            baseLicenceFeeElement.value = "";
            if (baseReplacementFeeElement) {
                baseReplacementFeeElement.value = "";
            }
            return;
        }
        baseLicenceFeeElement.value = (isRenewalElement.checked
            ? licenceCategory.licenceCategoryFees[0].renewalFee.toFixed(2)
            : licenceCategory.licenceCategoryFees[0].licenceFee.toFixed(2));
        if (baseReplacementFeeElement) {
            baseReplacementFeeElement.value = licenceCategory.licenceCategoryFees[0].replacementFee.toFixed(2);
        }
        if (!isCreate && !additionalFeeTableElement.classList.contains("is-hidden")) {
            additionalFeeTableElement.classList.add("is-hidden");
            additionalFeeTableElement.insertAdjacentHTML("beforebegin", "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">Fees will be recalculated after saving.</p>" +
                "</div>");
            additionalFeeTableElement.closest(".panel")
                .querySelector(".panel-heading .level-right")
                .classList
                .add("is-hidden");
            refreshAfterSave = true;
        }
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
        refreshLicenceCategoryFees();
    });
    let optionalAdditionalFees;
    const additionalFeeTableElement = document.querySelector("#table--licenceAdditionalFees");
    const deleteAdditionalFee = (clickEvent) => {
        clickEvent.preventDefault();
        const additionalFeeRowElement = clickEvent.currentTarget.closest("tr");
        const licenceAdditionalFeeKey = additionalFeeRowElement.dataset.licenceAdditionalFeeKey;
        const doDelete = () => {
            cityssm.postJSON(urlPrefix + "/licences/doDeleteAdditionalFee", {
                licenceId,
                licenceAdditionalFeeKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    additionalFeeRowElement.remove();
                    document.querySelector("#licenceEdit--licenceFee").value = responseJSON.licenceFee.toFixed(2);
                    renderLicenceTransactions();
                }
            });
        };
        bulmaJS.confirm({
            title: "Delete Additional Fee",
            message: "Are you sure you want to remove this additional fee?",
            contextualColorName: "warning",
            okButton: {
                text: "Yes, Remove the Fee",
                callbackFunction: doDelete
            }
        });
    };
    const openAddAdditionalFeeModal = (clickEvent) => {
        clickEvent.preventDefault();
        let addAdditionalFeeCloseModalFunction;
        const submitFunction_addAdditionalFee = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/licences/doAddAdditionalFee", formEvent.currentTarget, (responseJSON) => {
                if (!responseJSON.success) {
                    bulmaJS.alert({
                        title: "Error Adding Additional Fee",
                        message: "Please try again.",
                        contextualColorName: "danger"
                    });
                    return;
                }
                const additionalFeeRowElement = document.createElement("tr");
                additionalFeeRowElement.dataset.licenceAdditionalFeeKey = responseJSON.additionalFee.licenceAdditionalFeeKey;
                additionalFeeRowElement.innerHTML = "<td class=\"has-width-1\"><i class=\"fas fa-plus\" aria-label=\"Plus\"></i></td>" +
                    "<td>" + cityssm.escapeHTML(responseJSON.additionalFee.additionalFee) + "</td>" +
                    "<td class=\"has-text-right\">$" + responseJSON.additionalFee.additionalFeeAmount.toFixed(2) + "</td>" +
                    ("<td class=\"has-width-1\">" +
                        "<button class=\"button is-small is-danger is-inverted\" type=\"button\" aria-label=\"Delete Additional Fee\">" +
                        "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                        "</td>");
                additionalFeeRowElement.querySelector("button").addEventListener("click", deleteAdditionalFee);
                additionalFeeTableElement.querySelector("tbody").append(additionalFeeRowElement);
                document.querySelector("#licenceEdit--licenceFee").value = responseJSON.licenceFee.toFixed(2);
                addAdditionalFeeCloseModalFunction();
                renderLicenceTransactions();
            });
        };
        cityssm.openHtmlModal("additionalFee-add", {
            onshown: (modalElement, closeModalFunction) => {
                addAdditionalFeeCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                modalElement.querySelector("#additionalFeeAdd--licenceId").value = licenceId;
                const availableAdditionalFees = optionalAdditionalFees.filter((additionalFee) => {
                    if (additionalFeeTableElement.querySelector("tbody tr[data-licence-additional-fee-key='" + additionalFee.licenceAdditionalFeeKey + "']")) {
                        return false;
                    }
                    return true;
                });
                if (availableAdditionalFees.length === 0) {
                    closeModalFunction();
                    bulmaJS.alert({
                        title: "No Additional Fees Available",
                        message: "All available additional fees are already included.",
                        contextualColorName: "info"
                    });
                    return;
                }
                const licenceAdditionalFeeKeyElement = modalElement.querySelector("#additionalFeeAdd--licenceAdditionalFeeKey");
                for (const availableAdditionalFee of availableAdditionalFees) {
                    const optionElement = document.createElement("option");
                    optionElement.value = availableAdditionalFee.licenceAdditionalFeeKey;
                    optionElement.textContent = availableAdditionalFee.additionalFee;
                    licenceAdditionalFeeKeyElement.append(optionElement);
                }
                modalElement.querySelector("#form--additionalFeeAdd").addEventListener("submit", submitFunction_addAdditionalFee);
            }
        });
    };
    if (!isCreate) {
        const addAdditionalFeeButtonElement = document.querySelector("#button--addAdditionalFee");
        if (addAdditionalFeeButtonElement) {
            optionalAdditionalFees = licenceCategory.licenceCategoryAdditionalFees.filter((additionalFee) => {
                return !additionalFee.isRequired;
            });
            addAdditionalFeeButtonElement.addEventListener("click", openAddAdditionalFeeModal);
        }
        const deleteAdditionalFeeButtonElements = additionalFeeTableElement.querySelectorAll(".is-delete-additional-fee-button");
        for (const deleteAdditionalFeeButtonElement of deleteAdditionalFeeButtonElements) {
            deleteAdditionalFeeButtonElement.addEventListener("click", deleteAdditionalFee);
        }
    }
    const licenceTransactionsTableElement = document.querySelector("#table--licenceTransactions");
    let licenceTransactions = exports.licenceTransactions;
    const getOutstandingBalance = () => {
        const licenceFeeString = document.querySelector("#licenceEdit--licenceFee").value;
        const transactionAmountTotalString = licenceTransactionsTableElement.querySelector("#transactions--total").textContent.slice(1);
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
        const currentDateString = cityssm.dateToString(new Date());
        for (const licenceTransaction of licenceTransactions) {
            const trElement = document.createElement("tr");
            trElement.dataset.transactionIndex = licenceTransaction.transactionIndex.toString();
            trElement.innerHTML =
                ("<td>" +
                    "<p>" + licenceTransaction.transactionDateString + "<p>" +
                    (licenceTransaction.transactionNote && licenceTransaction.transactionNote !== ""
                        ? "<p class=\"is-size-7\">" + cityssm.escapeHTML(licenceTransaction.transactionNote) + "</p>"
                        : "") +
                    "<div class=\"tags\">" +
                    (currentDateString < licenceTransaction.transactionDateString
                        ? "<span class=\"tag is-warning\">Upcoming</span>"
                        : "") +
                    (licenceTransaction.batchDate
                        ? "<span class=\"tag is-info\">Batch Transaction</span>"
                        : "") +
                    (licenceTransaction.batchDate && (!licenceTransaction.externalReceiptNumber || licenceTransaction.externalReceiptNumber === "")
                        ? "<span class=\"tag is-warning\">Unconfirmed</span>"
                        : "") +
                    "</div>" +
                    "</td>") +
                    ("<td class=\"has-text-right" + (licenceTransaction.transactionAmount === 0 ? " has-text-danger" : "") + "\">" +
                        "$" + licenceTransaction.transactionAmount.toFixed(2) +
                        "</td>") +
                    ("<td>" +
                        "<button class=\"button is-small is-danger is-inverted\" type=\"button\" aria-label=\"Delete Transaction\">" +
                        "<i class=\"fas fa-trash\" aria-hidden=\"true\"></i>" +
                        "</button>" +
                        "</td>");
            trElement.querySelector("button").addEventListener("click", deleteLicenceTransaction);
            tbodyElement.append(trElement);
            transactionTotal += licenceTransaction.transactionAmount;
        }
        const tfootElement = licenceTransactionsTableElement.querySelector("tfoot");
        tfootElement.innerHTML = "<tr>" +
            "<th>Total</th>" +
            "<th id=\"transactions--total\" class=\"has-text-right\">$" + transactionTotal.toFixed(2) + "</th>" +
            "<th></th>" +
            "</tr>";
        const outstandingBalance = getOutstandingBalance();
        if (outstandingBalance > 0) {
            tfootElement.insertAdjacentHTML("beforeend", "<tr class=\"has-background-danger-light\">" +
                "<th>Outstanding Balance</th>" +
                "<th class=\"has-text-right\">$" + outstandingBalance.toFixed(2) + "</th>" +
                "<th></th>" +
                "</tr>");
        }
    };
    const addTransaction_getBankNameFunction = (changeEvent) => {
        changeEvent.preventDefault();
        const modalElement = changeEvent.currentTarget.closest(".modal");
        const bankInstitutionNumberElement = modalElement.querySelector("#transactionAdd--bankInstitutionNumber");
        const bankTransitNumberElement = modalElement.querySelector("#transactionAdd--bankTransitNumber");
        const bankNameElement = modalElement.querySelector("#transactionAdd--bankName");
        populateBankName(bankInstitutionNumberElement, bankTransitNumberElement, bankNameElement);
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
                glm.populateAliases(modalElement);
                modalElement.querySelector("#transactionAdd--licenceId").value = licenceId;
                const licenceFeeString = document.querySelector("#licenceEdit--licenceFee").value;
                modalElement.querySelector("#transactionAdd--licenceFee").textContent = licenceFeeString;
                if (includeReplacementFee) {
                    modalElement.querySelector("#transactionAdd--replacementFee").textContent =
                        document.querySelector("#licenceEdit--replacementFee").value;
                }
                else {
                    modalElement.querySelector("#transactionAdd--replacementFee").closest("tr").remove();
                }
                const outstandingBalance = getOutstandingBalance();
                modalElement.querySelector("#transactionAdd--outstandingBalance").textContent = outstandingBalance.toFixed(2);
                modalElement.querySelector("#transactionAdd--transactionAmount").value =
                    (outstandingBalance > 0 || !includeReplacementFee
                        ? outstandingBalance.toFixed(2)
                        : document.querySelector("#licenceEdit--replacementFee").value);
            },
            onshown: (modalElement, closeModalFunction) => {
                addTransactionModalElement = modalElement;
                addTransactionCloseModalFunction = closeModalFunction;
                modalElement.querySelector("#transactionAdd--transactionAmount").focus();
                const setTransactionAmountButtonElements = modalElement.querySelectorAll(".is-set-transaction-amount-button");
                for (const setTransactionAmountButtonElement of setTransactionAmountButtonElements) {
                    setTransactionAmountButtonElement.addEventListener("click", setTransactionAmountFunction);
                }
                const addTransaction_bankInstitutionNumberElement = modalElement.querySelector("#transactionAdd--bankInstitutionNumber");
                const addTransaction_bankTransitNumberElement = modalElement.querySelector("#transactionAdd--bankTransitNumber");
                modalElement.querySelector("button.is-more-fields-button").addEventListener("click", (clickEvent) => {
                    clickEvent.preventDefault();
                    clickEvent.currentTarget.remove();
                    let moreFieldsSelector = ".is-more-fields";
                    if (exports.includeBatches) {
                        moreFieldsSelector += ", .is-more-fields-batch";
                    }
                    for (const element of modalElement.querySelectorAll(moreFieldsSelector)) {
                        element.classList.remove("is-hidden");
                    }
                    if (exports.includeBatches) {
                        addTransaction_bankInstitutionNumberElement.addEventListener("change", addTransaction_getBankNameFunction);
                        addTransaction_bankTransitNumberElement.addEventListener("change", addTransaction_getBankNameFunction);
                    }
                });
                if (exports.includeBatches) {
                    modalElement.querySelector("button.is-copy-bank-numbers-button").addEventListener("click", (clickEvent) => {
                        clickEvent.preventDefault();
                        addTransaction_bankInstitutionNumberElement.value = bankInstitutionNumberElement.value;
                        addTransaction_bankTransitNumberElement.value = bankTransitNumberElement.value;
                        modalElement.querySelector("#transactionAdd--bankName").value =
                            document.querySelector("#licenceEdit--bankName").value;
                        modalElement.querySelector("#transactionAdd--bankAccountNumber").value =
                            document.querySelector("#licenceEdit--bankAccountNumber").value;
                    });
                }
                modalElement.querySelector("#form--transactionAdd").addEventListener("submit", addTransactionSubmitFunction);
            }
        });
    };
    if (!isCreate) {
        renderLicenceTransactions();
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
                    window.location.href = urlPrefix + "/licences/" + licenceId + "/edit?t=" + Date.now();
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
            }
            else if (hasOutstandingRequiredApprovals()) {
                bulmaJS.alert({
                    title: licenceAlias + " Has Outstanding Required Approvals",
                    message: "Please ensure that all requirements have been met.",
                    contextualColorName: "warning"
                });
            }
            else if (getOutstandingBalance() > 0) {
                bulmaJS.confirm({
                    title: licenceAlias + " Has an Outstanding Balance",
                    message: "Are you sure you want to issue this " + licenceAlias.toLowerCase() + " with an outstanding balance?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Issue with Outstanding Balance",
                        callbackFunction: doIssue
                    }
                });
            }
            else if (startDateStringElement.value < cityssm.dateToString(new Date())) {
                bulmaJS.confirm({
                    title: licenceAlias + " Has a Start Date in the Past",
                    message: "Are you sure you want to issue this " + licenceAlias.toLowerCase() + " with a start date in the past?",
                    contextualColorName: "warning",
                    okButton: {
                        text: "Yes, Issue with a Past Start Date",
                        callbackFunction: doIssue
                    }
                });
            }
            else {
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
            if (bankInstitutionNumberElement) {
                url.searchParams.append("bankInstitutionNumber", bankInstitutionNumberElement.value);
                url.searchParams.append("bankTransitNumber", bankTransitNumberElement.value);
                url.searchParams.append("bankAccountNumber", document.querySelector("#licenceEdit--bankAccountNumber").value);
            }
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
                title: "Renew " + licenceAlias,
                message: "Are you sure you want to renew this " + licenceAlias.toLowerCase() + "?",
                okButton: {
                    text: "Yes, Renew this " + licenceAlias,
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

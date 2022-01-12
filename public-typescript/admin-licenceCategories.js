"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    let licenceCategories = exports.licenceCategories;
    const licenceCategoriesContainerElement = document.querySelector("#container--licenceCategories");
    const renderLicenceCategories = () => {
        if (licenceCategories.length === 0) {
            licenceCategoriesContainerElement.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">There are no licence categories available.</p>" +
                "</div>";
            return;
        }
        const panelElement = document.createElement("div");
        panelElement.className = "panel";
        for (const licenceCategory of licenceCategories) {
            const panelBlockElement = document.createElement("a");
            panelBlockElement.className = "panel-block is-block";
            panelBlockElement.dataset.licenceCategoryKey = licenceCategory.licenceCategoryKey;
            panelBlockElement.innerHTML = "<strong>" + cityssm.escapeHTML(licenceCategory.licenceCategory) + "</strong><br />" +
                "<div class=\"columns\">" +
                ("<div class=\"column has-text-centered\">" +
                    (licenceCategory.hasEffectiveFee
                        ? "<i class=\"fas fa-check has-text-success\"></i><br /><span class=\"is-size-7\">Effective Fee</span>"
                        : "<i class=\"fas fa-exclamation-triangle has-text-danger\"></i><br /><span class=\"is-size-7\">No Effective Fee</span>") +
                    "</div>") +
                ("<div class=\"column has-text-centered\">" +
                    (licenceCategory.printEJS === ""
                        ? "<i class=\"fas fa-exclamation-triangle has-text-danger\"></i><br /><span class=\"is-size-7\">No Print Template</span>"
                        : "<i class=\"fas fa-check has-text-success\"></i><br /><span class=\"is-size-7\">Print Template</span>") +
                    "</div>") +
                "</div>";
            panelBlockElement.addEventListener("click", openEditLicenceCategoryModalByClick);
            panelElement.append(panelBlockElement);
        }
        licenceCategoriesContainerElement.innerHTML = "";
        licenceCategoriesContainerElement.append(panelElement);
    };
    const getLicenceCategories = () => {
        licenceCategoriesContainerElement.innerHTML = "<p class=\"has-text-centered has-text-grey-lighter\">" +
            "<i class=\"fas fa-3x fa-circle-notch fa-spin\" aria-hidden=\"true\"></i><br />" +
            "<em>Loading licence categories...</em>" +
            "</p>";
        cityssm.postJSON(urlPrefix + "/admin/doGetLicenceCategories", {}, (responseJSON) => {
            licenceCategories = responseJSON.licenceCategories;
            renderLicenceCategories();
        });
    };
    let doRefreshOnClose = false;
    let editModalElement;
    let licenceCategoryFields;
    const openEditLicenceCategoryFieldModal = (licenceFieldKey) => {
        let editLicenceCategoryFieldModalCloseFunction;
        const updateLicenceCategoryFieldSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategoryField", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    licenceCategoryFields = responseJSON.licenceCategoryFields;
                    editLicenceCategoryFieldModalCloseFunction();
                    renderLicenceCategoryFields();
                    doRefreshOnClose = true;
                }
            });
        };
        const deleteLicenceCategoryFieldFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategoryField", {
                licenceFieldKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    licenceCategoryFields = responseJSON.licenceCategoryFields;
                    renderLicenceCategoryFields();
                    editLicenceCategoryFieldModalCloseFunction();
                    doRefreshOnClose = true;
                }
            });
        };
        const confirmDeleteLicenceCategoryFieldFunction = (clickEvent) => {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: "Delete Licence Field",
                message: "Are you sure you want to delete this licence field?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete It",
                    callbackFunction: deleteLicenceCategoryFieldFunction
                }
            });
        };
        const licenceCategoryField = licenceCategoryFields.find((possibleField) => {
            return possibleField.licenceFieldKey === licenceFieldKey;
        });
        cityssm.openHtmlModal("licenceCategoryField-edit", {
            onshow: (modalElement) => {
                modalElement.querySelector("#licenceCategoryFieldEdit--licenceFieldKey").value = licenceFieldKey;
                modalElement.querySelector("#licenceCategoryFieldEdit--licenceField").value = licenceCategoryField.licenceField;
                modalElement.querySelector("#licenceCategoryFieldEdit--licenceFieldDescription").value = licenceCategoryField.licenceFieldDescription;
                if (licenceCategoryField.isRequired) {
                    modalElement.querySelector("#licenceCategoryFieldEdit--isRequired").checked = true;
                }
                const minimumLengthElement = modalElement.querySelector("#licenceCategoryFieldEdit--minimumLength");
                const maximumLengthElement = modalElement.querySelector("#licenceCategoryFieldEdit--maximumLength");
                minimumLengthElement.value = licenceCategoryField.minimumLength.toString();
                minimumLengthElement.addEventListener("keyup", () => {
                    maximumLengthElement.min = minimumLengthElement.value;
                });
                maximumLengthElement.value = licenceCategoryField.maximumLength.toString();
                maximumLengthElement.min = licenceCategoryField.minimumLength.toString();
                modalElement.querySelector("#licenceCategoryFieldEdit--pattern").value = licenceCategoryField.pattern;
            },
            onshown: (modalElement, closeModalFunction) => {
                editLicenceCategoryFieldModalCloseFunction = closeModalFunction;
                modalElement.querySelector("#form--licenceCategoryFieldEdit")
                    .addEventListener("submit", updateLicenceCategoryFieldSubmitFunction);
                modalElement.querySelector(".is-delete-button")
                    .addEventListener("click", confirmDeleteLicenceCategoryFieldFunction);
                bulmaJS.init(modalElement);
            }
        });
    };
    const openEditLicenceCategoryFieldModalByClick = (clickEvent) => {
        clickEvent.preventDefault();
        const licenceFieldKey = clickEvent.currentTarget.dataset.licenceFieldKey;
        openEditLicenceCategoryFieldModal(licenceFieldKey);
    };
    const licenceCategoryField_dragDataPrefix = "licenceFieldKey:";
    const licenceCategoryField_dragstart = (dragEvent) => {
        dragEvent.dataTransfer.dropEffect = "move";
        const data = licenceCategoryField_dragDataPrefix + dragEvent.target.dataset.licenceFieldKey;
        dragEvent.dataTransfer.setData("text/plain", data);
    };
    const licenceCategoryField_dragover = (dragEvent) => {
        if (dragEvent.dataTransfer.getData("text/plain").startsWith(licenceCategoryField_dragDataPrefix)) {
            const licenceFieldKey_drag = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryField_dragDataPrefix.length);
            const licenceFieldKey_drop = dragEvent.currentTarget.dataset.licenceFieldKey;
            if (licenceFieldKey_drag !== licenceFieldKey_drop) {
                dragEvent.preventDefault();
                dragEvent.dataTransfer.dropEffect = "move";
            }
        }
    };
    const licenceCategoryField_drop = (dragEvent) => {
        dragEvent.preventDefault();
        const licenceFieldKey_from = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryField_dragDataPrefix.length);
        const licenceFieldKey_to = dragEvent.currentTarget.dataset.licenceFieldKey;
        cityssm.postJSON(urlPrefix + "/admin/doMoveLicenceCategoryField", {
            licenceFieldKey_from,
            licenceFieldKey_to
        }, (responseJSON) => {
            licenceCategoryFields = responseJSON.licenceCategoryFields;
            renderLicenceCategoryFields();
            doRefreshOnClose = true;
        });
    };
    const renderLicenceCategoryFields = () => {
        const fieldsContainerElement = editModalElement.querySelector("#container--licenceCategoryFields");
        if (licenceCategoryFields.length === 0) {
            fieldsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no additional fields captured with this licence.</p>" +
                "</div>";
        }
        else {
            const fieldsPanelElement = document.createElement("div");
            fieldsPanelElement.className = "panel";
            for (const categoryField of licenceCategoryFields) {
                const panelBlockElement = document.createElement("a");
                panelBlockElement.className = "panel-block is-block";
                panelBlockElement.dataset.licenceFieldKey = categoryField.licenceFieldKey;
                panelBlockElement.innerHTML = "<div class=\"columns is-mobile\">" +
                    ("<div class=\"column\">" +
                        "<h4>" + cityssm.escapeHTML(categoryField.licenceField) + "</h4>" +
                        "<p class=\"is-size-7\">" + cityssm.escapeHTML(categoryField.licenceFieldDescription) + "</p>" +
                        "</div>") +
                    (categoryField.isRequired
                        ? "<div class=\"column is-narrow\">" +
                            "<i class=\"fas fa-asterisk\" aria-hidden=\"true\"</i>" +
                            "</div>"
                        : "") +
                    "</div>";
                panelBlockElement.addEventListener("click", openEditLicenceCategoryFieldModalByClick);
                if (licenceCategoryFields.length > 1) {
                    panelBlockElement.draggable = true;
                    panelBlockElement.addEventListener("dragstart", licenceCategoryField_dragstart);
                    panelBlockElement.addEventListener("dragover", licenceCategoryField_dragover);
                    panelBlockElement.addEventListener("drop", licenceCategoryField_drop);
                }
                fieldsPanelElement.append(panelBlockElement);
            }
            fieldsContainerElement.innerHTML = "";
            fieldsContainerElement.append(fieldsPanelElement);
        }
    };
    let licenceCategoryApprovals;
    const openEditLicenceCategoryApprovalModal = (licenceApprovalKey) => {
        let editLicenceCategoryApprovalModalCloseFunction;
        const updateLicenceCategoryApprovalSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategoryApproval", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
                    editLicenceCategoryApprovalModalCloseFunction();
                    renderLicenceCategoryApprovals();
                    doRefreshOnClose = true;
                }
            });
        };
        const deleteLicenceCategoryApprovalFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategoryApproval", {
                licenceApprovalKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
                    renderLicenceCategoryApprovals();
                    editLicenceCategoryApprovalModalCloseFunction();
                    doRefreshOnClose = true;
                }
            });
        };
        const confirmDeleteLicenceCategoryApprovalFunction = (clickEvent) => {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: "Delete Licence Approval",
                message: "Are you sure you want to delete this licence approval?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete It",
                    callbackFunction: deleteLicenceCategoryApprovalFunction
                }
            });
        };
        const licenceCategoryApproval = licenceCategoryApprovals.find((possibleField) => {
            return possibleField.licenceApprovalKey === licenceApprovalKey;
        });
        cityssm.openHtmlModal("licenceCategoryApproval-edit", {
            onshow: (modalElement) => {
                modalElement.querySelector("#licenceCategoryApprovalEdit--licenceApprovalKey").value = licenceApprovalKey;
                modalElement.querySelector("#licenceCategoryApprovalEdit--licenceApproval").value = licenceCategoryApproval.licenceApproval;
                modalElement.querySelector("#licenceCategoryApprovalEdit--licenceApprovalDescription").value = licenceCategoryApproval.licenceApprovalDescription;
                if (licenceCategoryApproval.isRequiredForNew) {
                    modalElement.querySelector("#licenceCategoryApprovalEdit--isRequiredForNew").checked = true;
                }
                if (licenceCategoryApproval.isRequiredForRenewal) {
                    modalElement.querySelector("#licenceCategoryApprovalEdit--isRequiredForRenewal").checked = true;
                }
            },
            onshown: (modalElement, closeModalFunction) => {
                editLicenceCategoryApprovalModalCloseFunction = closeModalFunction;
                modalElement.querySelector("#form--licenceCategoryApprovalEdit")
                    .addEventListener("submit", updateLicenceCategoryApprovalSubmitFunction);
                modalElement.querySelector(".is-delete-button")
                    .addEventListener("click", confirmDeleteLicenceCategoryApprovalFunction);
                bulmaJS.init(modalElement);
            }
        });
    };
    const openEditLicenceCategoryApprovalModalByClick = (clickEvent) => {
        clickEvent.preventDefault();
        const licenceApprovalKey = clickEvent.currentTarget.dataset.licenceApprovalKey;
        openEditLicenceCategoryApprovalModal(licenceApprovalKey);
    };
    const licenceCategoryApproval_dragDataPrefix = "licenceApprovalKey:";
    const licenceCategoryApproval_dragstart = (dragEvent) => {
        dragEvent.dataTransfer.dropEffect = "move";
        const data = licenceCategoryApproval_dragDataPrefix + dragEvent.target.dataset.licenceApprovalKey;
        dragEvent.dataTransfer.setData("text/plain", data);
    };
    const licenceCategoryApproval_dragover = (dragEvent) => {
        if (dragEvent.dataTransfer.getData("text/plain").startsWith(licenceCategoryApproval_dragDataPrefix)) {
            const licenceApprovalKey_drag = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryApproval_dragDataPrefix.length);
            const licenceApprovalKey_drop = dragEvent.currentTarget.dataset.licenceApprovalKey;
            if (licenceApprovalKey_drag !== licenceApprovalKey_drop) {
                dragEvent.preventDefault();
                dragEvent.dataTransfer.dropEffect = "move";
            }
        }
    };
    const licenceCategoryApproval_drop = (dragEvent) => {
        dragEvent.preventDefault();
        const licenceApprovalKey_from = dragEvent.dataTransfer.getData("text/plain").slice(licenceCategoryApproval_dragDataPrefix.length);
        const licenceApprovalKey_to = dragEvent.currentTarget.dataset.licenceApprovalKey;
        cityssm.postJSON(urlPrefix + "/admin/doMoveLicenceCategoryApproval", {
            licenceApprovalKey_from,
            licenceApprovalKey_to
        }, (responseJSON) => {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
            renderLicenceCategoryApprovals();
            doRefreshOnClose = true;
        });
    };
    const renderLicenceCategoryApprovals = () => {
        const approvalsContainerElement = editModalElement.querySelector("#container--licenceCategoryApprovals");
        if (licenceCategoryApprovals.length === 0) {
            approvalsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no approvals associated with this licence.</p>" +
                "</div>";
        }
        else {
            const approvalsPanelElement = document.createElement("div");
            approvalsPanelElement.className = "panel";
            for (const categoryApproval of licenceCategoryApprovals) {
                const panelBlockElement = document.createElement("a");
                panelBlockElement.className = "panel-block is-block";
                panelBlockElement.dataset.licenceApprovalKey = categoryApproval.licenceApprovalKey;
                panelBlockElement.innerHTML = "<div class=\"columns is-mobile\">" +
                    ("<div class=\"column\">" +
                        "<h4>" + cityssm.escapeHTML(categoryApproval.licenceApproval) + "</h4>" +
                        "<p class=\"is-size-7\">" + cityssm.escapeHTML(categoryApproval.licenceApprovalDescription) + "</p>" +
                        "</div>") +
                    (categoryApproval.isRequiredForNew || categoryApproval.isRequiredForRenewal
                        ? "<div class=\"column is-narrow\">" +
                            "<i class=\"fas fa-asterisk\" aria-hidden=\"true\"</i>" +
                            "</div>"
                        : "") +
                    "</div>";
                panelBlockElement.addEventListener("click", openEditLicenceCategoryApprovalModalByClick);
                if (licenceCategoryApprovals.length > 1) {
                    panelBlockElement.draggable = true;
                    panelBlockElement.addEventListener("dragstart", licenceCategoryApproval_dragstart);
                    panelBlockElement.addEventListener("dragover", licenceCategoryApproval_dragover);
                    panelBlockElement.addEventListener("drop", licenceCategoryApproval_drop);
                }
                approvalsPanelElement.append(panelBlockElement);
            }
            approvalsContainerElement.innerHTML = "";
            approvalsContainerElement.append(approvalsPanelElement);
        }
    };
    let licenceCategoryFees;
    const openEditLicenceCategoryFeeModal = (licenceFeeId) => {
        let editLicenceCategoryFeeModalCloseFunction;
        const updateLicenceCategoryFeeSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategoryFee", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    licenceCategoryFees = responseJSON.licenceCategoryFees;
                    renderLicenceCategoryFees();
                    editLicenceCategoryFeeModalCloseFunction();
                }
            });
        };
        const deleteLicenceCategoryFeeFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategoryFee", {
                licenceFeeId
            }, (responseJSON) => {
                if (responseJSON.success) {
                    licenceCategoryFees = responseJSON.licenceCategoryFees;
                    renderLicenceCategoryFees();
                    doRefreshOnClose = true;
                    editLicenceCategoryFeeModalCloseFunction();
                }
            });
        };
        const confirmDeleteLicenceCategoryFeeFunction = (clickEvent) => {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: "Delete Licence Fee",
                message: "Are you sure you want to delete this fee record?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete It",
                    callbackFunction: deleteLicenceCategoryFeeFunction
                }
            });
        };
        const licenceCategoryFee = licenceCategoryFees.find((possibleField) => {
            return possibleField.licenceFeeId === licenceFeeId;
        });
        cityssm.openHtmlModal("licenceCategoryFee-edit", {
            onshow: (modalElement) => {
                modalElement.querySelector("#licenceCategoryFeeEdit--licenceFeeId").value = licenceCategoryFee.licenceFeeId.toString();
                modalElement.querySelector("#licenceCategoryFeeEdit--effectiveStartDateString").value = licenceCategoryFee.effectiveStartDateString;
                modalElement.querySelector("#licenceCategoryFeeEdit--effectiveEndDateString").value = licenceCategoryFee.effectiveEndDateString;
                modalElement.querySelector("#licenceCategoryFeeEdit--licenceFee").value = licenceCategoryFee.licenceFee.toFixed(2);
                if (licenceCategoryFee.renewalFee) {
                    modalElement.querySelector("#licenceCategoryFeeEdit--renewalFee").value = licenceCategoryFee.renewalFee.toFixed(2);
                }
                if (licenceCategoryFee.replacementFee) {
                    modalElement.querySelector("#licenceCategoryFeeEdit--replacementFee").value = licenceCategoryFee.replacementFee.toFixed(2);
                }
            },
            onshown: (modalElement, closeModalFunction) => {
                editLicenceCategoryFeeModalCloseFunction = closeModalFunction;
                modalElement.querySelector("#form--licenceCategoryFeeEdit")
                    .addEventListener("submit", updateLicenceCategoryFeeSubmitFunction);
                modalElement.querySelector(".is-delete-button")
                    .addEventListener("click", confirmDeleteLicenceCategoryFeeFunction);
                bulmaJS.init(modalElement);
            }
        });
    };
    const openEditLicenceCategoryFeeModalByClick = (clickEvent) => {
        clickEvent.preventDefault();
        const licenceFeeId = clickEvent.currentTarget.dataset.licenceFeeId;
        openEditLicenceCategoryFeeModal(Number.parseInt(licenceFeeId, 10));
    };
    const renderLicenceCategoryFees = () => {
        const feesContainerElement = editModalElement.querySelector("#container--licenceCategoryFees");
        if (licenceCategoryFees.length === 0) {
            feesContainerElement.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">There are no fees associated with this licence.</p>" +
                "</div>";
        }
        else {
            const feesPanelElement = document.createElement("div");
            feesPanelElement.className = "panel";
            const currentDateString = cityssm.dateToString(new Date());
            for (const categoryFee of licenceCategoryFees) {
                const panelBlockElement = document.createElement("a");
                panelBlockElement.className = "panel-block is-block";
                panelBlockElement.dataset.licenceFeeId = categoryFee.licenceFeeId.toString();
                let isEffective = false;
                let effectiveHTML;
                if (!categoryFee.effectiveStartDate) {
                    effectiveHTML = "<span class=\"has-text-danger\">No Effective Date</span>";
                }
                else {
                    effectiveHTML = "From " + categoryFee.effectiveStartDateString +
                        (categoryFee.effectiveEndDate
                            ? " to " + categoryFee.effectiveEndDateString
                            : "");
                    if (categoryFee.effectiveStartDateString <= currentDateString &&
                        (!categoryFee.effectiveEndDate || categoryFee.effectiveEndDateString >= currentDateString)) {
                        isEffective = true;
                    }
                }
                panelBlockElement.innerHTML = "<div class=\"columns is-mobile\">" +
                    ("<div class=\"column\">" +
                        "<h4>" + effectiveHTML + "</h4>" +
                        "<p class=\"is-size-7\">" +
                        "$" + categoryFee.licenceFee.toFixed(2) + " fee" +
                        "</p>" +
                        "</div>") +
                    (isEffective
                        ? "<div class=\"column is-narrow\">" +
                            "<i class=\"fas fa-asterisk\" aria-hidden=\"true\"</i>" +
                            "</div>"
                        : "") +
                    "</div>";
                panelBlockElement.addEventListener("click", openEditLicenceCategoryFeeModalByClick);
                feesPanelElement.append(panelBlockElement);
            }
            feesContainerElement.innerHTML = "";
            feesContainerElement.append(feesPanelElement);
        }
    };
    const openEditLicenceCategoryModal = (licenceCategoryKey) => {
        let categoryCloseModalFunction;
        const deleteLicenceCategoryFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doDeleteLicenceCategory", {
                licenceCategoryKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    doRefreshOnClose = false;
                    licenceCategories = responseJSON.licenceCategories;
                    categoryCloseModalFunction();
                    renderLicenceCategories();
                }
            });
        };
        const deleteLicenceCategoryConfirmFunction = (clickEvent) => {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: "Delete Licence Category",
                message: "Are you sure you want to delete this category?",
                contextualColorName: "warning",
                okButton: {
                    text: "Yes, Delete It",
                    callbackFunction: deleteLicenceCategoryFunction
                }
            });
        };
        const updateLicenceCategorySubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(urlPrefix + "/admin/doUpdateLicenceCategory", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: "Licence Category updated successfully.",
                        contextualColorName: "success"
                    });
                    doRefreshOnClose = true;
                }
                else {
                    bulmaJS.alert({
                        title: "Error Updating Licence Category",
                        message: responseJSON.errorMessage,
                        contextualColorName: "danger"
                    });
                }
            });
        };
        const addLicenceCategoryFieldSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategoryField", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    formElement.reset();
                    licenceCategoryFields = responseJSON.licenceCategoryFields;
                    renderLicenceCategoryFields();
                    openEditLicenceCategoryFieldModal(responseJSON.licenceFieldKey);
                }
            });
        };
        const addLicenceCategoryApprovalSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategoryApproval", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    formElement.reset();
                    licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
                    renderLicenceCategoryApprovals();
                    openEditLicenceCategoryApprovalModal(responseJSON.licenceApprovalKey);
                }
            });
        };
        const addLicenceCategoryFeeFunction = (clickEvent) => {
            clickEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategoryFee", {
                licenceCategoryKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    licenceCategoryFees = responseJSON.licenceCategoryFees;
                    renderLicenceCategoryFees();
                    openEditLicenceCategoryFeeModal(responseJSON.licenceFeeId);
                }
            });
        };
        const renderEditLicenceCategory = (responseJSON) => {
            if (!responseJSON.success) {
                bulmaJS.alert({
                    message: "Error loading Licence Category.",
                    contextualColorName: "danger"
                });
                doRefreshOnClose = true;
                return;
            }
            const licenceCategory = responseJSON.licenceCategory;
            editModalElement.querySelector("#licenceCategoryEdit--licenceCategory").value = licenceCategory.licenceCategory;
            editModalElement.querySelector("#licenceCategoryEdit--bylawNumber").value = licenceCategory.bylawNumber;
            const printEJSElement = editModalElement.querySelector("#licenceCategoryEdit--printEJS");
            if (!printEJSElement.querySelector("option[value='" + licenceCategory.printEJS + "']")) {
                const optionElement = document.createElement("option");
                optionElement.value = licenceCategory.printEJS;
                optionElement.textContent = licenceCategory.printEJS + " (Missing)";
                printEJSElement.append(optionElement);
            }
            printEJSElement.value = licenceCategory.printEJS;
            editModalElement.querySelector("#licenceCategoryEdit--licenceLengthYears").value = licenceCategory.licenceLengthYears.toString();
            editModalElement.querySelector("#licenceCategoryEdit--licenceLengthMonths").value = licenceCategory.licenceLengthMonths.toString();
            editModalElement.querySelector("#licenceCategoryEdit--licenceLengthDays").value = licenceCategory.licenceLengthDays.toString();
            licenceCategoryFields = licenceCategory.licenceCategoryFields;
            renderLicenceCategoryFields();
            licenceCategoryApprovals = licenceCategory.licenceCategoryApprovals;
            renderLicenceCategoryApprovals();
            licenceCategoryFees = licenceCategory.licenceCategoryFees;
            renderLicenceCategoryFees();
        };
        doRefreshOnClose = false;
        cityssm.openHtmlModal("licenceCategory-edit", {
            onshow: (modalElement) => {
                editModalElement = modalElement;
                modalElement.querySelector("#licenceCategoryEdit--licenceCategoryKey").value = licenceCategoryKey;
                modalElement.querySelector("#licenceCategoryFieldAdd--licenceCategoryKey").value = licenceCategoryKey;
                modalElement.querySelector("#licenceCategoryApprovalAdd--licenceCategoryKey").value = licenceCategoryKey;
                const printEJSElement = modalElement.querySelector("#licenceCategoryEdit--printEJS");
                for (const printEJS of exports.printEJSList) {
                    const optionElement = document.createElement("option");
                    optionElement.value = printEJS;
                    optionElement.textContent = printEJS;
                    printEJSElement.append(optionElement);
                }
                cityssm.postJSON(urlPrefix + "/admin/doGetLicenceCategory", {
                    licenceCategoryKey
                }, renderEditLicenceCategory);
            },
            onshown: (modalElement, closeModalFunction) => {
                categoryCloseModalFunction = closeModalFunction;
                modalElement.querySelector("#form--licenceCategoryEdit")
                    .addEventListener("submit", updateLicenceCategorySubmitFunction);
                modalElement.querySelector("#form--licenceCategoryFieldAdd")
                    .addEventListener("submit", addLicenceCategoryFieldSubmitFunction);
                modalElement.querySelector("#form--licenceCategoryApprovalAdd")
                    .addEventListener("submit", addLicenceCategoryApprovalSubmitFunction);
                modalElement.querySelector(".is-add-fee-button")
                    .addEventListener("click", addLicenceCategoryFeeFunction);
                modalElement.querySelector(".is-delete-button")
                    .addEventListener("click", deleteLicenceCategoryConfirmFunction);
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init();
            },
            onhidden: () => {
                if (doRefreshOnClose) {
                    getLicenceCategories();
                }
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };
    const openEditLicenceCategoryModalByClick = (clickEvent) => {
        clickEvent.preventDefault();
        const licenceCategoryKey = clickEvent.currentTarget.dataset.licenceCategoryKey;
        openEditLicenceCategoryModal(licenceCategoryKey);
    };
    const openAddLicenceCategoryModal = () => {
        let addLicenceCategoryCloseModalFunction;
        const addLicenceCategorySubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategory", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    licenceCategories = responseJSON.licenceCategories;
                    renderLicenceCategories();
                    addLicenceCategoryCloseModalFunction();
                    openEditLicenceCategoryModal(responseJSON.licenceCategoryKey);
                }
            });
        };
        cityssm.openHtmlModal("licenceCategory-add", {
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                addLicenceCategoryCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", addLicenceCategorySubmitFunction);
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };
    renderLicenceCategories();
    document.querySelector("#button--addLicenceCategory").addEventListener("click", openAddLicenceCategoryModal);
})();

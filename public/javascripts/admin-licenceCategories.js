"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const includeReplacementFee = exports.includeReplacementFee;
    let licenceCategories = exports.licenceCategories;
    const licenceCategoriesContainerElement = document.querySelector('#container--licenceCategories');
    const licenceCategorySearchElement = document.querySelector('#searchFilter--licenceCategory');
    function renderLicenceCategories() {
        if (licenceCategories.length === 0) {
            licenceCategoriesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no categories available.</p>
        </div>`;
            return;
        }
        let displayCount = 0;
        const searchStringPieces = licenceCategorySearchElement.value
            .toLowerCase()
            .split(' ');
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        for (const licenceCategory of licenceCategories) {
            let displayCategory = true;
            for (const searchStringPiece of searchStringPieces) {
                if (!licenceCategory.licenceCategory
                    .toLowerCase()
                    .includes(searchStringPiece)) {
                    displayCategory = false;
                    break;
                }
            }
            if (!displayCategory) {
                continue;
            }
            displayCount += 1;
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.licenceCategoryKey =
                licenceCategory.licenceCategoryKey;
            panelBlockElement.setAttribute('role', 'button');
            panelBlockElement.innerHTML = `<div class="columns is-multiline is-mobile">
          <div class="column is-6-tablet is-12-mobile">
            <strong>
              ${cityssm.escapeHTML(licenceCategory.licenceCategory)}
            </strong><br />
            <span class="is-size-7">
              ${cityssm.escapeHTML(licenceCategory.bylawNumber)}
            </span>
          </div>
          <div class="column is-6-mobile has-text-centered">
            ${licenceCategory.hasEffectiveFee
                ? '<i class="fas fa-check has-text-success"></i><br /><span class="is-size-7">Effective Fee</span>'
                : '<i class="fas fa-exclamation-triangle has-text-danger"></i><br /><span class="is-size-7">No Effective Fee</span>'}
          </div>
          <div class="column is-6-mobile has-text-centered">
            ${licenceCategory.printEJS === ''
                ? '<i class="fas fa-exclamation-triangle has-text-danger"></i><br /><span class="is-size-7">No Print Template</span>'
                : '<i class="fas fa-check has-text-success"></i><br /><span class="is-size-7">Print Template</span>'}
          </div>
        </div>`;
            panelBlockElement.addEventListener('click', openEditLicenceCategoryModalByClick);
            panelElement.append(panelBlockElement);
        }
        if (displayCount > 0) {
            licenceCategoriesContainerElement.innerHTML = '';
            licenceCategoriesContainerElement.append(panelElement);
        }
        else {
            licenceCategoriesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no categories available that meet the search criteria.</p>
        </div>`;
        }
    }
    function getLicenceCategories() {
        licenceCategoriesContainerElement.innerHTML = `<p class="has-text-centered has-text-grey-lighter">
      <i class="fas fa-3x fa-circle-notch fa-spin" aria-hidden="true"></i><br />
      <em>Loading categories...</em>
      </p>`;
        cityssm.postJSON(`${glm.urlPrefix}/admin/doGetLicenceCategories`, {}, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            licenceCategories = responseJSON.licenceCategories;
            renderLicenceCategories();
        });
    }
    licenceCategorySearchElement.addEventListener('keyup', renderLicenceCategories);
    let doRefreshOnClose = false;
    let editModalElement;
    let licenceCategoryFields;
    function openEditLicenceCategoryFieldModal(licenceFieldKey) {
        let editLicenceCategoryFieldModalCloseFunction;
        function updateLicenceCategoryFieldSubmitFunction(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${glm.urlPrefix}/admin/doUpdateLicenceCategoryField`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryFields = responseJSON.licenceCategoryFields;
                    editLicenceCategoryFieldModalCloseFunction();
                    renderLicenceCategoryFields();
                    doRefreshOnClose = true;
                }
            });
        }
        function deleteLicenceCategoryFieldFunction() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doDeleteLicenceCategoryField`, {
                licenceFieldKey
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryFields = responseJSON.licenceCategoryFields;
                    renderLicenceCategoryFields();
                    editLicenceCategoryFieldModalCloseFunction();
                    doRefreshOnClose = true;
                }
            });
        }
        function confirmDeleteLicenceCategoryFieldFunction(clickEvent) {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: 'Delete Field',
                message: 'Are you sure you want to delete this field?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete It',
                    callbackFunction: deleteLicenceCategoryFieldFunction
                }
            });
        }
        const licenceCategoryField = licenceCategoryFields.find((possibleField) => {
            return possibleField.licenceFieldKey === licenceFieldKey;
        });
        cityssm.openHtmlModal('licenceCategoryField-edit', {
            onshow(modalElement) {
                ;
                modalElement.querySelector('#licenceCategoryFieldEdit--licenceFieldKey').value = licenceFieldKey;
                modalElement.querySelector('#licenceCategoryFieldEdit--licenceField').value = licenceCategoryField.licenceField;
                modalElement.querySelector('#licenceCategoryFieldEdit--licenceFieldDescription').value = licenceCategoryField.licenceFieldDescription;
                if (licenceCategoryField.isRequired) {
                    ;
                    modalElement.querySelector('#licenceCategoryFieldEdit--isRequired').checked = true;
                }
                const minimumLengthElement = modalElement.querySelector('#licenceCategoryFieldEdit--minimumLength');
                const maximumLengthElement = modalElement.querySelector('#licenceCategoryFieldEdit--maximumLength');
                minimumLengthElement.value =
                    licenceCategoryField.minimumLength.toString();
                minimumLengthElement.addEventListener('keyup', () => {
                    maximumLengthElement.min = minimumLengthElement.value;
                });
                maximumLengthElement.value =
                    licenceCategoryField.maximumLength.toString();
                maximumLengthElement.min = licenceCategoryField.minimumLength.toString();
                modalElement.querySelector('#licenceCategoryFieldEdit--pattern').value = licenceCategoryField.pattern;
                modalElement.querySelector('#licenceCategoryFieldEdit--printKey').value = licenceCategoryField.printKey;
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                editLicenceCategoryFieldModalCloseFunction = closeModalFunction;
                modalElement.querySelector('#licenceCategoryFieldEdit--licenceField').focus();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateLicenceCategoryFieldSubmitFunction);
                (_b = modalElement
                    .querySelector('.is-delete-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', confirmDeleteLicenceCategoryFieldFunction);
                bulmaJS.init(modalElement);
            },
            onhidden() {
                ;
                document.querySelector("#form--licenceCategoryFieldAdd button[type='submit']").focus();
            }
        });
    }
    function openEditLicenceCategoryFieldModalByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const licenceFieldKey = (_a = clickEvent.currentTarget.dataset.licenceFieldKey) !== null && _a !== void 0 ? _a : '';
        openEditLicenceCategoryFieldModal(licenceFieldKey);
    }
    const licenceCategoryField_dragDataPrefix = 'licenceFieldKey:';
    function licenceCategoryField_dragstart(dragEvent) {
        dragEvent.dataTransfer.dropEffect = 'move';
        const data = licenceCategoryField_dragDataPrefix +
            dragEvent.target.dataset.licenceFieldKey;
        dragEvent.dataTransfer.setData('text/plain', data);
    }
    function licenceCategoryField_dragover(dragEvent) {
        if (dragEvent.dataTransfer
            .getData('text/plain')
            .startsWith(licenceCategoryField_dragDataPrefix)) {
            const licenceFieldKey_drag = dragEvent.dataTransfer
                .getData('text/plain')
                .slice(licenceCategoryField_dragDataPrefix.length);
            const dropElement = dragEvent.currentTarget;
            const licenceFieldKey_drop = dropElement.dataset.licenceFieldKey;
            if (licenceFieldKey_drag !== licenceFieldKey_drop) {
                dragEvent.preventDefault();
                dragEvent.dataTransfer.dropEffect = 'move';
                dropElement.style.borderTop = '20px solid #ededed';
            }
        }
    }
    function licenceCategoryField_dragleave(dragEvent) {
        const dropElement = dragEvent.currentTarget;
        dropElement.style.borderTopWidth = '0px';
    }
    function licenceCategoryField_drop(dragEvent) {
        dragEvent.preventDefault();
        const licenceFieldKey_from = dragEvent.dataTransfer
            .getData('text/plain')
            .slice(licenceCategoryField_dragDataPrefix.length);
        const licenceFieldKey_to = dragEvent.currentTarget.dataset
            .licenceFieldKey;
        cityssm.postJSON(`${glm.urlPrefix}/admin/doMoveLicenceCategoryField`, {
            licenceFieldKey_from,
            licenceFieldKey_to
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            licenceCategoryFields = responseJSON.licenceCategoryFields;
            renderLicenceCategoryFields();
            doRefreshOnClose = true;
        });
    }
    function renderLicenceCategoryFields() {
        const fieldsContainerElement = editModalElement.querySelector('#container--licenceCategoryFields');
        if (licenceCategoryFields.length === 0) {
            fieldsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">There are no additional fields captured with this category.</p>
          </div>`;
        }
        else {
            const fieldsPanelElement = document.createElement('div');
            fieldsPanelElement.className = 'panel';
            for (const categoryField of licenceCategoryFields) {
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.licenceFieldKey =
                    categoryField.licenceFieldKey;
                panelBlockElement.style.transition = 'border-width 80ms';
                panelBlockElement.setAttribute('role', 'button');
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
            <div class="column">
              <h4>${cityssm.escapeHTML(categoryField.licenceField)}</h4>
              <p class="is-size-7">
                ${cityssm.escapeHTML(categoryField.licenceFieldDescription)}
              </p>
              </div>
              ${categoryField.isRequired
                    ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
                    : ''}</div>`;
                panelBlockElement.addEventListener('click', openEditLicenceCategoryFieldModalByClick);
                if (licenceCategoryFields.length > 1) {
                    panelBlockElement.draggable = true;
                    panelBlockElement.addEventListener('dragstart', licenceCategoryField_dragstart);
                    panelBlockElement.addEventListener('dragover', licenceCategoryField_dragover);
                    panelBlockElement.addEventListener('dragleave', licenceCategoryField_dragleave);
                    panelBlockElement.addEventListener('drop', licenceCategoryField_drop);
                }
                fieldsPanelElement.append(panelBlockElement);
            }
            fieldsContainerElement.innerHTML = '';
            fieldsContainerElement.append(fieldsPanelElement);
        }
    }
    let licenceCategoryApprovals;
    function openEditLicenceCategoryApprovalModal(licenceApprovalKey) {
        let editLicenceCategoryApprovalModalCloseFunction;
        function updateLicenceCategoryApprovalSubmitFunction(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${glm.urlPrefix}/admin/doUpdateLicenceCategoryApproval`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
                    editLicenceCategoryApprovalModalCloseFunction();
                    renderLicenceCategoryApprovals();
                    doRefreshOnClose = true;
                }
            });
        }
        function deleteLicenceCategoryApprovalFunction() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doDeleteLicenceCategoryApproval`, {
                licenceApprovalKey
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
                    renderLicenceCategoryApprovals();
                    editLicenceCategoryApprovalModalCloseFunction();
                    doRefreshOnClose = true;
                }
            });
        }
        function confirmDeleteLicenceCategoryApprovalFunction(clickEvent) {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: 'Delete Approval',
                message: 'Are you sure you want to delete this approval?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete It',
                    callbackFunction: deleteLicenceCategoryApprovalFunction
                }
            });
        }
        const licenceCategoryApproval = licenceCategoryApprovals.find((possibleField) => {
            return possibleField.licenceApprovalKey === licenceApprovalKey;
        });
        cityssm.openHtmlModal('licenceCategoryApproval-edit', {
            onshow(modalElement) {
                glm.populateAliases(modalElement);
                modalElement.querySelector('#licenceCategoryApprovalEdit--licenceApprovalKey').value = licenceApprovalKey;
                modalElement.querySelector('#licenceCategoryApprovalEdit--licenceApproval').value = licenceCategoryApproval.licenceApproval;
                modalElement.querySelector('#licenceCategoryApprovalEdit--licenceApprovalDescription').value = licenceCategoryApproval.licenceApprovalDescription;
                if (licenceCategoryApproval.isRequiredForNew) {
                    ;
                    modalElement.querySelector('#licenceCategoryApprovalEdit--isRequiredForNew').checked = true;
                }
                if (licenceCategoryApproval.isRequiredForRenewal) {
                    ;
                    modalElement.querySelector('#licenceCategoryApprovalEdit--isRequiredForRenewal').checked = true;
                }
                ;
                modalElement.querySelector('#licenceCategoryApprovalEdit--printKey').value = licenceCategoryApproval.printKey;
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                editLicenceCategoryApprovalModalCloseFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateLicenceCategoryApprovalSubmitFunction);
                (_b = modalElement
                    .querySelector('.is-delete-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', confirmDeleteLicenceCategoryApprovalFunction);
                bulmaJS.init(modalElement);
            }
        });
    }
    function openEditLicenceCategoryApprovalModalByClick(clickEvent) {
        clickEvent.preventDefault();
        const licenceApprovalKey = clickEvent.currentTarget.dataset
            .licenceApprovalKey;
        openEditLicenceCategoryApprovalModal(licenceApprovalKey);
    }
    const licenceCategoryApproval_dragDataPrefix = 'licenceApprovalKey:';
    function licenceCategoryApproval_dragstart(dragEvent) {
        dragEvent.dataTransfer.dropEffect = 'move';
        const data = licenceCategoryApproval_dragDataPrefix +
            dragEvent.target.dataset.licenceApprovalKey;
        dragEvent.dataTransfer.setData('text/plain', data);
    }
    function licenceCategoryApproval_dragover(dragEvent) {
        if (dragEvent.dataTransfer
            .getData('text/plain')
            .startsWith(licenceCategoryApproval_dragDataPrefix)) {
            const licenceApprovalKey_drag = dragEvent.dataTransfer
                .getData('text/plain')
                .slice(licenceCategoryApproval_dragDataPrefix.length);
            const dropElement = dragEvent.currentTarget;
            const licenceApprovalKey_drop = dropElement.dataset.licenceApprovalKey;
            if (licenceApprovalKey_drag !== licenceApprovalKey_drop) {
                dragEvent.preventDefault();
                dragEvent.dataTransfer.dropEffect = 'move';
                dropElement.style.borderTop = '20px solid #ededed';
            }
        }
    }
    function licenceCategoryApproval_dragleave(dragEvent) {
        const dropElement = dragEvent.currentTarget;
        dropElement.style.borderTopWidth = '0px';
    }
    function licenceCategoryApproval_drop(dragEvent) {
        dragEvent.preventDefault();
        const licenceApprovalKey_from = dragEvent.dataTransfer
            .getData('text/plain')
            .slice(licenceCategoryApproval_dragDataPrefix.length);
        const licenceApprovalKey_to = dragEvent.currentTarget
            .dataset.licenceApprovalKey;
        cityssm.postJSON(`${glm.urlPrefix}/admin/doMoveLicenceCategoryApproval`, {
            licenceApprovalKey_from,
            licenceApprovalKey_to
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
            renderLicenceCategoryApprovals();
            doRefreshOnClose = true;
        });
    }
    function renderLicenceCategoryApprovals() {
        const approvalsContainerElement = editModalElement.querySelector('#container--licenceCategoryApprovals');
        if (licenceCategoryApprovals.length === 0) {
            approvalsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no approvals associated with this category.</p>
        </div>`;
        }
        else {
            const approvalsPanelElement = document.createElement('div');
            approvalsPanelElement.className = 'panel';
            for (const categoryApproval of licenceCategoryApprovals) {
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.licenceApprovalKey =
                    categoryApproval.licenceApprovalKey;
                panelBlockElement.setAttribute('role', 'button');
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column">
            <h4>
              ${cityssm.escapeHTML(categoryApproval.licenceApproval)}
            </h4>
            <p class="is-size-7">
              ${cityssm.escapeHTML(categoryApproval.licenceApprovalDescription)}
            </p>
          </div>
          ${categoryApproval.isRequiredForNew ||
                    categoryApproval.isRequiredForRenewal
                    ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
                    : ''}</div>`;
                panelBlockElement.addEventListener('click', openEditLicenceCategoryApprovalModalByClick);
                if (licenceCategoryApprovals.length > 1) {
                    panelBlockElement.draggable = true;
                    panelBlockElement.addEventListener('dragstart', licenceCategoryApproval_dragstart);
                    panelBlockElement.addEventListener('dragover', licenceCategoryApproval_dragover);
                    panelBlockElement.addEventListener('dragleave', licenceCategoryApproval_dragleave);
                    panelBlockElement.addEventListener('drop', licenceCategoryApproval_drop);
                }
                approvalsPanelElement.append(panelBlockElement);
            }
            approvalsContainerElement.innerHTML = '';
            approvalsContainerElement.append(approvalsPanelElement);
        }
    }
    let licenceCategoryFees;
    const openEditLicenceCategoryFeeModal = (licenceFeeId) => {
        let editLicenceCategoryFeeModalCloseFunction;
        const updateLicenceCategoryFeeSubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(`${glm.urlPrefix}/admin/doUpdateLicenceCategoryFee`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    licenceCategoryFees = responseJSON.licenceCategoryFees;
                    renderLicenceCategoryFees();
                    editLicenceCategoryFeeModalCloseFunction();
                }
            });
        };
        function deleteLicenceCategoryFeeFunction() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doDeleteLicenceCategoryFee`, {
                licenceFeeId
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryFees = responseJSON.licenceCategoryFees;
                    renderLicenceCategoryFees();
                    doRefreshOnClose = true;
                    editLicenceCategoryFeeModalCloseFunction();
                }
            });
        }
        function confirmDeleteLicenceCategoryFeeFunction(clickEvent) {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: 'Delete Fee',
                message: 'Are you sure you want to delete this fee record?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete It',
                    callbackFunction: deleteLicenceCategoryFeeFunction
                }
            });
        }
        const licenceCategoryFee = licenceCategoryFees.find((possibleField) => {
            return possibleField.licenceFeeId === licenceFeeId;
        });
        cityssm.openHtmlModal('licenceCategoryFee-edit', {
            onshow(modalElement) {
                var _a, _b;
                glm.populateAliases(modalElement);
                modalElement.querySelector('#licenceCategoryFeeEdit--licenceFeeId').value = licenceCategoryFee.licenceFeeId.toString();
                modalElement.querySelector('#licenceCategoryFeeEdit--effectiveStartDateString').value = licenceCategoryFee.effectiveStartDateString;
                modalElement.querySelector('#licenceCategoryFeeEdit--effectiveEndDateString').value = licenceCategoryFee.effectiveEndDateString;
                modalElement.querySelector('#licenceCategoryFeeEdit--licenceFee').value = licenceCategoryFee.licenceFee.toFixed(2);
                if (licenceCategoryFee.renewalFee) {
                    ;
                    modalElement.querySelector('#licenceCategoryFeeEdit--renewalFee').value = licenceCategoryFee.renewalFee.toFixed(2);
                }
                if (licenceCategoryFee.replacementFee) {
                    ;
                    modalElement.querySelector('#licenceCategoryFeeEdit--replacementFee').value = licenceCategoryFee.replacementFee.toFixed(2);
                }
                if (!includeReplacementFee) {
                    (_b = (_a = modalElement
                        .querySelector('#licenceCategoryFeeEdit--replacementFee')) === null || _a === void 0 ? void 0 : _a.closest('.column')) === null || _b === void 0 ? void 0 : _b.classList.add('is-hidden');
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b;
                editLicenceCategoryFeeModalCloseFunction = closeModalFunction;
                modalElement.querySelector('#licenceCategoryFeeEdit--effectiveStartDateString').focus();
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateLicenceCategoryFeeSubmitFunction);
                (_b = modalElement
                    .querySelector('.is-delete-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', confirmDeleteLicenceCategoryFeeFunction);
                bulmaJS.init(modalElement);
            }
        });
    };
    function openEditLicenceCategoryFeeModalByClick(clickEvent) {
        clickEvent.preventDefault();
        const licenceFeeId = clickEvent.currentTarget.dataset
            .licenceFeeId;
        openEditLicenceCategoryFeeModal(Number.parseInt(licenceFeeId, 10));
    }
    function renderLicenceCategoryFees() {
        const feesContainerElement = editModalElement.querySelector('#container--licenceCategoryFees');
        if (licenceCategoryFees.length === 0) {
            feesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no fees associated with this category.</p>
        </div>`;
        }
        else {
            const feesPanelElement = document.createElement('div');
            feesPanelElement.className = 'panel';
            const currentDateString = cityssm.dateToString(new Date());
            for (const categoryFee of licenceCategoryFees) {
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.licenceFeeId =
                    categoryFee.licenceFeeId.toString();
                let isEffective = false;
                let effectiveHTML;
                if (!categoryFee.effectiveStartDate) {
                    effectiveHTML =
                        '<span class="has-text-danger">No Effective Date</span>';
                }
                else {
                    effectiveHTML =
                        'From ' +
                            categoryFee.effectiveStartDateString +
                            (categoryFee.effectiveEndDate
                                ? ' to ' + categoryFee.effectiveEndDateString
                                : '');
                    if (categoryFee.effectiveStartDateString <= currentDateString &&
                        (!categoryFee.effectiveEndDate ||
                            categoryFee.effectiveEndDateString >= currentDateString)) {
                        isEffective = true;
                    }
                }
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column">
          <h4>${effectiveHTML}</h4>
          <p class="is-size-7">
            $${categoryFee.licenceFee.toFixed(2)} fee
          </p>
          </div>
          ${isEffective
                    ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
                    : ''}
          </div>`;
                panelBlockElement.addEventListener('click', openEditLicenceCategoryFeeModalByClick);
                feesPanelElement.append(panelBlockElement);
            }
            feesContainerElement.innerHTML = '';
            feesContainerElement.append(feesPanelElement);
        }
    }
    let licenceCategoryAdditionalFees;
    function openEditLicenceCategoryAdditionalFeeModal(licenceAdditionalFeeKey) {
        let editLicenceCategoryAdditionalFeeModalElement;
        let editLicenceCategoryAdditionalFeeModalCloseFunction;
        function updateLicenceCategoryAdditionalFeeSubmitFunction(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${glm.urlPrefix}/admin/doUpdateLicenceCategoryAdditionalFee`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryAdditionalFees =
                        responseJSON.licenceCategoryAdditionalFees;
                    editLicenceCategoryAdditionalFeeModalCloseFunction();
                    renderLicenceCategoryAdditionalFees();
                    doRefreshOnClose = true;
                }
            });
        }
        function deleteLicenceCategoryAdditionalFeeFunction() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doDeleteLicenceCategoryAdditionalFee`, {
                licenceAdditionalFeeKey
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategoryAdditionalFees =
                        responseJSON.licenceCategoryAdditionalFees;
                    renderLicenceCategoryAdditionalFees();
                    editLicenceCategoryAdditionalFeeModalCloseFunction();
                    doRefreshOnClose = true;
                }
            });
        }
        function confirmDeleteLicenceCategoryAdditionalFeeFunction(clickEvent) {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: 'Delete Additional Fee',
                message: 'Are you sure you want to delete this additional fee?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete It',
                    callbackFunction: deleteLicenceCategoryAdditionalFeeFunction
                }
            });
        }
        function updateAdditionalFeeTypeFields() {
            const additionalFeeType = editLicenceCategoryAdditionalFeeModalElement.querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeType').value;
            const additionalFeeFlatIconElement = editLicenceCategoryAdditionalFeeModalElement.querySelector(".control[data-additional-fee-type='flat']");
            const additionalFeePercentIconElement = editLicenceCategoryAdditionalFeeModalElement.querySelector(".control[data-additional-fee-type='percent']");
            const additionalFeeFunctionElement = editLicenceCategoryAdditionalFeeModalElement.querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeFunction');
            switch (additionalFeeType) {
                case 'percent': {
                    additionalFeePercentIconElement.classList.remove('is-hidden');
                    additionalFeeFlatIconElement.classList.add('is-hidden');
                    break;
                }
                default: {
                    additionalFeeFlatIconElement.classList.remove('is-hidden');
                    additionalFeePercentIconElement.classList.add('is-hidden');
                }
            }
            switch (additionalFeeType) {
                case 'function': {
                    additionalFeeFunctionElement.disabled = false;
                    break;
                }
                default: {
                    additionalFeeFunctionElement.value = '';
                    additionalFeeFunctionElement.disabled = true;
                    break;
                }
            }
        }
        const licenceCategoryAdditionalFee = licenceCategoryAdditionalFees.find((possibleAdditionalFee) => {
            return (possibleAdditionalFee.licenceAdditionalFeeKey ===
                licenceAdditionalFeeKey);
        });
        cityssm.openHtmlModal('licenceCategoryAdditionalFee-edit', {
            onshow(modalElement) {
                glm.populateAliases(modalElement);
                editLicenceCategoryAdditionalFeeModalElement = modalElement;
                modalElement.querySelector('#licenceCategoryAdditionalFeeEdit--licenceAdditionalFeeKey').value = licenceAdditionalFeeKey;
                modalElement.querySelector('#licenceCategoryAdditionalFeeEdit--additionalFee').value = licenceCategoryAdditionalFee.additionalFee;
                modalElement.querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeType').value = licenceCategoryAdditionalFee.additionalFeeType;
                modalElement.querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeNumber').value = licenceCategoryAdditionalFee.additionalFeeNumber.toFixed(2);
                modalElement.querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeFunction').value = licenceCategoryAdditionalFee.additionalFeeFunction;
                updateAdditionalFeeTypeFields();
                if (licenceCategoryAdditionalFee.isRequired) {
                    ;
                    modalElement.querySelector('#licenceCategoryAdditionalFeeEdit--isRequired').checked = true;
                }
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b, _c;
                editLicenceCategoryAdditionalFeeModalCloseFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeType')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', updateAdditionalFeeTypeFields);
                (_b = modalElement
                    .querySelector('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', updateLicenceCategoryAdditionalFeeSubmitFunction);
                (_c = modalElement
                    .querySelector('.is-delete-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', confirmDeleteLicenceCategoryAdditionalFeeFunction);
                bulmaJS.init(modalElement);
            }
        });
    }
    function openEditLicenceCategoryAdditionalFeeModalByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const licenceAdditionalFeeKey = (_a = clickEvent.currentTarget.dataset
            .licenceAdditionalFeeKey) !== null && _a !== void 0 ? _a : '';
        openEditLicenceCategoryAdditionalFeeModal(licenceAdditionalFeeKey);
    }
    const licenceCategoryAdditionalFee_dragDataPrefix = 'licenceAdditionalFeeKey:';
    function licenceCategoryAdditionalFee_dragstart(dragEvent) {
        dragEvent.dataTransfer.dropEffect = 'move';
        const data = licenceCategoryAdditionalFee_dragDataPrefix +
            dragEvent.target.dataset.licenceAdditionalFeeKey;
        dragEvent.dataTransfer.setData('text/plain', data);
    }
    function licenceCategoryAdditionalFee_dragover(dragEvent) {
        if (dragEvent.dataTransfer
            .getData('text/plain')
            .startsWith(licenceCategoryAdditionalFee_dragDataPrefix)) {
            const licenceAdditionalFeeKey_drag = dragEvent.dataTransfer
                .getData('text/plain')
                .slice(licenceCategoryAdditionalFee_dragDataPrefix.length);
            const dropElement = dragEvent.currentTarget;
            const licenceAdditionalFeeKey_drop = dropElement.dataset.licenceAdditionalFeeKey;
            if (licenceAdditionalFeeKey_drag !== licenceAdditionalFeeKey_drop) {
                dragEvent.preventDefault();
                dragEvent.dataTransfer.dropEffect = 'move';
                dropElement.style.borderTop = '20px solid #ededed';
            }
        }
    }
    function licenceCategoryAdditionalFee_dragleave(dragEvent) {
        const dropElement = dragEvent.currentTarget;
        dropElement.style.borderTopWidth = '0px';
    }
    function licenceCategoryAdditionalFee_drop(dragEvent) {
        dragEvent.preventDefault();
        const licenceAdditionalFeeKey_from = dragEvent.dataTransfer
            .getData('text/plain')
            .slice(licenceCategoryAdditionalFee_dragDataPrefix.length);
        const licenceAdditionalFeeKey_to = dragEvent.currentTarget
            .dataset.licenceAdditionalFeeKey;
        cityssm.postJSON(`${glm.urlPrefix}/admin/doMoveLicenceCategoryAdditionalFee`, {
            licenceAdditionalFeeKey_from,
            licenceAdditionalFeeKey_to
        }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            licenceCategoryAdditionalFees =
                responseJSON.licenceCategoryAdditionalFees;
            renderLicenceCategoryAdditionalFees();
            doRefreshOnClose = true;
        });
    }
    function renderLicenceCategoryAdditionalFees() {
        const additionalFeesContainerElement = editModalElement.querySelector('#container--licenceCategoryAdditionalFees');
        if (licenceCategoryAdditionalFees.length === 0) {
            additionalFeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no additional fees associated with this category.</p>
        </div>`;
        }
        else {
            const additionalFeesPanelElement = document.createElement('div');
            additionalFeesPanelElement.className = 'panel';
            for (const categoryAdditionalFee of licenceCategoryAdditionalFees) {
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.licenceAdditionalFeeKey =
                    categoryAdditionalFee.licenceAdditionalFeeKey;
                panelBlockElement.setAttribute('role', 'button');
                let additionalFeeDescriptionHTML = '';
                switch (categoryAdditionalFee.additionalFeeType) {
                    case 'flat': {
                        additionalFeeDescriptionHTML =
                            '$' + categoryAdditionalFee.additionalFeeNumber.toFixed(2);
                        break;
                    }
                    case 'percent': {
                        additionalFeeDescriptionHTML =
                            categoryAdditionalFee.additionalFeeNumber.toPrecision(2) + '%';
                        break;
                    }
                    case 'function': {
                        additionalFeeDescriptionHTML = `Function: ${categoryAdditionalFee.additionalFeeFunction}`;
                        break;
                    }
                }
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column">
            <h4>
            ${cityssm.escapeHTML(categoryAdditionalFee.additionalFee)}
            </h4>
            <p class="is-size-7">${additionalFeeDescriptionHTML}</p>
          </div>
          ${categoryAdditionalFee.isRequired
                    ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
                    : ''}
          </div>`;
                panelBlockElement.addEventListener('click', openEditLicenceCategoryAdditionalFeeModalByClick);
                if (licenceCategoryAdditionalFees.length > 1) {
                    panelBlockElement.draggable = true;
                    panelBlockElement.addEventListener('dragstart', licenceCategoryAdditionalFee_dragstart);
                    panelBlockElement.addEventListener('dragover', licenceCategoryAdditionalFee_dragover);
                    panelBlockElement.addEventListener('dragleave', licenceCategoryAdditionalFee_dragleave);
                    panelBlockElement.addEventListener('drop', licenceCategoryAdditionalFee_drop);
                }
                additionalFeesPanelElement.append(panelBlockElement);
            }
            additionalFeesContainerElement.innerHTML = '';
            additionalFeesContainerElement.append(additionalFeesPanelElement);
        }
    }
    function openEditLicenceCategoryModal(licenceCategoryKey) {
        let categoryCloseModalFunction;
        function deleteLicenceCategoryFunction() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doDeleteLicenceCategory`, {
                licenceCategoryKey
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    doRefreshOnClose = false;
                    licenceCategories = responseJSON.licenceCategories;
                    categoryCloseModalFunction();
                    renderLicenceCategories();
                }
            });
        }
        function deleteLicenceCategoryConfirmFunction(clickEvent) {
            clickEvent.preventDefault();
            bulmaJS.confirm({
                title: 'Delete Category',
                message: 'Are you sure you want to delete this category?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete It',
                    callbackFunction: deleteLicenceCategoryFunction
                }
            });
        }
        function updateLicenceCategorySubmitFunction(formEvent) {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(`${glm.urlPrefix}/admin/doUpdateLicenceCategory`, formElement, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Category updated successfully.',
                        contextualColorName: 'success'
                    });
                    doRefreshOnClose = true;
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Updating Category',
                        message: (_a = responseJSON.errorMessage) !== null && _a !== void 0 ? _a : '',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        function addLicenceCategoryFieldSubmitFunction(formEvent) {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(`${glm.urlPrefix}/admin/doAddLicenceCategoryField`, formElement, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    formElement.reset();
                    licenceCategoryFields = responseJSON.licenceCategoryFields;
                    renderLicenceCategoryFields();
                    openEditLicenceCategoryFieldModal(responseJSON.licenceFieldKey);
                }
            });
        }
        function addLicenceCategoryApprovalSubmitFunction(formEvent) {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(`${glm.urlPrefix}/admin/doAddLicenceCategoryApproval`, formElement, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    formElement.reset();
                    licenceCategoryApprovals = responseJSON.licenceCategoryApprovals;
                    renderLicenceCategoryApprovals();
                    openEditLicenceCategoryApprovalModal(responseJSON.licenceApprovalKey);
                }
            });
        }
        function addLicenceCategoryFeeFunction(clickEvent) {
            clickEvent.preventDefault();
            cityssm.postJSON(`${glm.urlPrefix}/admin/doAddLicenceCategoryFee`, {
                licenceCategoryKey
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    licenceCategoryFees = responseJSON.licenceCategoryFees;
                    renderLicenceCategoryFees();
                    openEditLicenceCategoryFeeModal(responseJSON.licenceFeeId);
                }
            });
        }
        function addLicenceCategoryAdditionalFeeFunction(formEvent) {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(`${glm.urlPrefix}/admin/doAddLicenceCategoryAdditionalFee`, formElement, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    formElement.reset();
                    licenceCategoryAdditionalFees =
                        responseJSON.licenceCategoryAdditionalFees;
                    renderLicenceCategoryAdditionalFees();
                    openEditLicenceCategoryAdditionalFeeModal(responseJSON.licenceAdditionalFeeKey);
                }
            });
        }
        function renderEditLicenceCategory(responseJSON) {
            var _a, _b, _c, _d;
            if (!responseJSON.success) {
                bulmaJS.alert({
                    message: 'Error Loading Category.',
                    contextualColorName: 'danger'
                });
                doRefreshOnClose = true;
                return;
            }
            const licenceCategory = responseJSON.licenceCategory;
            editModalElement.querySelector('#licenceCategoryEdit--licenceCategory').value = licenceCategory.licenceCategory;
            editModalElement.querySelector('#licenceCategoryEdit--bylawNumber').value = licenceCategory.bylawNumber;
            const printEJSElement = editModalElement.querySelector('#licenceCategoryEdit--printEJS');
            if (!printEJSElement.querySelector("option[value='" + licenceCategory.printEJS + "']")) {
                const optionElement = document.createElement('option');
                optionElement.value = licenceCategory.printEJS;
                optionElement.textContent = licenceCategory.printEJS + ' (Missing)';
                printEJSElement.append(optionElement);
            }
            printEJSElement.value = licenceCategory.printEJS;
            const licenceLengthFunctionElement = editModalElement.querySelector('#licenceCategoryEdit--licenceLengthFunction');
            if (!licenceLengthFunctionElement.querySelector("option[value='" + licenceCategory.licenceLengthFunction + "']")) {
                const optionElement = document.createElement('option');
                optionElement.value = licenceCategory.licenceLengthFunction;
                optionElement.textContent =
                    licenceCategory.licenceLengthFunction + ' (Missing)';
                printEJSElement.append(optionElement);
            }
            licenceLengthFunctionElement.value = licenceCategory.licenceLengthFunction;
            editModalElement.querySelector('#licenceCategoryEdit--licenceLengthYears').value = licenceCategory.licenceLengthYears.toString();
            editModalElement.querySelector('#licenceCategoryEdit--licenceLengthMonths').value = licenceCategory.licenceLengthMonths.toString();
            editModalElement.querySelector('#licenceCategoryEdit--licenceLengthDays').value = licenceCategory.licenceLengthDays.toString();
            licenceCategoryFields = (_a = licenceCategory.licenceCategoryFields) !== null && _a !== void 0 ? _a : [];
            renderLicenceCategoryFields();
            licenceCategoryApprovals = (_b = licenceCategory.licenceCategoryApprovals) !== null && _b !== void 0 ? _b : [];
            renderLicenceCategoryApprovals();
            licenceCategoryFees = (_c = licenceCategory.licenceCategoryFees) !== null && _c !== void 0 ? _c : [];
            renderLicenceCategoryFees();
            licenceCategoryAdditionalFees =
                (_d = licenceCategory.licenceCategoryAdditionalFees) !== null && _d !== void 0 ? _d : [];
            renderLicenceCategoryAdditionalFees();
        }
        doRefreshOnClose = false;
        cityssm.openHtmlModal('licenceCategory-edit', {
            onshow(modalElement) {
                editModalElement = modalElement;
                glm.populateAliases(modalElement);
                modalElement.querySelector('#licenceCategoryEdit--licenceCategoryKey').value = licenceCategoryKey;
                modalElement.querySelector('#licenceCategoryFieldAdd--licenceCategoryKey').value = licenceCategoryKey;
                modalElement.querySelector('#licenceCategoryApprovalAdd--licenceCategoryKey').value = licenceCategoryKey;
                modalElement.querySelector('#licenceCategoryAdditionalFeeAdd--licenceCategoryKey').value = licenceCategoryKey;
                const printEJSElement = modalElement.querySelector('#licenceCategoryEdit--printEJS');
                for (const printEJS of exports.printEJSList) {
                    const optionElement = document.createElement('option');
                    optionElement.value = printEJS;
                    optionElement.textContent = printEJS;
                    printEJSElement.append(optionElement);
                }
                const licenceLengthFunctionElement = modalElement.querySelector('#licenceCategoryEdit--licenceLengthFunction');
                for (const licenceLengthFunctionName of exports.licenceLengthFunctionNames) {
                    const optionElement = document.createElement('option');
                    optionElement.value = licenceLengthFunctionName;
                    optionElement.textContent = licenceLengthFunctionName;
                    licenceLengthFunctionElement.append(optionElement);
                }
                cityssm.postJSON(`${glm.urlPrefix}/admin/doGetLicenceCategory`, {
                    licenceCategoryKey
                }, renderEditLicenceCategory);
            },
            onshown(modalElement, closeModalFunction) {
                var _a, _b, _c, _d, _e, _f;
                categoryCloseModalFunction = closeModalFunction;
                modalElement.querySelector('#licenceCategoryEdit--licenceCategory').focus();
                (_a = modalElement
                    .querySelector('#form--licenceCategoryEdit')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateLicenceCategorySubmitFunction);
                (_b = modalElement
                    .querySelector('#form--licenceCategoryFieldAdd')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', addLicenceCategoryFieldSubmitFunction);
                (_c = modalElement
                    .querySelector('#form--licenceCategoryApprovalAdd')) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', addLicenceCategoryApprovalSubmitFunction);
                (_d = modalElement
                    .querySelector('.is-add-fee-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', addLicenceCategoryFeeFunction);
                (_e = modalElement
                    .querySelector('#form--licenceCategoryAdditionalFeeAdd')) === null || _e === void 0 ? void 0 : _e.addEventListener('submit', addLicenceCategoryAdditionalFeeFunction);
                (_f = modalElement
                    .querySelector('.is-delete-button')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', deleteLicenceCategoryConfirmFunction);
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init();
            },
            onhidden() {
                if (doRefreshOnClose) {
                    getLicenceCategories();
                }
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openEditLicenceCategoryModalByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const licenceCategoryKey = (_a = clickEvent.currentTarget.dataset.licenceCategoryKey) !== null && _a !== void 0 ? _a : '';
        openEditLicenceCategoryModal(licenceCategoryKey);
    }
    function openAddLicenceCategoryModal() {
        let addLicenceCategoryCloseModalFunction;
        function addLicenceCategorySubmitFunction(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${glm.urlPrefix}/admin/doAddLicenceCategory`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    licenceCategories = responseJSON.licenceCategories;
                    renderLicenceCategories();
                    addLicenceCategoryCloseModalFunction();
                    openEditLicenceCategoryModal(responseJSON.licenceCategoryKey);
                }
            });
        }
        cityssm.openHtmlModal('licenceCategory-add', {
            onshow(modalElement) {
                glm.populateAliases(modalElement);
            },
            onshown(modalElement, closeModalFunction) {
                var _a;
                bulmaJS.toggleHtmlClipped();
                addLicenceCategoryCloseModalFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', addLicenceCategorySubmitFunction);
                modalElement.querySelector('#licenceCategoryAdd--licenceCategory').focus();
            },
            onhidden() {
                ;
                document.querySelector('#button--addLicenceCategory').focus();
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    renderLicenceCategories();
    (_a = document
        .querySelector('#button--addLicenceCategory')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', openAddLicenceCategoryModal);
})();

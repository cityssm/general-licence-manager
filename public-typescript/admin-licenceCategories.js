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
    const openEditLicenceCategoryModal = (licenceCategoryKey) => {
        cityssm.openHtmlModal("licenceCategory-edit", {
            onshow: (modalElement) => {
                modalElement.querySelector("#licenceCategoryEdit--licenceCategoryKey").value = licenceCategoryKey;
                const printEJSElement = document.querySelector("#licenceCategoryEdit--printEJS");
                for (const printEJS of exports.printEJSList) {
                    const optionElement = document.createElement("option");
                    optionElement.value = printEJS;
                    optionElement.textContent = printEJS;
                    printEJSElement.append(optionElement);
                }
                cityssm.postJSON(urlPrefix + "/admin/doGetLicenceCategory", {
                    licenceCategoryKey
                }, (responseJSON) => {
                    if (!responseJSON.success) {
                        bulmaJS.alert({
                            message: "Error loading Licence Category.",
                            contextualColorName: "danger"
                        });
                        return;
                    }
                    const licenceCategory = responseJSON.licenceCategory;
                    modalElement.querySelector("#licenceCategoryEdit--licenceCategory").value = licenceCategory.licenceCategory;
                    modalElement.querySelector("#licenceCategoryEdit--bylawNumber").value = licenceCategory.bylawNumber;
                });
            },
            onshown: (modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
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

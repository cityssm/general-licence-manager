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
    renderLicenceCategories();
    const openAddLicenceCategoryModal = () => {
        let addLicenceCategoryCloseModalFunction;
        const addLicenceCategorySubmitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doAddLicenceCategory", formEvent.currentTarget, (responseJSON) => {
            });
        };
        cityssm.openHtmlModal("licenceCategory-add", {
            onshown: (modalElement, closeModalFunction) => {
                addLicenceCategoryCloseModalFunction = closeModalFunction;
                modalElement.querySelector("form").addEventListener("submit", addLicenceCategorySubmitFunction);
            }
        });
    };
    document.querySelector("#button--addLicenceCategory").addEventListener("click", openAddLicenceCategoryModal);
})();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector("main").dataset.urlPrefix;
    const formElement = document.querySelector("#form--filters");
    const limitElement = document.querySelector("#filter--limit");
    const offsetElement = document.querySelector("#filter--offset");
    const searchResultsElement = document.querySelector("#container--searchResults");
    const doLicenceSearchFunction = () => {
        const currentLimit = Number.parseInt(limitElement.value, 10);
        const currentOffset = Number.parseInt(offsetElement.value, 10);
        searchResultsElement.innerHTML = "<p class=\"has-text-centered has-text-grey-lighter\">" +
            "<i class=\"fas fa-3x fa-circle-notch fa-spin\" aria-hidden=\"true\"></i><br />" +
            "<em>Loading licences...</em>" +
            "</p>";
        cityssm.postJSON(urlPrefix + "/licences/doSearch", formElement, (licenceResults) => {
            const licenceList = licenceResults.licences;
            if (licenceList.length === 0) {
                searchResultsElement.innerHTML = "<div class=\"message is-info\">" +
                    "<div class=\"message-body\">" +
                    "<strong>Your search returned no results.</strong><br />" +
                    "Please try expanding your search criteria." +
                    "</div>" +
                    "</div>";
                return;
            }
            searchResultsElement.innerHTML = "<table class=\"table is-fullwidth is-striped is-hoverable has-sticky-header\">" +
                "<thead><tr>" +
                "<th>Licence Number</th>" +
                "<th>Category</th>" +
                "<th>Licensee</th>" +
                "<th>Effective Start</th>" +
                "<th>Effective End</th>" +
                "<th class=\"has-text-centered\">Status</th>" +
                "<th></th>" +
                "</tr></thead>" +
                "</table>";
            const tbodyElement = document.createElement("tbody");
            for (const licenceObject of licenceList) {
                const trElement = document.createElement("tr");
                let licenseeHTML = cityssm.escapeHTML(licenceObject.licenseeName);
                if (licenceObject.licenseeBusinessName.trim() !== "") {
                    licenseeHTML = cityssm.escapeHTML(licenceObject.licenseeBusinessName) + "<br />" +
                        "<span class=\"is-size-7\">" + licenseeHTML + "</span>";
                }
                trElement.innerHTML =
                    ("<td>" +
                        "<a href=\"" + urlPrefix + "/licences/" + licenceObject.licenceId.toString() + "\">" +
                        cityssm.escapeHTML(licenceObject.licenceNumber) +
                        "</a>" +
                        "</td>") +
                        "<td>" + cityssm.escapeHTML(licenceObject.licenceCategory) + "</td>" +
                        "<td>" + licenseeHTML + "</td>" +
                        "<td>" + licenceObject.startDateString + "</td>" +
                        "<td>" + licenceObject.endDateString + "</td>" +
                        ("<td class=\"has-text-centered\">" +
                            (licenceObject.issueDate
                                ? "<span class=\"tag is-success\">Issued</span>"
                                : "<span class=\"tag is-warning\">Pending</span>") +
                            "</td>") +
                        ("<td class=\"has-text-right\">" +
                            (licenceObject.issueDate
                                ? "<a class=\"button is-small\" href=\"" + urlPrefix + "/licences/" + licenceObject.licenceId + "/print\" target=\"_blank\">" +
                                    "<i class=\"fas fa-print\" aria-label=\"Print\"></i>" +
                                    "</a>"
                                : "") +
                            "</td>");
                tbodyElement.append(trElement);
            }
            searchResultsElement.querySelector("table").append(tbodyElement);
            searchResultsElement.insertAdjacentHTML("beforeend", "<div class=\"level is-block-print\">" +
                "<div class=\"level-left has-text-weight-bold\">" +
                "Displaying licences " +
                (currentOffset + 1).toString() +
                " to " +
                Math.min(currentLimit + currentOffset, licenceResults.count).toString() +
                " of " +
                licenceResults.count.toString() +
                "</div>" +
                "</div>");
            if (currentLimit < licenceResults.count) {
                const paginationElement = document.createElement("nav");
                paginationElement.className = "level-right is-hidden-print";
                paginationElement.setAttribute("role", "pagination");
                paginationElement.setAttribute("aria-label", "pagination");
                if (currentOffset > 0) {
                    const previousElement = document.createElement("a");
                    previousElement.className = "button";
                    previousElement.textContent = "Previous";
                    previousElement.addEventListener("click", (clickEvent) => {
                        clickEvent.preventDefault();
                        offsetElement.value = Math.max(0, currentOffset - currentLimit).toString();
                        doLicenceSearchFunction();
                    });
                    paginationElement.append(previousElement);
                }
                if (currentLimit + currentOffset < licenceResults.count) {
                    const nextElement = document.createElement("a");
                    nextElement.className = "button ml-3";
                    nextElement.innerHTML =
                        "<span>Next Licences</span>" +
                            "<span class=\"icon\"><i class=\"fas fa-chevron-right\" aria-hidden=\"true\"></i></span>";
                    nextElement.addEventListener("click", (clickEvent) => {
                        clickEvent.preventDefault();
                        offsetElement.value = (currentOffset + currentLimit).toString();
                        doLicenceSearchFunction();
                    });
                    paginationElement.append(nextElement);
                }
                searchResultsElement.querySelector(".level").append(paginationElement);
            }
        });
    };
    const resetOffsetAndDoLicenceSearchFunction = () => {
        offsetElement.value = "0";
        doLicenceSearchFunction();
    };
    formElement.addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
    });
    const inputElements = formElement.querySelectorAll(".input, .select select");
    for (const inputElement of inputElements) {
        inputElement.addEventListener("change", resetOffsetAndDoLicenceSearchFunction);
    }
    resetOffsetAndDoLicenceSearchFunction();
})();

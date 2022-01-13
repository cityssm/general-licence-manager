/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type * as recordTypes from "../types/recordTypes";

declare const cityssm: cityssmGlobal;

(() => {
  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  const licenceId = (document.querySelector("#licenceEdit--licenceId") as HTMLInputElement).value;

  const isCreate = (licenceId === "");

  /*
   * End Date
   */

  const licenceCategoryKeyElement = document.querySelector("#licenceEdit--licenceCategoryKey") as HTMLSelectElement;

  const isRenewalElement = document.querySelector("#licenceEdit--isRenewal") as HTMLInputElement;

  const startDateStringElement = document.querySelector("#licenceEdit--startDateString") as HTMLInputElement;
  const endDateStringElement = document.querySelector("#licenceEdit--endDateString") as HTMLInputElement;

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

  /*
   * Category Change
   */

  let licenceCategory: recordTypes.LicenceCategory;

  const renderLicenceCategoryFields = () => {

    const licenceFieldsContainerElement = document.querySelector("#container--licenceFields") as HTMLElement;

    if (!licenceCategory || licenceCategory.licenceCategoryFields.length === 0) {
      licenceFieldsContainerElement.innerHTML = "";
      licenceFieldsContainerElement.classList.add("is-hidden");
      return;
    }

    licenceFieldsContainerElement.classList.remove("is-hidden");
    licenceFieldsContainerElement.innerHTML = "<h2 class=\"title is-3\">Fields</h2>";

    const licenceFieldKeys: string[] = [];

    for (const licenceCategoryField of licenceCategory.licenceCategoryFields) {

      const fieldElement = document.createElement("div");
      fieldElement.className = "field";

      fieldElement.innerHTML = "<label class=\"label\"></label>" +
        "<div class=\"control\">" +
        "<input class=\"input\" type=\"text\" />" +
        "</div>";

      const inputId = "licenceFieldEdit--" + licenceCategoryField.licenceFieldKey;

      const labelElement = fieldElement.querySelector("label");
      labelElement.setAttribute("for", inputId);
      labelElement.textContent = licenceCategoryField.licenceField;

      const inputElement = fieldElement.querySelector("input");

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
        fieldElement.append(helpElement);
      }

      licenceFieldsContainerElement.append(fieldElement);

      licenceFieldKeys.push(licenceCategoryField.licenceFieldKey);
    }

    const licenceFieldKeysElement = document.createElement("input");
    licenceFieldKeysElement.type = "hidden";
    licenceFieldKeysElement.name = "licenceFieldKeys";
    licenceFieldKeysElement.value = licenceFieldKeys.join(",");

    licenceFieldsContainerElement.append(licenceFieldKeysElement);
  };

  const renderLicenceCategoryApprovals = () => {

    const licenceApprovalsContainerElement = document.querySelector("#container--licenceApprovals") as HTMLElement;

    if (!licenceCategory || licenceCategory.licenceCategoryApprovals.length === 0) {
      licenceApprovalsContainerElement.innerHTML = "";
      licenceApprovalsContainerElement.classList.add("is-hidden");
      return;
    }

    licenceApprovalsContainerElement.classList.remove("is-hidden");
    licenceApprovalsContainerElement.innerHTML = "<h2 class=\"title is-3\">Approvals</h2>";

    const licenceApprovalKeys: string[] = [];

    for (const licenceCategoryApproval of licenceCategory.licenceCategoryApprovals) {

      const faCheckElement = document.createElement("div");
      faCheckElement.className = "facheck mt-2";

      faCheckElement.innerHTML =
        "<input type=\"checkbox\" />" +
        "<label></label>";

      const inputId = "licenceApprovalEdit--" + licenceCategoryApproval.licenceApprovalKey;

      const labelElement = faCheckElement.querySelector("label");
      labelElement.setAttribute("for", inputId);
      labelElement.textContent = licenceCategoryApproval.licenceApproval;

      const inputElement = faCheckElement.querySelector("input");

      inputElement.id = inputId;
      inputElement.name = "approval--" + licenceCategoryApproval.licenceApprovalKey;
      inputElement.dataset.isRequiredForNew = licenceCategoryApproval.isRequiredForNew ? "true" : "false";
      inputElement.dataset.isRequiredForRenewal = licenceCategoryApproval.isRequiredForRenewal ? "true" : "false";

      if ((isRenewalElement.checked && licenceCategoryApproval.isRequiredForRenewal) ||
        (!isRenewalElement.checked && licenceCategoryApproval.isRequiredForNew)) {
        inputElement.required = true;
      }

      licenceApprovalsContainerElement.append(faCheckElement);

      if (licenceCategoryApproval.licenceApprovalDescription !== "") {
        const helpElement = document.createElement("p");
        helpElement.className = "help";
        helpElement.textContent = licenceCategoryApproval.licenceApprovalDescription;
        licenceApprovalsContainerElement.append(helpElement);
      }

      licenceApprovalKeys.push(licenceCategoryApproval.licenceApprovalKey);
    }

    const licenceApprovalKeysElement = document.createElement("input");
    licenceApprovalKeysElement.type = "hidden";
    licenceApprovalKeysElement.name = "licenceApprovalKeys";
    licenceApprovalKeysElement.value = licenceApprovalKeys.join(",");

    licenceApprovalsContainerElement.append(licenceApprovalKeysElement);
  };

  const refreshLicenceCategoryFees = () => {

    const licenceFeeElement = document.querySelector("#licenceEdit--licenceFee") as HTMLInputElement;
    const replacementFeeElement = document.querySelector("#licenceEdit--replacementFee") as HTMLInputElement;

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
    },
      (responseJSON: { licenceCategory: recordTypes.LicenceCategory }) => {
        licenceCategory = responseJSON.licenceCategory;
        renderLicenceCategory();
      });
  };

  if (isCreate) {
    licenceCategoryKeyElement.addEventListener("change", refreshLicenceCategory);

  } else {
    licenceCategory = exports.licenceCategory;
  }

  /*
   * Is Renewal Change
   */

  isRenewalElement.addEventListener("change", () => {

    // Approvals

    const approvalInputElements = document.querySelector("#container--licenceApprovals").querySelectorAll("input");

    for (const approvalInputElement of approvalInputElements) {

      approvalInputElement.required =
        (isRenewalElement.checked && approvalInputElement.dataset.isRequiredForRenewal === "true") ||
          (!isRenewalElement.checked && approvalInputElement.dataset.isRequiredForNew === "true")
          ? true
          : false;
    }

    // Fees

    refreshLicenceCategoryFees();
  });
})();

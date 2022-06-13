/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { BulmaJS } from "@cityssm/bulma-js/types";

declare const cityssm: cityssmGlobal;
declare const bulmaJS: BulmaJS;

(() => {
  const urlPrefix = document.querySelector("main").dataset.urlPrefix;

  document.querySelector("#yearEnd--backupDatabase").addEventListener("click", (clickEvent) => {
    clickEvent.preventDefault();

    const doBackup = () => {

      cityssm.postJSON(urlPrefix + "/admin/doBackupDatabase", {},
        (responseJSON: { success: boolean; fileName?: string; }) => {

          if (responseJSON.success) {
            bulmaJS.alert({
              title: "Database Backed Up Successfully",
              message: "Database backed up as <strong>" + cityssm.escapeHTML(responseJSON.fileName) + "</strong>.",
              messageIsHtml: true,
              contextualColorName: "success"
            })
          }
        });
    };

    bulmaJS.confirm({
      title: "Backup Database",
      message: "To ensure all data is backed up properly," +
        " please make sure all users with update privileges avoid making changes while the backup is running.",
      contextualColorName: "info",
      okButton: {
        text: "Backup Database Now",
        callbackFunction: doBackup
      }
    });
  })
})();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b;
    (_a = document
        .querySelector('#cleanup--backupDatabase')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        function doBackup() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doBackupDatabase`, {}, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        title: 'Database Backed Up Successfully',
                        message: 'Database backed up as <strong>' +
                            cityssm.escapeHTML((_a = responseJSON.fileName) !== null && _a !== void 0 ? _a : '') +
                            '</strong>.',
                        messageIsHtml: true,
                        contextualColorName: 'success'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Backup Database',
            message: 'To ensure all data is backed up properly,' +
                ' please make sure all users with update privileges avoid making changes while the backup is running.',
            contextualColorName: 'info',
            okButton: {
                text: 'Backup Database Now',
                callbackFunction: doBackup
            }
        });
    });
    (_b = document
        .querySelector('#cleanup--cleanupDatabase')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        function doCleanup() {
            cityssm.postJSON(`${glm.urlPrefix}/admin/doCleanupDatabase`, {}, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        title: 'Database Cleaned Up Successfully',
                        message: `${responseJSON.rowCount} row${responseJSON.rowCount === 1 ? '' : 's'} deleted.`,
                        contextualColorName: 'success'
                    });
                }
            });
        }
        bulmaJS.confirm({
            title: 'Cleanup Database',
            message: 'Are you sure you want to cleanup the database?',
            contextualColorName: 'info',
            okButton: {
                text: 'Cleanup Database Now',
                callbackFunction: doCleanup
            }
        });
    });
})();

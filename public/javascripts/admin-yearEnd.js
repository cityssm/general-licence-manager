"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = document.querySelector('main').dataset.urlPrefix;
    const showProcessButtonElement = document.querySelector('#yearEnd--showProcess');
    if (showProcessButtonElement) {
        showProcessButtonElement.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            showProcessButtonElement.closest('.message').remove();
            document.querySelector('#yearEnd--process').classList.remove('is-hidden');
        });
    }
    let backupRanSuccessfully = false;
    document
        .querySelector('#yearEnd--backupDatabase')
        .addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        const doBackup = () => {
            cityssm.postJSON(urlPrefix + '/admin/doBackupDatabase', {}, (responseJSON) => {
                if (responseJSON.success) {
                    bulmaJS.alert({
                        title: 'Database Backed Up Successfully',
                        message: 'Database backed up as <strong>' +
                            cityssm.escapeHTML(responseJSON.fileName) +
                            '</strong>.',
                        messageIsHtml: true,
                        contextualColorName: 'success'
                    });
                    backupRanSuccessfully = true;
                }
            });
        };
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
    let refreshRanSuccessfully = false;
    document
        .querySelector('#yearEnd--refreshDatabase')
        .addEventListener('click', (clickEvent) => {
        clickEvent.preventDefault();
        const doRefresh = () => {
            cityssm.postJSON(urlPrefix + '/admin/doRefreshDatabase', {}, (responseJSON) => {
                if (responseJSON.success) {
                    bulmaJS.alert({
                        title: 'Database Refreshed Successfully',
                        message: 'Be sure to verify your data before making significant changes.',
                        contextualColorName: 'success'
                    });
                    refreshRanSuccessfully = true;
                }
            });
        };
        const doConfirm = () => {
            bulmaJS.confirm({
                title: 'Refresh Database',
                message: 'Are you sure you are ready to refresh the database?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Refresh the Database Now',
                    callbackFunction: doRefresh
                }
            });
        };
        if (refreshRanSuccessfully) {
            bulmaJS.confirm({
                title: 'Refresh Already Ran',
                message: 'Refreshing again will delete all of the records from the database.  Are you sure you want to refresh again?',
                contextualColorName: 'danger',
                okButton: {
                    text: 'Yes, Refresh Again',
                    callbackFunction: doConfirm
                }
            });
        }
        else if (backupRanSuccessfully) {
            doConfirm();
        }
        else {
            bulmaJS.confirm({
                title: 'No Backup Detected',
                message: 'Are you sure you want to proceed without backing up the database first?',
                contextualColorName: 'danger',
                okButton: {
                    text: 'Yes, Proceed Without a Backup',
                    callbackFunction: doConfirm
                }
            });
        }
    });
})();

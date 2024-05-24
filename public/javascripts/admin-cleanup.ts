/* eslint-disable unicorn/filename-case, unicorn/prefer-module, eslint-comments/disable-enable-pair */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { GLM } from '../../types/globalTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS
declare const glm: GLM
;(() => {
  document
    .querySelector('#cleanup--backupDatabase')
    ?.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()

      function doBackup(): void {
        cityssm.postJSON(
          `${glm.urlPrefix}/admin/doBackupDatabase`,
          {},
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              fileName?: string
            }

            if (responseJSON.success) {
              bulmaJS.alert({
                title: 'Database Backed Up Successfully',
                message:
                  'Database backed up as <strong>' +
                  cityssm.escapeHTML(responseJSON.fileName ?? '') +
                  '</strong>.',
                messageIsHtml: true,
                contextualColorName: 'success'
              })
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Backup Database',
        message:
          'To ensure all data is backed up properly,' +
          ' please make sure all users with update privileges avoid making changes while the backup is running.',
        contextualColorName: 'info',
        okButton: {
          text: 'Backup Database Now',
          callbackFunction: doBackup
        }
      })
    })

  document
    .querySelector('#cleanup--cleanupDatabase')
    ?.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()

      function doCleanup(): void {
        cityssm.postJSON(
          `${glm.urlPrefix}/admin/doCleanupDatabase`,
          {},
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              rowCount?: number
            }

            if (responseJSON.success) {
              bulmaJS.alert({
                title: 'Database Cleaned Up Successfully',
                message: `${responseJSON.rowCount} row${
                  responseJSON.rowCount === 1 ? '' : 's'
                } deleted.`,
                contextualColorName: 'success'
              })
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Cleanup Database',
        message: 'Are you sure you want to cleanup the database?',
        contextualColorName: 'info',
        okButton: {
          text: 'Cleanup Database Now',
          callbackFunction: doCleanup
        }
      })
    })
})()

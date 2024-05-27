/* eslint-disable unicorn/filename-case, @eslint-community/eslint-comments/disable-enable-pair */

;(() => {
  function togglePanel(clickEvent: Event): void {
    clickEvent.preventDefault()

    const panelBlockElements = (clickEvent.currentTarget as HTMLElement)
      .closest('.panel')
      ?.querySelectorAll('.panel-block')

    if (panelBlockElements !== undefined) {
      for (const panelBlockElement of panelBlockElements) {
        panelBlockElement.classList.toggle('is-hidden')
      }
    }
  }

  const panelToggleButtonElements = document.querySelectorAll(
    '.is-panel-toggle-button'
  )

  for (const panelToggleButtonElement of panelToggleButtonElements) {
    panelToggleButtonElement.addEventListener('click', togglePanel)
  }
})()

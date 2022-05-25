/* eslint-disable unicorn/filename-case */

(() => {

  const togglePanel = (clickEvent: Event) => {
    clickEvent.preventDefault();

    const panelBlockElements = (clickEvent.currentTarget as HTMLElement).closest(".panel").querySelectorAll(".panel-block");

    for (const panelBlockElement of panelBlockElements) {
      panelBlockElement.classList.toggle("is-hidden");
    }
  };

  const panelToggleButtonElements = document.querySelectorAll(".is-panel-toggle-button");

  for (const panelToggleButtonElement of panelToggleButtonElements) {
    panelToggleButtonElement.addEventListener("click", togglePanel);
  }
})();

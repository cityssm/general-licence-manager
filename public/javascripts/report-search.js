;
(() => {
    function togglePanel(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const panelBlockElements = (_a = clickEvent.currentTarget
            .closest('.panel')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.panel-block');
        if (panelBlockElements !== undefined) {
            for (const panelBlockElement of panelBlockElements) {
                panelBlockElement.classList.toggle('is-hidden');
            }
        }
    }
    const panelToggleButtonElements = document.querySelectorAll('.is-panel-toggle-button');
    for (const panelToggleButtonElement of panelToggleButtonElements) {
        panelToggleButtonElement.addEventListener('click', togglePanel);
    }
})();

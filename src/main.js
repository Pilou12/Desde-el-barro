import { AppUI } from "./ui/AppUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  if (appContainer) {
    const ui = new AppUI(appContainer);
    ui.init();
  }
});

import { renderHome } from "./pages/home.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderProblemPage } from "./pages/problemPage.js";
import { renderNotes } from "./pages/notes.js";


const app = document.getElementById("app");

function router() {
  const container = document.getElementById("app");
  const hash = location.hash || "#/";

  if (hash.startsWith("#/problem")) {
    renderProblemPage(app);
  } else if (hash === "#/dashboard") {
    renderDashboard(app);
  } else if (hash === "#/notes") {
    const handle = window.currentCFHandle || localStorage.getItem("currentCFHandle");
    if (handle) {
      renderNotes(app, handle);
    } else {
      container.innerHTML = "<p>No handle selected. Go back to home.</p>";
    }
  } else {
    renderHome(app);
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

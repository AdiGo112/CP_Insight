import { renderHome } from "./pages/home.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderProblemPage } from "./pages/problemPage.js";
import { renderNotes } from "./pages/notes.js";
import { getCurrentHandle } from "./services/api.js";

const app = document.getElementById("app");

async function router() {
  const hash = location.hash || "#/";

  if (hash.startsWith("#/problem")) {
    renderProblemPage(app);
    return;
  }

  if (hash === "#/dashboard") {
    renderDashboard(app);
    return;
  }

  if (hash === "#/notes") {
    const handle = await getCurrentHandle();
    if (!handle) {
      app.innerHTML = "<p>No handle selected. Go back to home.</p>";
      return;
    }
    renderNotes(app, handle);
    return;
  }

  renderHome(app);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

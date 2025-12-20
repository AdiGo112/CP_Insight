import { renderHome } from "./pages/home.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderAnalytics } from "./pages/analytics.js";
import { renderNotes } from "./pages/notes.js";

const app = document.getElementById("app");

function router() {
  const route = location.hash;

  app.innerHTML = "";

  if (route === "#/dashboard") renderDashboard(app);
  else if (route === "#/analytics") renderAnalytics(app);
  else if (route === "#/notes") renderNotes(app);
  else renderHome(app);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

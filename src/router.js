import { renderHome } from "./pages/home.js";
import { renderDashboard } from "./pages/dashboard.js";

const app = document.getElementById("app");

function router() {
  if (location.hash === "#/dashboard") renderDashboard(app);
  else renderHome(app);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

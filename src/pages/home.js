import { syncHandle } from "../services/api.js";

export function renderHome(container) {
  container.innerHTML = `
    <div class="card">
      <h2>CF Insight</h2>
      <p>Analyze your Codeforces performance.</p>
      <input id="handle" placeholder="Enter CF handle" />
      <br /><br />
      <button id="syncBtn">Sync Data</button>
    </div>
  `;

  document.getElementById("syncBtn").onclick = async () => {
    const handle = document.getElementById("handle").value;
    if (!handle) return alert("Enter handle");

    try {
      await syncHandle(handle); // calls your server
      // In your Home page after syncing
      window.currentCFHandle = handle;
      localStorage.setItem("currentCFHandle", handle);

      location.hash = "#/dashboard";
    } catch (err) {
      alert(err.message);
    }
    
  };
}

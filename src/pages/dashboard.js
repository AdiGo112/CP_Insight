import { getUserSubmissions, getCurrentHandle } from "../services/api.js";
import { collapseSubmissions } from "../utils/problemAnalyzer.js";

export async function renderDashboard(container) {
  const handle = await getCurrentHandle();

  if (!handle) {
    container.innerHTML = "<p>No handle selected. Go back to home.</p>";
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h2>Dashboard</h2>
      <p><strong>Handle:</strong> ${handle}</p>
      <div id="summary"></div>
      <br>
      <p>Problems (derived from last submissions):</p>
      <table id="submissionsTable" border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Rating</th>
            <th>Tags</th>
            <th>Attempts</th>
            <th>Final Verdict</th>
            <th>Most Recent Attempt</th>
          </tr>
        </thead>
        <tbody id="submissionsBody">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const submissions = await getUserSubmissions(handle);
    const tbody = document.getElementById("submissionsBody");
    tbody.innerHTML = "";

    if (!submissions.length) {
      tbody.innerHTML =
        `<tr><td colspan="6">No submissions found. Sync first!</td></tr>`;
      return;
    }

    const problems = collapseSubmissions(submissions);
    let solvedCount = 0;

    problems.forEach(p => {
      if (p.solved) solvedCount++;

      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";

      tr.innerHTML = `
        <td>${p.problemID} - ${p.name}</td>
        <td>${p.rating || "N/A"}</td>
        <td>${p.tags.join(", ") || "N/A"}</td>
        <td>${p.attempts}</td>
        <td>${p.finalVerdict}</td>
        <td>${new Date(p.lastSeen * 1000).toLocaleString("en-IN", { hour12: false })}</td>
      `;

      tr.addEventListener("click", () => {
        location.hash = `#/problem?pid=${p.problemID}`;
      });

      tbody.appendChild(tr);
    });

    document.getElementById("summary").innerHTML = `
      <p><strong>In last ${submissions.length} attempts</strong></p>
      <p>
        <strong>Problems attempted:</strong> ${problems.length} |
        <strong>Solved:</strong> ${solvedCount} |
        <strong>Unsolved:</strong> ${problems.length - solvedCount}
      </p>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("submissionsBody").innerHTML =
      `<tr><td colspan="6">Failed to load problems.</td></tr>`;
  }
}

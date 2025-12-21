import { getUserSubmissions } from "../services/api.js";
import { collapseSubmissions } from "../utils/problemAnalyzer.js";

export async function renderDashboard(container) {
  const handle =
    window.currentCFHandle || localStorage.getItem("currentCFHandle");

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
            <th>First Attempt</th>
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
      tbody.innerHTML = `<tr><td colspan="6">No submissions found. Sync first!</td></tr>`;
      return;
    }

    const problems = collapseSubmissions(submissions);
    let solvedCount = 0;

    problems.forEach(p => {
      if (p.solved) solvedCount++;

      const problemName = `${p.problemID} - ${p.name}`;
      const rating = p.rating || "N/A";
      const tags = p.tags.join(", ") || "N/A";
      const attempts = p.attempts;
      const verdict = p.finalVerdict;
      const firstSeen = new Date(p.firstSeen * 1000).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";

      tr.innerHTML = `
        <td class="problem-link">${problemName}</td>
        <td>${rating}</td>
        <td>${tags}</td>
        <td>${attempts}</td>
        <td>${verdict}</td>
        <td>${firstSeen}</td>
      `;

      tr.addEventListener("click", () => {
        // persist context (good instinct, keep this)
      localStorage.setItem(
        "currentProblem",
        JSON.stringify({
          handle,
          problemID: p.problemID // this is the key for the problem in DB
        })
      );

        

        // SPA navigation
        location.hash = `#/problem?pid=${p.problemID}`;
      });


      tbody.appendChild(tr);
    });

    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = `
      <p><strong>In last ${submissions.length} attempts</strong></p>
      <p>
        <strong>Problems attempted:</strong> ${problems.length} |
        <strong>Solved:</strong> ${solvedCount} |
        <strong>Unsolved:</strong> ${problems.length - solvedCount}
      </p>
    `;

  } catch (err) {
    const tbody = document.getElementById("submissionsBody");
    tbody.innerHTML = `<tr><td colspan="6">Failed to load problems.</td></tr>`;
    console.error(err);
  }
}

import { getProblem, getNotes, getCurrentHandle } from "../services/api.js";
import { renderNotesSection } from "../components/notesSection.js";

export async function renderProblemPage(container) {
  // Fetch the universal handle from the server
  let handle;
  try {
    handle = await getCurrentHandle(); // you need an endpoint like /api/handle
  } catch (err) {
    container.innerHTML = "<p>Failed to load handle from server.</p>";
    console.error(err);
    return;
  }

  const query = location.hash.split("?")[1];
  const params = new URLSearchParams(query);
  const pid = params.get("pid");

  if (!pid || !handle) {
    container.innerHTML = "<p>Invalid problem context.</p>";
    return;
  }

  container.innerHTML = "<p>Loading problem...</p>";

  try {
    const data = await getProblem(pid);
    const p = data.problem;

    container.innerHTML = `
      <div class="card">
        <h2>${p.name} (${p.contestId}${p.index})</h2>

        <p>
          <strong>Rating:</strong> ${p.rating || "N/A"} <br>
          <strong>Tags:</strong> ${p.tags?.length ? p.tags.join(", ") : "N/A"}
        </p>

        <hr>

        <h3>Your Reality</h3>
        <p>
          <strong>Attempts:</strong> ${data.attempts} <br>
          <strong>Status:</strong> ${data.solved ? "Solved" : "Unsolved"} <br>
          <strong>First Attempt:</strong>
          ${new Date(data.firstAttempt * 1000).toLocaleString("en-IN", { hour12: false })} <br>
          <strong>Last Attempt:</strong>
          ${new Date(data.lastAttempt * 1000).toLocaleString("en-IN", { hour12: false })} <br>
        </p>

        <hr>

        <h3>Submissions</h3>

<table
  class="submissions-table"
  style="
    border-collapse: separate;
    border-spacing: 25px 0;
    text-align: left;
  "
>

  <thead>
    <tr>
      <th>Verdict</th>
      <th>Language</th>
      <th>Runtime</th>
      <th>Memory</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    ${data.submissions.map(s => {
      const verdict = s.verdict || "?";
      const language = s.language || "?";
      const runtime = s.runtime != null ? `${s.runtime} ms` : "-";
      const memory = s.memory != null ? `${s.memory / 1024} KB` : "-";
      const time = new Date(s.time * 1000).toLocaleString("en-IN", {
        hour12: false
      });

      return `
        <tr>
          <td>${verdict}</td>
          <td>${language}</td>
          <td>${runtime}</td>
          <td>${memory}</td>
          <td>${time}</td>
        </tr>
      `;
    }).join("")}
  </tbody>
</table>


        <hr>
        <div id="notesSection"></div>
      </div>
    `;

    const notes = await getNotes(handle, pid);

    renderNotesSection(
      document.getElementById("notesSection"),
      notes,
      pid,
      handle
    );
  } catch (err) {
    container.innerHTML = "<p>Failed to load problem. (ProblemPage)</p>";
    console.error(err);
  }
}

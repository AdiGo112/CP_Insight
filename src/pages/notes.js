import { getAllNotes } from "../services/api.js";

export async function renderNotes(container, handle) {
  container.innerHTML = `
    <div class="card">
      <h2>Mistake Notes</h2>
      <p>All your notes organized by problem.</p>
      <div id="notesList">Loading...</div>
    </div>
  `;

  const listContainer = container.querySelector("#notesList");

  try {
    const allNotes = await getAllNotes(handle);

    if (!allNotes || allNotes.length === 0) {
      listContainer.innerHTML = "<p>No notes yet.</p>";
      return;
    }

    listContainer.innerHTML = allNotes
      .map(({ problemId, problemName, notes }) => `
        <div class="problem-notes">
          <h3>
            <a href="#/problem?pid=${problemId}">
              ${problemId}-${problemName}
            </a>
            <span>
              · ${notes.length} note${notes.length > 1 ? "s" : ""}
            </span>
          </h3>

          <ul>
            ${notes
              .map(
                n =>
                  `<li>
                    ${n.text.slice(0, 50)}${
                      n.text.length > 50 ? "…" : ""
                    }
                  </li>`
              )
              .join("")}
          </ul>
        </div>
      `)
      .join("");

  } catch (err) {
    console.error("Failed to fetch all notes:", err);
    listContainer.innerHTML = "<p>Failed to load notes.</p>";
  }
}

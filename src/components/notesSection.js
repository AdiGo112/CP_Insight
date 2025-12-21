// components/notesSection.js

export function renderNotesSection(notes) {
  return `
    <h3>Your Notes</h3>

    <div id="notesList">
      ${notes.map(n => `
        <div class="note">
          <small>${new Date(n.createdAt).toLocaleString()}</small>
          <p>${n.text}</p>
          <button data-edit="${n.id}">Edit</button>
        </div>
      `).join("")}
    </div>

    <textarea id="newNoteText" placeholder="Write honestly..."></textarea>
    <button id="addNoteBtn">Add note</button>
  `;
}

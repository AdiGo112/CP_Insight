// components/notesSection.js

import { getNotes, addNote, updateNote, deleteNote } from "../services/api.js";

export function renderNotesSection(container, notes = [], pid, handle) {
  container.innerHTML = `
    <h3>Your Notes</h3>

    <div id="notesList">
      ${
        notes.length
          ? notes
              .map(
                n => `
            <div class="note" data-id="${n._id}">
              <small>${new Date(n.createdAt).toLocaleString("en-IN")}</small>
              <p>${n.text}</p>

              <div class="note-actions">
                <button data-edit="${n._id}">Edit</button>
                <button data-delete="${n._id}">Delete</button>
              </div>
            </div>
          `
              )
              .join("")
          : `<p>No notes yet.</p>`
      }
    </div>

    <textarea id="newNoteText" placeholder="Write honestly..."></textarea>
    <button id="addNoteBtn">Add note</button>
  `;

  const textarea = container.querySelector("#newNoteText");
  const addBtn = container.querySelector("#addNoteBtn");
  const list = container.querySelector("#notesList");

  let editingId = null;

  // ADD or SAVE
  addBtn.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) return;

    try {
      if (editingId) {
        await updateNote(handle, pid, editingId, text);
        editingId = null;
        addBtn.textContent = "Add note";
      } else {
        await addNote(pid, text, handle);
      }

      textarea.value = "";

      const updatedNotes = await getNotes(handle, pid);
      renderNotesSection(container, updatedNotes, pid, handle);
    } catch (err) {
      console.error("Notes error:", err);
    }
  });

  // EDIT / DELETE (event delegation)
  list.addEventListener("click", async (e) => {
    const editBtn = e.target.closest("button[data-edit]");
    const deleteBtn = e.target.closest("button[data-delete]");

    // EDIT
    if (editBtn) {
      const id = editBtn.dataset.edit;
      const note = notes.find(n => n._id === id);
      if (!note) return;

      textarea.value = note.text;
      textarea.focus();

      editingId = id;
      addBtn.textContent = "Save changes";
      return;
    }

    // DELETE
    if (deleteBtn) {
      const id = deleteBtn.dataset.delete;
      if (!confirm("Delete this note?")) return;

      try {
        await deleteNote(handle, pid, id);
        const updatedNotes = await getNotes(handle, pid);
        renderNotesSection(container, updatedNotes, pid, handle);
        
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  });
}

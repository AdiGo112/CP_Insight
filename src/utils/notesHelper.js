// utils/notesHelper.js

export function createNote(text) {
  return {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };
}

export function addNote(notes, text) {
  return [...notes, createNote(text)];
}

export function editNote(notes, noteId, newText) {
  return notes.map(note =>
    note.id === noteId
      ? { ...note, text: newText, updatedAt: new Date().toISOString() }
      : note
  );
}

export function deleteNote(notes, noteId) {
  return notes.filter(note => note.id !== noteId);
}

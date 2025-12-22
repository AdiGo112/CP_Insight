const SERVER_URL = "http://localhost:3000"; // change when deployed

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API error");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

/* ---------------- API FUNCTIONS ---------------- */

// Fetch submissions for a handle
export async function getUserSubmissions(handle) {
  return request(`/submissions?handle=${handle}`).then(
    res => res.submissions || []
  );
}

// Sync submissions from Codeforces
export async function syncHandle(handle) {
  return request(`/sync`, {
    method: "POST",
    body: JSON.stringify({ handle }),
  }).then(res => res.submissions);
}

// Fetch single problem + user-specific data
export async function getProblem(handle, pid) {
  return request(`/api/problem/${handle}/${pid}`);
}

// ---------------- NOTES API ----------------

// Get notes for a specific problem of a user
export async function getNotes(handle, pid) {
  return request(`/api/notes/${handle}/${pid}`);
}

// Add note to user → problem
export async function addNote(pid, text, handle) {
  return request(`/api/notes`, {
    method: "POST",
    body: JSON.stringify({ handle, pid, text }),
  });
}
// Update a note inside user → problem
export async function updateNote(handle, pid, noteId, text) {
  return request(`/api/notes/${noteId}`, {
    method: "PUT",
    body: JSON.stringify({ handle, pid, text }),
  });
}
// Delete a note from user → problem
export async function deleteNote(handle, pid, noteId) {
  return request(`/api/notes/${noteId}`, {
    method: "DELETE",
    body: JSON.stringify({ handle, pid }),
  });
}

// Fetch all notes for a user
export async function getAllNotes(handle) {
  return request(`/api/notes/${handle}`);
}


// ---------------- FUTURE FEATURES ----------------

export async function getStats(handle) {
  return request(`/stats/${handle}`);
}

export async function getAnalytics(handle) {
  return request(`/analytics/${handle}`);
}

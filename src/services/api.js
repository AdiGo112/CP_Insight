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


// Fetch submissions for a handle (from your server)
export async function getUserSubmissions(handle) {
  return request(`/submissions?handle=${handle}`).then(res => res.submissions || []);
}

// Sync submissions from Codeforces and store on server
export async function syncHandle(handle) {
  return request(`/sync`, {
    method: "POST",
    body: JSON.stringify({ handle }),
  }).then(res => res.submissions);
}

// Placeholder functions for future features
export async function getStats(handle) {
  return request(`/stats/${handle}`);
}

export async function getAnalytics(handle) {
  return request(`/analytics/${handle}`);
}

export async function getNotes(handle) {
  return request(`/notes/${handle}`);
}

export async function addNote(problemId, note, handle) {
  return request(`/note`, {
    method: "POST",
    body: JSON.stringify({ problemId, note, handle }),
  });
}

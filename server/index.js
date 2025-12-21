import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { usersCollection } from "./db.js";  // MongoDB connection
import problemRouter from "./problem.js";



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", problemRouter);
app.use("/api/problem", problemRouter);


const PORT = 3000;

// ----------------- SYNC ENDPOINT -----------------
app.post("/sync", async (req, res) => {
  const { handle } = req.body;
  if (!handle) return res.status(400).json({ error: "Handle required" });

  try {
    // Fetch recent submissions from Codeforces
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`
    );
    const data = await response.json();

    if (data.status !== "OK") return res.status(400).json({ error: data.comment });

    // Upsert submissions for this handle in MongoDB
    await usersCollection.updateOne(
      { handle },
      { $set: { submissions: data.result, lastSynced: new Date() } },
      { upsert: true }
    );

    res.json({ message: "Sync complete", submissions: data.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from Codeforces" });
  }
});

// ----------------- GET SUBMISSIONS -----------------
app.get("/submissions", async (req, res) => {
  const handle = req.query.handle;
  if (!handle) return res.status(400).json({ error: "Handle required" });

  try {
    const user = await usersCollection.findOne({ handle });
    res.json({ submissions: user?.submissions || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

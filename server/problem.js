import express from "express";
import { usersCollection } from "./db.js";

const router = express.Router();

// problem.js
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const user = await usersCollection.findOne(
      {},
      { sort: { lastSynced: -1 } }
    );

    if (!user) {
      return res.status(404).json({ error: "No user synced yet" });
    }

    const problemSubmissions = user.submissions.filter(
      s => `${s.problem.contestId}${s.problem.index}` === pid
    );

    if (!problemSubmissions.length) {
      return res.status(404).json({ error: "Problem not found" });
    }

    problemSubmissions.sort(
      (a, b) => b.creationTimeSeconds - a.creationTimeSeconds
    );

    const problem = problemSubmissions[0].problem;

    res.json({
      problemId: pid,
      problem,
      attempts: problemSubmissions.length,
      solved: problemSubmissions.some(s => s.verdict === "OK"),
      firstAttempt: problemSubmissions.at(-1).creationTimeSeconds,
      lastAttempt: problemSubmissions[0].creationTimeSeconds,
      submissions: problemSubmissions.map(s => ({
        verdict: s.verdict,
        language: s.programmingLanguage,
        runtime: s.timeConsumedMillis,
        memory: s.memoryConsumedBytes,
        time: s.creationTimeSeconds
      }))
    });

  } catch (err) {
    console.error("Problem load failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;

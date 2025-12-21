import express from "express";
import { usersCollection } from "./db.js";

const router = express.Router();

/**
 * GET /api/problem/:handle/:pid
 * pid format: contestId + index  (example: 2158A)
 */
router.get("/:handle/:pid", async (req, res) => {
  const { handle, pid } = req.params;

  try {
    // 1. Load user from MongoDB
    const user = await usersCollection.findOne({ handle });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Extract submissions for this problem
    const problemSubmissions = user.submissions.filter(
      s => `${s.problem.contestId}${s.problem.index}` === pid
    );

    if (!problemSubmissions.length) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // 3. Sort by time (newest first)
    problemSubmissions.sort(
      (a, b) => b.creationTimeSeconds - a.creationTimeSeconds
    );

    const problem = problemSubmissions[0].problem;

    // 4. Derive stats
    const attempts = problemSubmissions.length;
    const solved = problemSubmissions.some(s => s.verdict === "OK");

    const verdictBreakdown = {
      OK: 0,
      WRONG_ANSWER: 0,
      TIME_LIMIT_EXCEEDED: 0,
      MEMORY_LIMIT_EXCEEDED: 0
    };

    problemSubmissions.forEach(s => {
      if (verdictBreakdown[s.verdict] !== undefined) {
        verdictBreakdown[s.verdict]++;
      }
    });

    res.json({
      problemId: pid,
      problem,
      attempts,
      solved,
      verdictBreakdown,
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

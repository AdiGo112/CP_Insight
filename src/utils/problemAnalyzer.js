// client/utils/problemAnalyzer.js

// Higher number = worse verdict
const verdictPriority = {
  OK: 1,
  WRONG_ANSWER: 2,
  TIME_LIMIT_EXCEEDED: 3,
  MEMORY_LIMIT_EXCEEDED: 4,
  RUNTIME_ERROR: 5,
  COMPILATION_ERROR: 6
};

/**
 * Collapse submissions into problem-level stats
 * @param {Array} submissions - raw CF submissions
 * @returns {Array} problems
 */
export function collapseSubmissions(submissions) {
  const problemsMap = {};

  for (const sub of submissions) {
    const p = sub.problem;
    if (!p || !p.contestId || !p.index) continue;

    const problemId = `${p.contestId}${p.index}`;
    const verdict = sub.verdict || "UNKNOWN";
    const time = sub.creationTimeSeconds;

    if (!problemsMap[problemId]) {
      problemsMap[problemId] = {
        problemID: problemId,
        name: p.name,
        rating: p.rating ?? null,
        tags: p.tags || [],
        attempts: 0,
        solved: false,
        firstSeen: time,
        lastSeen: time,
        finalVerdict: verdict,
        maxSeverity: verdict,
      };
    }

    const problem = problemsMap[problemId];

    // attempts
    problem.attempts++;

    // time tracking
    problem.firstSeen = Math.min(problem.firstSeen, time);
    problem.lastSeen = Math.max(problem.lastSeen, time);

    // solved logic
    if (verdict === "OK") {
      problem.solved = true;
      problem.finalVerdict = "OK";
    }

    // worst verdict tracking
    const currentSeverity = verdictPriority[verdict] || 0;
    const maxSeverity = verdictPriority[problem.maxSeverity] || 0;

    if (currentSeverity > maxSeverity) {
      problem.maxSeverity = verdict;
    }

  }

  return Object.values(problemsMap);
}

/**
 * Derive high-level stats from collapsed problems
 * @param {Array} problems
 * @returns {Object}
 */
export function getProblemStats(problems) {
  const total = problems.length;
  const solved = problems.filter(p => p.solved).length;
  const unsolved = total - solved;

  const painful = problems.filter(p => !p.solved && p.attempts >= 3).length;

  return {
    totalProblems: total,
    solvedProblems: solved,
    unsolvedProblems: unsolved,
    painfulProblems: painful
  };
}

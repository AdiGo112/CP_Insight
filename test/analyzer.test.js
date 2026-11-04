import { test } from "node:test";
import assert from "node:assert/strict";
import { collapseSubmissions, getProblemStats } from "../src/utils/problemAnalyzer.js";
import { addNote, editNote, deleteNote } from "../src/utils/notesHelper.js";

const sub = (contestId, index, verdict, t) => ({
  problem: { contestId, index, name: `P${contestId}${index}`, tags: ["dp"] },
  verdict, creationTimeSeconds: t,
});

test("collapses submissions into one entry per problem", () => {
  const ps = collapseSubmissions([
    sub(1, "A", "WRONG_ANSWER", 30),
    sub(1, "A", "TIME_LIMIT_EXCEEDED", 10),
    sub(1, "A", "OK", 20),
    sub(2, "B", "WRONG_ANSWER", 5),
    { problem: {}, verdict: "OK" }, // malformed: skipped
  ]);
  assert.equal(ps.length, 2);
  const a = ps.find(p => p.problemID === "1A");
  assert.equal(a.attempts, 3);
  assert.equal(a.solved, true);
  assert.equal(a.finalVerdict, "OK");
  assert.equal(a.maxSeverity, "TIME_LIMIT_EXCEEDED");
  assert.equal(a.firstSeen, 10);
  assert.equal(a.lastSeen, 30);
  assert.equal(a.rating, null);
});

test("stats count solved, unsolved and painful (3+ failed attempts)", () => {
  const ps = collapseSubmissions([
    sub(1, "A", "OK", 1),
    sub(2, "B", "WRONG_ANSWER", 1), sub(2, "B", "WRONG_ANSWER", 2), sub(2, "B", "RUNTIME_ERROR", 3),
    sub(3, "C", "WRONG_ANSWER", 1),
  ]);
  assert.deepEqual(getProblemStats(ps), {
    totalProblems: 3, solvedProblems: 1, unsolvedProblems: 2, painfulProblems: 1,
  });
});

test("notes add, edit and delete without mutating the input", () => {
  const empty = [];
  const one = addNote(empty, "use prefix sums");
  assert.equal(empty.length, 0);
  const id = one[0].id;
  const edited = editNote(one, id, "use a Fenwick tree");
  assert.equal(edited[0].text, "use a Fenwick tree");
  assert.ok(edited[0].updatedAt);
  assert.equal(one[0].text, "use prefix sums");
  assert.deepEqual(deleteNote(edited, id), []);
});

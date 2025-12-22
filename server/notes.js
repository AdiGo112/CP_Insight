import express from "express";
import { usersCollection } from "./db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET notes for a specific problem of a user
router.get("/:handle/:pid", async (req, res) => {
  const { handle, pid } = req.params;

  const user = await usersCollection.findOne({ handle });
  if (!user) return res.status(404).json({ error: "User not found" });

  const notes = user.notes?.[pid] || [];
  res.json(notes);
});

// GET all notes for a user (grouped by problem)
router.get("/:handle", async (req, res) => {
  const { handle } = req.params;

  const user = await usersCollection.findOne(
    { handle },
    { projection: { notes: 1 } }
  );

  if (!user || !user.notes) {
    return res.json([]);
  }

  // Flatten notes into a list
  const result = Object.entries(user.notes).map(
    ([problemId, notes]) => ({
      problemId,
      notes
    })
  );
  console.log("Notes fetched for user:", handle, result);

  res.json(result);
});

// ADD note to a specific problem
router.post("/", async (req, res) => {
  const { handle, pid, text } = req.body;
  if (!handle || !pid || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newNote = {
    _id: new ObjectId(),
    text,
    createdAt: new Date(),
    updatedAt: null,
  };

  await usersCollection.updateOne(
    { handle },
    { $push: { [`notes.${pid}`]: newNote } },
    { upsert: true }
  );

  res.json(newNote);
});

// UPDATE note inside a problem
router.put("/:noteId", async (req, res) => {
  const { noteId } = req.params;
  const { handle, pid, text } = req.body;

  if (!handle || !pid || !text) return res.status(400).json({ error: "Missing fields" });

  await usersCollection.updateOne(
    { handle, [`notes.${pid}._id`]: new ObjectId(noteId) },
    { $set: { [`notes.${pid}.$.text`]: text, [`notes.${pid}.$.updatedAt`]: new Date() } }
  );

  res.json({ success: true });
});

// DELETE note from a problem
router.delete("/:noteId", async (req, res) => {
  const { noteId } = req.params;
  const { handle, pid } = req.body;

  if (!handle || !pid) return res.status(400).json({ error: "Missing fields" });

  await usersCollection.updateOne(
    { handle },
    { $pull: { [`notes.${pid}`]: { _id: new ObjectId(noteId) } } }
  );

  res.json({ success: true });
});

export default router;

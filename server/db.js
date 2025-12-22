import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";

dotenv.config({ path: path.resolve("./.env") }); // explicitly load .env from current folder

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI is undefined");

const client = new MongoClient(uri);
await client.connect();
console.log("MongoDB connected");

const db = client.db("cf_insight");
export const usersCollection = db.collection("users");

export const notesCollection = db.collection("notes");


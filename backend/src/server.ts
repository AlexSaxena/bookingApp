import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("General Kenobi!");
});

app.get("/api/rooms", (req, res) => {
  const rooms = db
    .prepare("SELECT id, name, capacity FROM rooms ORDER BY name")
    .all();
  res.json(rooms);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

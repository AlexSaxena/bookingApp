import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./db";
import { roomsRouter } from "./Routes/roomsRoutes";
import { freeSlotsRouter } from "./Routes/freeSlotsRoutes";

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

app.use("/api/rooms", roomsRouter);
app.use("/api/free-slots", freeSlotsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

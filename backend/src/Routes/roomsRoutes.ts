import { Router } from "express";
import { getRooms } from "../controllers/roomsController";

const roomsRouter = Router();

roomsRouter.get("/", getRooms);

export { roomsRouter };

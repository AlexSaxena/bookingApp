import { Router } from "express";
import { getFreeSlots } from "../controllers/freeSlotController";

const freeSlotsRouter = Router();

freeSlotsRouter.get("/", getFreeSlots);

export { freeSlotsRouter };

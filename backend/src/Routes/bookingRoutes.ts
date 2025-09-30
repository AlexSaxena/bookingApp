import { Router } from "express";
import { createBooking } from "../controllers/bookingController";

const bookingRouter = Router();

bookingRouter.post("/", createBooking);

export { bookingRouter };

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { DateTime } from "luxon";
import { db } from "../db";
import { DATE_FMT, HOUR_START, HOUR_END, toUtcSlotISO } from "../utils/time";

const BookingSchema = z.object({
  roomId: z.coerce.number().int().positive(),
  date: z
    .string()
    .refine(
      (s) => DateTime.fromFormat(s, DATE_FMT).isValid,
      "Invalid date (YYYY-MM-DD)"
    ),
  hour: z.coerce
    .number()
    .int()
    .min(HOUR_START)
    .max(HOUR_END - 1),
  bookerName: z.string().trim().min(2),
});

export function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const body = BookingSchema.parse(req.body);
    const { startUtc, endUtc } = toUtcSlotISO(body.date, body.hour);

    const info = db
      .prepare(
        `INSERT INTO bookings (room_id, start_utc, end_utc, booker_name, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .run(body.roomId, startUtc, endUtc, body.bookerName);

    return res.status(201).json({
      id: Number(info.lastInsertRowid),
      roomId: body.roomId,
      startUtc,
      endUtc,
      bookerName: body.bookerName,
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return res.status(422).json({
        error: "Validation failed",
        details: e.issues,
      });
    }

    const msg = String(e?.message ?? "");
    if (msg.includes("UNIQUE")) {
      return res.status(409).json({ error: "Slot already booked" });
    }
    if (msg.includes("FOREIGN KEY")) {
      return res.status(422).json({ error: "Invalid roomId" });
    }

    next(e);
  }
}

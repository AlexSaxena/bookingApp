import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { z } from "zod";
import { DateTime } from "luxon";
import {
  DATE_FMT,
  eachDate,
  eachHourSlot,
  rangeUtcISO,
  toUtcSlotISO,
} from "../utils/time";

// Validate and parse query parameters
const QuerySchema = z.object({
  from: z
    .string()
    .refine(
      (s) => DateTime.fromFormat(s, DATE_FMT).isValid,
      "Invalid from date"
    ),
  to: z
    .string()
    .refine((s) => DateTime.fromFormat(s, DATE_FMT).isValid, "Invalid to date"),
  roomIds: z
    .string()
    .optional()
    .transform((s) =>
      s
        ? s
            .split(",")
            .map((x) => parseInt(x.trim(), 10))
            .filter(Number.isFinite)
        : []
    ),
});

export function getFreeSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to, roomIds } = QuerySchema.parse(req.query);

    // Rooms (filtered or all)
    const rooms = roomIds.length
      ? db
          .prepare(
            `SELECT id, name, capacity FROM rooms WHERE id IN (${roomIds
              .map(() => "?")
              .join(",")}) ORDER BY name`
          )
          .all(...roomIds)
      : db.prepare("SELECT id, name, capacity FROM rooms ORDER BY name").all();

    if (!rooms.length) return res.json([]);

    // Fetch all booked slots in the requested date range
    const { fromUtc, toUtcExclusive } = rangeUtcISO(from, to);
    const bookedRows = db
      .prepare(
        `SELECT room_id, start_utc FROM bookings
        WHERE start_utc >= ? AND start_utc < ?
        ${
          roomIds.length
            ? `AND room_id IN (${roomIds.map(() => "?").join(",")})`
            : ""
        }`
      )
      .all(
        roomIds.length
          ? [fromUtc, toUtcExclusive, ...roomIds]
          : [fromUtc, toUtcExclusive]
      ) as Array<{ room_id: number; start_utc: string }>;

    const booked = new Set(
      bookedRows.map((b) => `${b.room_id}|${b.start_utc}`)
    );

    const days = eachDate(from, to);
    const hours = eachHourSlot();

    const free: Array<{
      date: string;
      hour: number;
      room: { id: number; name: string; capacity: number };
    }> = [];

    for (const d of days) {
      for (const r of rooms as Array<{
        id: number;
        name: string;
        capacity: number;
      }>) {
        for (const h of hours) {
          const { startUtc } = toUtcSlotISO(d, h);
          if (!booked.has(`${r.id}|${startUtc}`)) {
            free.push({ date: d, hour: h, room: r });
          }
        }
      }
    }

    res.json(free);
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return res
        .status(422)
        .json({ error: "Validation failed", details: e.errors });
    }
    next(e);
  }
}

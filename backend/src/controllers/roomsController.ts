import { Request, Response, NextFunction } from "express";
import { db } from "../db";

export const getRooms = (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = db
      .prepare("SELECT id, name, capacity FROM rooms ORDER BY name")
      .all();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(__dirname, "../db/database.db");

export const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 3000");

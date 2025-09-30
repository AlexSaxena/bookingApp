const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.resolve(__dirname, "../db/database.db");
const schemaPath = path.resolve(__dirname, "../db/schema.sql");
const seedPath = path.resolve(__dirname, "../db/seed.sql");

const schemaSql = fs.readFileSync(schemaPath, "utf-8");
const seedSql = fs.existsSync(seedPath)
  ? fs.readFileSync(seedPath, "utf-8")
  : "";

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 3000");

db.exec(schemaSql);

// Seed rooms if empty
const { count } = db.prepare("SELECT COUNT(*) AS count FROM rooms").get();
if (count === 0 && seedSql) {
  db.exec(seedSql);
}

const rooms = db.prepare("SELECT id, name, capacity FROM rooms").all();
if (rooms.length === 0) {
  console.error("No rooms found in the database. Please seed the database.");
  process.exit(1);
} else {
  console.log("Seeded rooms:", rooms);
  console.log("DB Ready at", dbPath);
}

db.close();

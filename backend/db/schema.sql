-- Tables
CREATE TABLE IF NOT EXISTS rooms (
  id       INTEGER PRIMARY KEY,
  name     TEXT    NOT NULL UNIQUE,
  capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id          INTEGER PRIMARY KEY,
  room_id     INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_utc   TEXT    NOT NULL,
  end_utc     TEXT    NOT NULL,
  booker_name TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, start_utc) -- Combo to prevent double booking
);


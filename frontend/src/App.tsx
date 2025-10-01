import { useEffect, useState } from "react";
import {
  getAllRooms,
  getAllFreeSlots,
  postBooking,
  type Room,
  type FreeSlot,
} from "./apiRequests";

type Step = "landing" | "booking" | "personalInfo" | "confirmation";
type Column = { date: string; room: Room };

// Helper functions to format the Date
function fmtLocalISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayISO() {
  return fmtLocalISO(new Date()); // local timezone
}

function addDays(iso: string, days: number) {
  // Parse as local date (avoid Date("YYYY-MM-DD") dvs UTC)
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return fmtLocalISO(date); // back to local YYYY-MM-DD
}

function buildColumns(days: string[], rooms: Room[]): Column[] {
  const cols: Column[] = [];
  for (const d of days) for (const r of rooms) cols.push({ date: d, room: r });
  return cols;
}

function isFreeSlot(
  freeSlots: FreeSlot[],
  roomId: number,
  date: string,
  hour: number
) {
  return freeSlots.some(
    (s) => s.room.id === roomId && s.date === date && s.hour === hour
  );
}

function App() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<{
    roomId: number;
    date: string;
    hour: number;
  } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [startDate, setStartDate] = useState(todayISO());
  const days = [startDate, addDays(startDate, 1), addDays(startDate, 2)];

  useEffect(() => {
    getAllRooms()
      .then(setRooms)
      .catch(() => {});
  }, []);

  useEffect(() => {
    getAllFreeSlots(startDate, days[2])
      .then(setFreeSlots)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  if (step === "landing") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-4xl font-bold mb-8 text-left">Boka ett rum</h1>
          <button
            onClick={() => setStep("booking")}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Boka
          </button>
        </div>
      </div>
    );
  }

  if (step === "booking") {
    const columns = buildColumns(days, rooms);
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Välj en tid</h1>
            <div className="ml-auto flex gap-2">
              <button
                className="border px-3 py-1 rounded"
                onClick={() => setStartDate(addDays(startDate, -3))}
              >
                ◀︎
              </button>
              <span className="text-sm text-gray-600">
                {days[0]} - {days[2]}
              </span>
              <button
                className="border px-3 py-1 rounded"
                onClick={() => setStartDate(addDays(startDate, 3))}
              >
                ▶︎
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div
              className="min-w-[720px] grid"
              style={{
                gridTemplateColumns: `120px repeat(${columns.length}, minmax(160px,1fr))`,
              }}
            >
              {/* header row */}
              <div></div>
              {columns.map((c) => (
                <div
                  key={`${c.date}-${c.room.id}`}
                  className="p-2 border-b bg-white font-medium"
                >
                  {c.date} • {c.room.name} ({c.room.capacity})
                </div>
              ))}

              {/* one row per hour */}
              {hours.map((h) => (
                <div key={`row-${h}`} className="contents">
                  {/* left label */}
                  <div className="p-2 border-r bg-white font-medium">
                    {String(h).padStart(2, "0")}:00
                  </div>
                  {/* cells */}
                  {columns.map((c) => {
                    const free = isFreeSlot(freeSlots, c.room.id, c.date, h);
                    const selected =
                      room &&
                      room.roomId === c.room.id &&
                      room.date === c.date &&
                      room.hour === h;
                    return (
                      <div
                        key={`${c.date}-${c.room.id}-${h}`}
                        className="p-2 border bg-gray-50"
                      >
                        {free ? (
                          <button
                            className={`w-full rounded border px-2 py-2 text-sm ${
                              selected
                                ? "bg-black text-white"
                                : "hover:bg-black hover:text-white"
                            }`}
                            onClick={() =>
                              setRoom({
                                roomId: c.room.id,
                                date: c.date,
                                hour: h,
                              })
                            }
                          >
                            {c.room.name} {String(h).padStart(2, "0")}:00-
                            {String(h + 1).padStart(2, "0")}:00
                          </button>
                        ) : (
                          <div className="text-center text-xs text-gray-400">
                            Upptagen
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={!room}
              onClick={() => setStep("personalInfo")}
              className="px-6 py-2 rounded bg-black text-white disabled:opacity-50"
            >
              Nästa
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (step === "personalInfo") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-4xl font-bold mb-8 text-left">Vem bokar?</h1>
          <p className="font-bold text-left mb-2">Förnamn och efternamn</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skriv ditt fullständiga namn här"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled={!name.trim() || !room}
            onClick={async () => {
              if (!room) return;
              try {
                await postBooking({
                  roomId: room.roomId,
                  date: room.date,
                  hour: room.hour,
                  bookerName: name.trim(),
                });
                setStep("confirmation");
              } catch (e: unknown) {
                if (e instanceof Error) {
                  alert(e.message || "Kunde inte boka");
                } else {
                  alert("Kunde inte boka");
                }
              }
            }}
            className="w-full px-6 py-3 rounded bg-black text-white disabled:opacity-50"
          >
            Boka
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-2xl font-bold mb-8 text-left">
            Ditt rum är nu bokat!
          </h1>
          <p>
            Du är {name} och valde rum {room?.roomId} {room?.date}
            {room?.hour}
          </p>
          <button
            onClick={() => {
              setStep("landing");
              setName("");
            }}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Tillbaka
          </button>
        </div>
      </div>
    );
  }

  return <p>How dig you get here?</p>;
}

export default App;

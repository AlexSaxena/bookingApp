import { useEffect, useState } from "react";
import {
  getAllRooms,
  getAllFreeSlots,
  postBooking,
  type Room,
  type FreeSlot,
} from "./apiRequests";
import RoomFilter from "./RoomFilter";

type Step = "landing" | "booking" | "personalInfo";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

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
    const dayCols = days; // exactly 3 columns
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];

    // helper: free slots for a given day+hour limited by current room filter
    const visibleIdSet = new Set(
      selectedRoomIds.length ? selectedRoomIds : rooms.map((room) => room.id)
    );
    const slotsFor = (date: string, hour: number) =>
      freeSlots.filter(
        (slot) =>
          slot.date === date &&
          slot.hour === hour &&
          visibleIdSet.has(slot.room.id)
      );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          {/* Row 1 Title & Filter */}
          <h1 className="text-2xl font-semibold">Välj en tid</h1>
          <div className="flex-shrink-0">
            <RoomFilter
              rooms={rooms}
              selectedIds={selectedRoomIds}
              onChange={setSelectedRoomIds}
            />
          </div>
          {/* Row 2 date nav */}
          <div className="flex items-center">
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-24 md:gap-10">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                  onClick={() => setStartDate(addDays(startDate, -3))}
                >
                  ◀︎
                </button>
                {/* Formats date to text day-month */}
                <span className="text-sm text-gray-600">
                  {new Date(days[0]).toLocaleDateString("sv-SE", {
                    day: "numeric",
                    month: "short",
                  })}
                  {" - "}
                  {new Date(days[2]).toLocaleDateString("sv-SE", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                  onClick={() => setStartDate(addDays(startDate, 3))}
                >
                  ▶︎
                </button>
              </div>
            </div>
          </div>

          {/* Grid card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="max-h-[calc(100vh-260px)] overflow-auto p-2">
              <div
                className="min-w-[560px] grid"
                style={{
                  gridTemplateColumns: `repeat(${dayCols.length}, minmax(160px, 1fr))`,
                }}
              >
                {/* header row */}
                {dayCols.map((date) => (
                  <div
                    key={`hdr-${date}`}
                    className="px-3 py-2 text-sm text-gray-600 border-b text-center"
                  >
                    {new Date(date).toLocaleDateString("sv-SE", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                ))}

                {/* for each hour, render 3 cells (one per day) */}
                {hours.map((h) =>
                  dayCols.map((d) => {
                    const slotsAt = slotsFor(d, h); // all free rooms for this day+hour
                    return (
                      <div key={`cell-${d}-${h}`} className="p-2 border">
                        {slotsAt.length ? (
                          <div className="flex flex-col gap-2">
                            {slotsAt.map((s) => {
                              const selected =
                                room &&
                                room.roomId === s.room.id &&
                                room.date === d &&
                                room.hour === h;
                              return (
                                <button
                                  key={`btn-${s.room.id}-${d}-${h}`}
                                  onClick={() =>
                                    setRoom({
                                      roomId: s.room.id,
                                      date: d,
                                      hour: h,
                                    })
                                  }
                                  className={`w-full rounded-lg px-3 py-2 text-sm font-medium border transition
                                  ${
                                    selected
                                      ? "bg-emerald-700 text-white border-emerald-700"
                                      : "bg-white text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                                  }`}
                                >
                                  {s.room.name} {"("} {s.room.capacity} {")"}
                                  <br />
                                  {String(h).padStart(2, "0")}:00-
                                  {String(h + 1).padStart(2, "0")}:00
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="w-full rounded-lg px-3 py-2 text-center text-xs text-gray-400 border border-dashed bg-gray-50">
                            {/* empty cell */}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center">
            <button
              disabled={!room}
              onClick={() => setStep("personalInfo")}
              className="w-full md:w-2xl px-6 py-2 rounded-lg bg-black text-white disabled:opacity-50"
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
                setConfirmOpen(true);
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
        {confirmOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 grid place-items-center bg-black/40"
          >
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm text-center">
              <div className="text-lg font-semibold mb-2">
                <p>Ditt rum är bokat!</p>
                <p>😃</p>
              </div>
              <button
                className="mt-2 px-4 py-2 rounded bg-black text-white"
                onClick={async () => {
                  setConfirmOpen(false);
                  setRoom(null);
                  await getAllFreeSlots(startDate, addDays(startDate, 2)).then(
                    setFreeSlots
                  );
                  setStep("landing");
                }}
              >
                Tillbaka
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <p>How did you get here?</p>;
}

export default App;

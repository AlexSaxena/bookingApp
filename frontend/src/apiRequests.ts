export type Room = { id: number; name: string; capacity: number };
export type FreeSlot = { date: string; hour: number; room: Room };
export type BookingResp = {
  id: number;
  roomId: number;
  startUtc: string;
  endUtc: string;
  bookerName: string;
};

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function getAllRooms(): Promise<Room[]> {
  const resp = await fetch(`${BASE}/api/rooms`);
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || "Failed to fetch rooms");
  return data;
}

export async function getAllFreeSlots(
  from: string,
  to: string,
  roomIds?: number[]
): Promise<FreeSlot[]> {
  const query = new URLSearchParams({ from, to });
  if (roomIds?.length) query.set("roomIds", roomIds.join(","));
  const resp = await fetch(`${BASE}/api/free-slots?${query.toString()}`);
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || "Failed to fetch free slots");
  return data;
}

export async function postBooking(body: {
  roomId: number;
  date: string;
  hour: number;
  bookerName: string;
}): Promise<BookingResp> {
  const resp = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data?.error || "Failed to create booking";
    const err = new Error(msg) as Error & {
      status?: number;
      details?: unknown;
    };
    (err.status as number | undefined) = resp.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

import { useEffect, useRef, useState } from "react";
import type { Room } from "./apiRequests";

export default function RoomFilter({
  rooms,
  selectedIds,
  onChange,
}: {
  rooms: Room[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<Set<number>>(new Set(selectedIds));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setTemp(new Set(selectedIds)), [selectedIds]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = selectedIds.length
    ? `${selectedIds.length} valda rum`
    : "Mötesrum";
  const toggle = (id: number) => {
    setTemp((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5
                   text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg p-3">
          <ul className="max-h-60 overflow-auto space-y-1">
            {rooms.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between px-1 py-1"
              >
                <label className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/50"
                    checked={temp.has(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                  <span>
                    {r.name} ({r.capacity})
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex gap-2 justify-evenly">
            <button
              className="w-[40%] inline-flex justify-center rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white
                         hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
              onClick={() => {
                onChange(Array.from(temp));
                setOpen(false);
              }}
            >
              Välj
            </button>
            <button
              className="w-[40%] inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium
                         text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              onClick={() => {
                setTemp(new Set());
                onChange([]);
                setOpen(false);
              }}
            >
              Avmarkera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

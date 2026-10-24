import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createSlot,
  deleteSlot,
  fetchTherapistSlots,
} from "../../api/availability";
import type { AvailabilitySlot } from "../../types";

// TODAY AS YYYY-MM-DD IN THE USER'S LOCAL TIME (used as the minimum date)
function todayString(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// "2026-10-25" -> "Sunday, 25 October 2026" (parsed as local time to avoid day shifts)
function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MyAvailability() {
  const { user } = useAuth();

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // LOAD THE THERAPIST'S SLOTS
  useEffect(() => {
    if (!user) return;
    let active = true;

    fetchTherapistSlots(user.id)
      .then((data) => {
        if (active) setSlots(data);
      })
      .catch(() => {
        if (active) setError("We couldn't load your availability.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  // ADD A NEW SLOT
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!date) return setFormError("Please choose a date");
    if (!startTime) return setFormError("Please choose a start time");
    if (!endTime) return setFormError("Please choose an end time");
    if (endTime <= startTime)
      return setFormError("End time must be after start time");

    const overlaps = slots.some(
      (s) => s.date === date && startTime < s.endTime && endTime > s.startTime,
    );
    if (overlaps) return setFormError("This overlaps with an existing slot");

    setSaving(true);
    try {
      const created = await createSlot({ date, startTime, endTime });
      setSlots((prev) => [...prev, created]);
      setStartTime("");
      setEndTime("");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "We couldn't add the slot",
      );
    } finally {
      setSaving(false);
    }
  }

  // DELETE A SLOT
  async function handleDelete(id: string) {
    if (!window.confirm("Delete this slot?")) return;
    setError("");

    try {
      await deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't delete the slot",
      );
    }
  }

  // SORT BY DATE THEN TIME, THEN GROUP BY DATE
  const sorted = [...slots].sort((a, b) =>
    `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
  );
  const grouped = sorted.reduce<Record<string, AvailabilitySlot[]>>(
    (acc, slot) => {
      (acc[slot.date] ??= []).push(slot);
      return acc;
    },
    {},
  );

  const inputClass = "w-full rounded-xl border px-4 py-2.5";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-heading">
        My availability
      </h1>

      {/* ADD SLOT FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mb-8 rounded-xl border p-4"
      >
        <h2 className="mb-4 font-medium text-heading">Add a slot</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-heading">
              Date
            </label>
            <input
              id="date"
              type="date"
              min={todayString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="startTime" className="mb-1.5 block text-sm font-medium text-heading">
              Start time
            </label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="endTime" className="mb-1.5 block text-sm font-medium text-heading">
              End time
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {formError && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-button-text hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Adding..." : "Add slot"}
        </button>
      </form>

      {/* SLOT LIST */}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-muted">Loading your availability...</p>
      ) : slots.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted">
          You haven't added any slots yet.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([slotDate, daySlots]) => (
            <section key={slotDate}>
              <h3 className="mb-2 text-sm font-semibold text-heading">
                {formatDate(slotDate)}
              </h3>

              <ul className="space-y-2">
                {daySlots.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between gap-4 rounded-xl border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-heading">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          slot.isBooked
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(slot.id)}
                      disabled={slot.isBooked}
                      title={
                        slot.isBooked
                          ? "Booked slots can't be deleted"
                          : "Delete slot"
                      }
                      className="cursor-pointer text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAvailability;
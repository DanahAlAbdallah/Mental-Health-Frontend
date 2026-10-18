import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createSlot,
  fetchTherapistSlots,
  deleteSlot,
} from "../api/availability";
import type { AvailabilitySlot } from "../types";

// STYLE SHARED BY THE DATE AND TIME FIELDS, SO WE WRITE IT ONLY ONCE
const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function AvailabilityPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // RUNS WHEN THE PAGE OPENS: LOADS THE THERAPIST'S SLOTS FROM THE BACKEND
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchTherapistSlots(user.id)
      .then(setSlots)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load slots"),
      )
      .finally(() => setLoading(false));
  }, [user]);

  // RUNS WHEN THE USER CLICKS "ADD SLOT": SAVES THE NEW SLOT,
  // ADDS IT TO THE LIST AND CLEARS THE FORM, OR SHOWS THE ERROR IF IT FAILS
  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdding(true);

    try {
      const newSlot = await createSlot({ date, startTime, endTime });
      setSlots((current) => [...current, newSlot]);
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAdding(false);
    }
  }

  // RUNS WHEN THE USER CLICKS "REMOVE": DELETES THE SLOT FROM THE BACKEND,
  // THEN TAKES IT OUT OF THE LIST, OR SHOWS THE ERROR IF IT FAILS
  async function handleDelete(id: string) {
    setError("");

    try {
      await deleteSlot(id);
      setSlots((current) => current.filter((slot) => slot.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (loading) {
    return <div className="p-8">Loading availability...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* HEADER */}
        <header className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Therapist dashboard
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
            My Availability
          </h1>

          <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
            Manage your available hours and let clients find a time that works
            for them.
          </p>
        </header>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ADD AVAILABILITY */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-heading">
              Add availability
            </h2>

            <p className="mt-1 text-sm text-muted">
              Choose a date and the hours you are available.
            </p>
          </div>

          <form
            onSubmit={handleAddSlot}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
          >
            {/* DATE */}
            <div className="space-y-2">
              <label
                htmlFor="availability-date"
                className="block text-sm font-medium text-heading"
              >
                Date
              </label>
              <input
                id="availability-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* START TIME */}
            <div className="space-y-2">
              <label
                htmlFor="availability-start"
                className="block text-sm font-medium text-heading"
              >
                Start time
              </label>
              <input
                id="availability-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* END TIME */}
            <div className="space-y-2">
              <label
                htmlFor="availability-end"
                className="block text-sm font-medium text-heading"
              >
                End time
              </label>
              <input
                id="availability-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* ADD BUTTON */}
            <button
              type="submit"
              disabled={adding}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="text-lg leading-none">+</span>
              {adding ? "Adding..." : "Add slot"}
            </button>
          </form>
        </section>

        {/* AVAILABILITY LIST */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-heading">
                Your time slots
              </h2>

              <p className="mt-1 text-sm text-muted">
                Review and manage your scheduled availability.
              </p>
            </div>

            <span className="rounded-full bg-surface-soft px-3 py-1.5 text-sm font-medium text-muted">
              {slots.length} {slots.length === 1 ? "slot" : "slots"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {slots.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                    <path d="M12 13v4M10 15h4" />
                  </svg>
                </div>

                <h3 className="font-semibold text-heading">
                  No availability yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                  Add your first time slot above to let clients know when you're
                  available.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col gap-4 p-4 transition hover:bg-surface-soft/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-primary">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <p className="font-medium text-heading">{slot.date}</p>
                        <p className="text-sm text-muted">
                          {slot.startTime} – {slot.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      {slot.isBooked ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-surface-soft px-3 py-1.5 text-xs font-medium text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Booked
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-2 rounded-full bg-surface-soft px-3 py-1.5 text-xs font-medium text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Available
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDelete(slot.id)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
                            aria-label={`Delete availability for ${slot.date}, ${slot.startTime} to ${slot.endTime}`}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AvailabilityPage;

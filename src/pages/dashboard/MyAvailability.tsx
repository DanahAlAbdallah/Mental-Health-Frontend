import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CalendarPlus,
  Check,
  CircleCheck,
  Lock,
  Repeat,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { createSlot, deleteSlot, fetchMySlots } from "../../api/availability";
import type { AvailabilitySlot } from "../../types";

// ---------- HELPERS ----------

function formatLocal(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function todayString(): string {
  return formatLocal(new Date());
}

// ADD DAYS TO A YYYY-MM-DD DATE (LOCAL TIME, SO NO DAY SHIFTS)
function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return formatLocal(d);
}

// "09:30" + 60 -> "10:30". RETURNS null IF IT PASSES MIDNIGHT
function addMinutes(time: string, minutes: number): string | null {
  const [h, m] = time.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + minutes;
  if (total >= 24 * 60) return null;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh ?? 0) * 60 + (em ?? 0) - ((sh ?? 0) * 60 + (sm ?? 0));
}

function dayLabel(date: string): string {
  const today = todayString();
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
  });
}

function fullDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function shortDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const DURATIONS = [30, 45, 60, 90];
const REPEATS = [
  { weeks: 1, label: "Just once" },
  { weeks: 2, label: "2 weeks" },
  { weeks: 4, label: "4 weeks" },
  { weeks: 8, label: "8 weeks" },
];

type Filter = "all" | "available" | "booked";

// ---------- SMALL COMPONENTS ----------

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-heading">{value}</p>
        <p className="mt-1 text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-button-text"
          : "border-border bg-background text-heading hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

// ---------- PAGE ----------

function MyAvailability() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [date, setDate] = useState(todayString());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [weeks, setWeeks] = useState(1);

  // LOAD ALL MY SLOTS (BOOKED OR NOT)
  useEffect(() => {
    let active = true;

    fetchMySlots()
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
  }, []);

  const endTime = startTime ? addMinutes(startTime, duration) : null;

  // ADD ONE SLOT, OR THE SAME SLOT REPEATED WEEKLY
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    if (!date) return setFormError("Please choose a date");
    if (!startTime) return setFormError("Please choose a start time");
    if (!endTime) return setFormError("This session would run past midnight");

    if (date === todayString()) {
      const now = new Date();
      const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`;
      if (startTime <= nowTime) {
        return setFormError("That start time has already passed today");
      }
    }

    const dates = Array.from({ length: weeks }, (_, i) => addDays(date, i * 7));

    setSaving(true);

    const working = [...slots];
    const added: AvailabilitySlot[] = [];
    const skipped: string[] = [];

    for (const d of dates) {
      const overlaps = working.some(
        (s) => s.date === d && startTime < s.endTime && endTime > s.startTime,
      );
      if (overlaps) {
        skipped.push(shortDate(d));
        continue;
      }

      try {
        const created = await createSlot({ date: d, startTime, endTime });
        working.push(created);
        added.push(created);
      } catch {
        skipped.push(shortDate(d));
      }
    }

    setSlots(working);
    setSaving(false);

    if (added.length === 0) {
      setFormError(
        skipped.length > 0
          ? `Nothing was added. It overlaps with existing slots on: ${skipped.join(", ")}.`
          : "We couldn't add the slot.",
      );
      return;
    }

    setSuccess(
      `Added ${added.length} slot${added.length === 1 ? "" : "s"}.` +
        (skipped.length > 0
          ? ` Skipped (overlap or error): ${skipped.join(", ")}.`
          : ""),
    );
    setStartTime("");
  }

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

  // ---------- DERIVED DATA ----------
  const today = todayString();

  const upcoming = slots
    .filter((s) => s.date >= today)
    .sort((a, b) =>
      `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
    );

  const availableCount = upcoming.filter((s) => !s.isBooked).length;
  const bookedCount = upcoming.filter((s) => s.isBooked).length;

  const visible = upcoming.filter((s) =>
    filter === "all" ? true : filter === "booked" ? s.isBooked : !s.isBooked,
  );

  const grouped = visible.reduce<Record<string, AvailabilitySlot[]>>(
    (acc, slot) => {
      (acc[slot.date] ??= []).push(slot);
      return acc;
    },
    {},
  );

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: upcoming.length },
    { id: "available", label: "Available", count: availableCount },
    { id: "booked", label: "Booked", count: bookedCount },
  ];

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-heading">My availability</h1>
        <p className="mt-1 text-sm text-muted">
          Add the times clients can book. Booked slots are locked until the
          session is cancelled.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <Stat
          icon={CalendarClock}
          label="Upcoming slots"
          value={upcoming.length}
          tone="bg-primary/10 text-primary"
        />
        <Stat
          icon={CircleCheck}
          label="Available"
          value={availableCount}
          tone="bg-green-100 text-green-700"
        />
        <Stat
          icon={Lock}
          label="Booked"
          value={bookedCount}
          tone="bg-amber-100 text-amber-700"
        />
      </div>

      {/* ADD SLOT */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <CalendarPlus className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-heading">Add availability</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
            <div className="mt-2 flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDate(today)}
                className="cursor-pointer font-medium text-primary hover:underline"
              >
                Today
              </button>
              <span className="text-muted">·</span>
              <button
                type="button"
                onClick={() => setDate(addDays(today, 1))}
                className="cursor-pointer font-medium text-primary hover:underline"
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="startTime"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
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
        </div>

        {/* SESSION LENGTH */}
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-heading">
            Session length
          </p>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <Chip
                key={d}
                active={duration === d}
                onClick={() => setDuration(d)}
              >
                {d} min
              </Chip>
            ))}
          </div>
        </div>

        {/* REPEAT */}
        <div className="mt-5">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-heading">
            <Repeat className="h-4 w-4 text-muted" />
            Repeat weekly
          </p>
          <div className="flex flex-wrap gap-2">
            {REPEATS.map((r) => (
              <Chip
                key={r.weeks}
                active={weeks === r.weeks}
                onClick={() => setWeeks(r.weeks)}
              >
                {r.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* PREVIEW */}
        {date && startTime && endTime && (
          <div className="mt-5 rounded-xl bg-primary/10 px-4 py-3 text-sm text-heading">
            <span className="font-semibold">Preview:</span> {shortDate(date)},{" "}
            {startTime} - {endTime}
            {weeks > 1 && (
              <span className="text-muted">
                {" "}
                · repeats every week for {weeks} weeks ({weeks} slots)
              </span>
            )}
          </div>
        )}

        {formError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        {success && (
          <p className="mt-4 flex items-start gap-2 text-sm text-green-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-button-text shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Adding..." : weeks > 1 ? `Add ${weeks} slots` : "Add slot"}
        </button>
      </form>

      {/* SLOT LIST */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-heading">Your schedule</h2>

          <div className="flex gap-1 rounded-full bg-background-soft p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.id
                    ? "bg-surface text-primary shadow-sm"
                    : "text-muted hover:text-heading"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-black/5" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
            <CalendarClock className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">
              {upcoming.length === 0
                ? "No upcoming slots yet. Add your first one above."
                : "No slots match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([slotDate, daySlots]) => (
              <section key={slotDate}>
                <div className="mb-2 flex items-baseline gap-2">
                  <h3 className="font-semibold text-heading">
                    {dayLabel(slotDate)}
                  </h3>
                  <span className="text-sm text-muted">
                    {fullDate(slotDate)}
                  </span>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {daySlots.map((slot) => (
                    <li
                      key={slot.id}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-shadow hover:shadow-sm ${
                        slot.isBooked
                          ? "border-amber-200 bg-amber-50"
                          : "border-border bg-surface"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-heading">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs">
                          {slot.isBooked ? (
                            <>
                              <Lock className="h-3 w-3 text-amber-700" />
                              <span className="font-medium text-amber-800">
                                Booked
                              </span>
                              <Link
                                to="/dashboard/sessions"
                                className="font-medium text-primary hover:underline"
                              >
                                View session
                              </Link>
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="font-medium text-green-700">
                                Available
                              </span>
                              <span className="text-muted">
                                · {minutesBetween(slot.startTime, slot.endTime)}{" "}
                                min
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      {!slot.isBooked && (
                        <button
                          onClick={() => handleDelete(slot.id)}
                          aria-label={`Delete slot ${slot.startTime} to ${slot.endTime}`}
                          className="cursor-pointer rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAvailability;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTherapistSlots } from "../api/availability";
import type { AvailabilitySlot } from "../types";

function TherapistDetailPage() {
  const { id } = useParams();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchTherapistSlots(id).then((data) => {
      setSlots(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading available times...</div>;
  }


return (
  <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-4xl space-y-8">

      {/* Back navigation */}
      <Link
        to="/therapists"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md"
      >
        <span aria-hidden="true">←</span>
        Back to therapists
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <p className="text-sm font-medium text-primary">
          Your next step
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
          Available Times
        </h1>

        <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
          Choose a time that works for you and take a moment for your well-being.
        </p>
      </header>

      {/* Available slots */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-semibold text-heading">
            Open appointments
          </h2>

          <span className="rounded-full bg-surface-soft px-3 py-1.5 text-sm font-medium text-muted">
            {slots.length} {slots.length === 1 ? "time slot" : "time slots"}
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-5 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-primary">
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

            <h2 className="font-semibold text-heading">
              No available times
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              There are no open appointments right now. Please check back later.
            </p>

            <Link
              to="/therapists"
              className="mt-5 inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-surface-soft"
            >
              Explore other therapists
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
              >
                {/* Time icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>

                {/* Date and time */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-heading">
                    {slot.date}
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    {slot.startTime} – {slot.endTime}
                  </p>
                </div>

                {/* Availability indicator */}
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-primary"
                  aria-label="Available"
                  title="Available"
                />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  </div>
);


}

export default TherapistDetailPage;

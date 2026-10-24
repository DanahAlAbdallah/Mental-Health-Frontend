import { useEffect, useState } from "react";

import { Calendar, Clock, User } from "lucide-react";
import { fetchMySessions, updateSessionStatus } from "../api/sessions";
import type { Session } from "../types";
import { Link } from "react-router-dom";


type Tab = "pending" | "upcoming" | "history";

// A SESSION IS OVER WHEN ITS END TIME HAS PASSED
function hasEnded(session: Session): boolean {
  return new Date(`${session.date}T${session.endTime}:00`) < new Date();
}

function sortKey(session: Session): string {
  return `${session.date} ${session.startTime}`;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function durationMinutes(session: Session): number {
  const start = new Date(`${session.date}T${session.startTime}:00`);
  const end = new Date(`${session.date}T${session.endTime}:00`);
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

// BADGE AND EXPLANATION SHOWN FOR EACH STATUS
function statusInfo(session: Session): {
  label: string;
  badge: string;
  message: string;
} {
  if (session.status === "pending" && hasEnded(session)) {
    return {
      label: "Expired",
      badge: "bg-gray-100 text-gray-700",
      message: "The therapist didn't respond before this time passed.",
    };
  }

  switch (session.status) {
    case "pending":
      return {
        label: "Pending",
        badge: "bg-amber-100 text-amber-800",
        message: "Waiting for the therapist to confirm your request.",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        badge: "bg-green-100 text-green-800",
        message: "Your session is confirmed. See you then!",
      };
    case "rejected":
      return {
        label: "Declined",
        badge: "bg-red-100 text-red-800",
        message:
          "The therapist couldn't accept this request. You can book another time.",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        badge: "bg-gray-100 text-gray-700",
        message: "This session was cancelled.",
      };
  }
}

function MyBookings() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchMySessions()
      .then((data) => {
        if (active) setSessions(data);
      })
      .catch(() => {
        if (active) setError("We couldn't load your sessions.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleCancel(session: Session) {
    const message =
      session.status === "pending"
        ? "Cancel this session request?"
        : "Cancel this confirmed session? The therapist will be notified.";
    if (!window.confirm(message)) return;

    setError("");
    setBusyId(session.id);
    try {
      const updated = await updateSessionStatus(session.id, "cancelled");
      // KEEP THE NAMES THE SERVER ADDED TO THE LIST RESPONSE
      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? { ...s, ...updated } : s)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't cancel the session.",
      );
    } finally {
      setBusyId(null);
    }
  }

  // SPLIT THE SESSIONS INTO THE THREE TABS
  const pending = sessions
    .filter((s) => s.status === "pending" && !hasEnded(s))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const upcoming = sessions
    .filter((s) => s.status === "confirmed" && !hasEnded(s))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const history = sessions
    .filter((s) => !pending.includes(s) && !upcoming.includes(s))
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

  const lists: Record<Tab, Session[]> = { pending, upcoming, history };
  const visible = lists[tab];

  const tabs: { id: Tab; label: string }[] = [
    { id: "pending", label: "Requested" },
    { id: "upcoming", label: "Upcoming" },
    { id: "history", label: "History" },
  ];

  const emptyText: Record<Tab, string> = {
    pending: "You have no pending requests.",
    upcoming: "You have no upcoming sessions.",
    history: "No past sessions yet.",
  };

  if (loading) return <p className="text-muted">Loading your sessions...</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-heading">My sessions</h1>
        <Link
          to="/therapists"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-button-text hover:bg-primary-hover"
        >
          Book a session
        </Link>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-heading"
            }`}
          >
            {t.label}
            <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-xs">
              {lists[t.id].length}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* LIST */}
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="mb-3 text-muted">{emptyText[tab]}</p>
          {tab !== "history" && (
            <Link to="/therapists" className="font-medium text-primary">
              Find a therapist
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((session) => {
            const info = statusInfo(session);
            const busy = busyId === session.id;
            const canCancel =
              !hasEnded(session) &&
              (session.status === "pending" || session.status === "confirmed");

            return (
              <li
                key={session.id}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                {/* HEADER */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-heading">
                    {session.therapistName ?? "Therapist"}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${info.badge}`}
                  >
                    {info.label}
                  </span>
                </div>

                {/* DETAILS */}
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-heading">
                    <Calendar className="h-4 w-4 shrink-0 text-muted" />
                    <dd>{formatDate(session.date)}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-heading">
                    <Clock className="h-4 w-4 shrink-0 text-muted" />
                    <dd>
                      {session.startTime} - {session.endTime} (
                      {durationMinutes(session)} min)
                    </dd>
                  </div>
                  <div className="flex items-center gap-2 text-muted sm:col-span-2">
                    <User className="h-4 w-4 shrink-0" />
                    <dd>
                      Requested on{" "}
                      {new Date(session.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>

                {/* STATUS MESSAGE */}
                <p className="mt-4 rounded-xl bg-background-soft px-4 py-3 text-sm text-heading/80">
                  {info.message}
                </p>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link
                    to={`/therapists/${session.therapistId}`}
                    className="font-medium text-primary"
                  >
                    View therapist
                  </Link>

                  {canCancel && (
                    <button
                      disabled={busy}
                      onClick={() => handleCancel(session)}
                      className="cursor-pointer font-medium text-red-600 disabled:opacity-60"
                    >
                      {busy ? "Cancelling..." : "Cancel"}
                    </button>
                  )}

                  {session.status === "rejected" && (
                    <Link to="/therapists" className="font-medium text-primary">
                      Book another time
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyBookings;

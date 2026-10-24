import { useEffect, useState } from "react";
import { fetchMySessions, updateSessionStatus } from "../../api/sessions";
import type { Session } from "../../types";

type Tab = "requests" | "upcoming" | "history";

// A SESSION IS OVER WHEN ITS END TIME HAS PASSED
function hasEnded(session: Session): boolean {
  return new Date(`${session.date}T${session.endTime}:00`) < new Date();
}

function sortKey(session: Session): string {
  return `${session.date} ${session.startTime}`;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusBadge(session: Session): { label: string; className: string } {
  if (session.status === "pending" && hasEnded(session)) {
    return { label: "Expired", className: "bg-gray-100 text-gray-700" };
  }
  switch (session.status) {
    case "pending":
      return { label: "Pending", className: "bg-amber-100 text-amber-800" };
    case "confirmed":
      return { label: "Confirmed", className: "bg-green-100 text-green-800" };
    case "rejected":
      return { label: "Rejected", className: "bg-red-100 text-red-800" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-gray-100 text-gray-700" };
  }
}

function MySessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("requests");
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

  async function changeStatus(
    id: string,
    status: "confirmed" | "rejected" | "cancelled",
    confirmMessage?: string,
  ) {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setError("");
    setBusyId(id);
    try {
      const updated = await updateSessionStatus(id, status);
      // KEEP THE NAMES THE SERVER ADDED TO THE LIST RESPONSE
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't update the session.",
      );
    } finally {
      setBusyId(null);
    }
  }

  // SPLIT THE SESSIONS INTO THE THREE TABS
  const requests = sessions
    .filter((s) => s.status === "pending" && !hasEnded(s))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const upcoming = sessions
    .filter((s) => s.status === "confirmed" && !hasEnded(s))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const history = sessions
    .filter((s) => !requests.includes(s) && !upcoming.includes(s))
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

  const lists: Record<Tab, Session[]> = { requests, upcoming, history };
  const visible = lists[tab];

  const tabs: { id: Tab; label: string }[] = [
    { id: "requests", label: "Requests" },
    { id: "upcoming", label: "Upcoming" },
    { id: "history", label: "History" },
  ];

  const emptyText: Record<Tab, string> = {
    requests: "No pending requests.",
    upcoming: "No upcoming sessions.",
    history: "No past sessions yet.",
  };

  if (loading) return <p className="text-muted">Loading your sessions...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-heading">My sessions</h1>

      {/* TABS */}
      <div className="mb-6 flex gap-2 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition ${
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
        <div className="rounded-xl border border-dashed p-10 text-center text-muted">
          {emptyText[tab]}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((session) => {
            const badge = statusBadge(session);
            const busy = busyId === session.id;
            const canCancel =
              !hasEnded(session) &&
              (session.status === "pending" || session.status === "confirmed");

            return (
              <li
                key={session.id}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-heading">
                      {session.patientName ?? "Client"}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {formatDate(session.date)} · {session.startTime} -{" "}
                    {session.endTime}
                  </p>
                </div>

                <div className="flex shrink-0 gap-3 text-sm">
                  {session.status === "pending" && !hasEnded(session) && (
                    <>
                      <button
                        disabled={busy}
                        onClick={() => changeStatus(session.id, "confirmed")}
                        className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 font-semibold text-button-text hover:bg-primary-hover disabled:opacity-60"
                      >
                        Confirm
                      </button>
                      <button
                        disabled={busy}
                        onClick={() =>
                          changeStatus(
                            session.id,
                            "rejected",
                            "Reject this session request?",
                          )
                        }
                        className="cursor-pointer rounded-lg border px-3 py-1.5 font-medium text-red-600 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {session.status === "confirmed" && canCancel && (
                    <button
                      disabled={busy}
                      onClick={() =>
                        changeStatus(
                          session.id,
                          "cancelled",
                          "Cancel this confirmed session? The time slot will become available again.",
                        )
                      }
                      className="cursor-pointer rounded-lg border px-3 py-1.5 font-medium text-red-600 disabled:opacity-60"
                    >
                      Cancel session
                    </button>
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

export default MySessions;

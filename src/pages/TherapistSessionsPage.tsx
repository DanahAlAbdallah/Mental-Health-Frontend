import { useEffect, useState } from "react";
import { fetchMySessions, updateSessionStatus } from "../api/sessions";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";
import type { Session } from "../types";

// THE TWO ANSWERS A THERAPIST CAN GIVE TO A SESSION REQUEST
type Decision = "confirmed" | "rejected";

function TherapistSessionsPage() {
  const { token } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const pendingSessions = sessions.filter(
    (session) => session.status === "pending",
  );

  const confirmedSessions = sessions.filter(
    (session) => session.status === "confirmed",
  );

  // RUNS WHEN THE PAGE OPENS: LOADS THE THERAPIST'S SESSIONS FROM THE BACKEND,
  // OR SHOWS AN ERROR IF THE USER IS NOT LOGGED IN OR THE REQUEST FAILS
  useEffect(() => {
    async function loadSessions() {
      if (!token) {
        setError("Please log in to view your sessions.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchMySessions();
        setSessions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your sessions.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [token]);

  // RUNS WHEN THE THERAPIST CLICKS "CONFIRM" OR "REJECT": SENDS THE ANSWER,
  // RELOADS THE LIST AND SHOWS A MESSAGE WITH THE RESULT
  async function handleDecision(sessionId: string, status: Decision) {
    if (!token) return;

    setActionLoading(sessionId);
    setActionMessage("");

    try {
      await updateSessionStatus(sessionId, status);

      const updatedSessions = await fetchMySessions();
      setSessions(updatedSessions);

      setActionMessage(
        status === "confirmed"
          ? "Session confirmed successfully."
          : "Session request rejected. The time slot should now be available again.",
      );
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Could not update the session.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-sm font-medium text-primary">Your practice</p>

          <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
            My Sessions
          </h1>

          <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
            Review appointment requests and keep track of your upcoming
            sessions.
          </p>
        </header>

        {/* RESULT OF THE LAST ACTION*/}
        {actionMessage && (
          <p
            role="status"
            className="rounded-xl border border-border bg-background-soft p-4 text-sm text-heading"
          >
            {actionMessage}
          </p>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-border bg-background-soft p-4 text-sm text-heading"
          >
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-muted">
            Loading your sessions...
          </p>
        ) : (
          !error && (
            <>
              {/* PENDING REQUESTS */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-xl font-semibold text-heading">
                    Pending Requests
                  </h2>

                  <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-button-text">
                    {pendingSessions.length}
                  </span>
                </div>

                {pendingSessions.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center">
                    <h3 className="font-semibold text-heading">
                      No pending requests
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      New session requests from your clients will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {pendingSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        actionLoading={actionLoading === session.id}
                        onDecision={handleDecision}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* CONFIRMED SESSIONS */}
              <section className="space-y-4">
                <div className="border-b border-border pb-3">
                  <h2 className="text-xl font-semibold text-heading">
                    Confirmed Sessions
                  </h2>
                </div>

                {confirmedSessions.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-surface px-5 py-8 text-center text-sm text-muted">
                    You don't have any confirmed sessions yet.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {confirmedSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )
        )}
      </div>
    </main>
  );
}

// ONE SESSION CARD: SHOWS THE DATE, TIME AND STATUS,
// AND THE CONFIRM / REJECT BUTTONS ONLY WHEN THE SESSION IS STILL PENDING
function SessionCard({
  session,
  actionLoading = false,
  onDecision,
}: {
  session: Session;
  actionLoading?: boolean;
  onDecision?: (sessionId: string, status: Decision) => void;
}) {
  const isPending = session.status === "pending";

  // SESSION CARD DESIGN
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-heading">Session request</p>

          <p className="mt-1 text-sm text-muted">
            Date: {formatDate(session.date)}
          </p>

          <p className="mt-1 text-sm text-muted">
            Time: {session.startTime} – {session.endTime}
          </p>
        </div>

        <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium capitalize text-heading">
          {session.status}
        </span>
      </div>

      {isPending && onDecision && (
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => onDecision(session.id, "confirmed")}
            disabled={actionLoading}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-button-text transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? "Updating..." : "Confirm"}
          </button>

          <button
            type="button"
            onClick={() => onDecision(session.id, "rejected")}
            disabled={actionLoading}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-background-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </article>
  );
}

export default TherapistSessionsPage;

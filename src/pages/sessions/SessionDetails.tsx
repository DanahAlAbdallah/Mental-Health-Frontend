import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Clock,
  Hourglass,
  Languages,
  Mail,
  MapPin,
  Phone,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchSessionById, updateSessionStatus } from "../../api/sessions";
import type { SessionDetail } from "../../types";

// ---------- HELPERS ----------

function hasEnded(s: { date: string; endTime: string }): boolean {
  return new Date(`${s.date}T${s.endTime}:00`) < new Date();
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusInfo(s: {
  status: SessionDetail["status"];
  date: string;
  endTime: string;
}): { label: string; badge: string } {
  if (s.status === "pending" && hasEnded(s)) {
    return { label: "Expired", badge: "bg-gray-100 text-gray-700" };
  }
  switch (s.status) {
    case "pending":
      return { label: "Pending", badge: "bg-amber-100 text-amber-800" };
    case "confirmed":
      return { label: "Confirmed", badge: "bg-green-100 text-green-800" };
    case "rejected":
      return { label: "Declined", badge: "bg-red-100 text-red-800" };
    case "cancelled":
      return { label: "Cancelled", badge: "bg-gray-100 text-gray-700" };
  }
}

function Avatar({
  name,
  url,
  size = "h-16 w-16",
}: {
  name: string;
  url?: string | null;
  size?: string;
}) {
  if (url) {
    return (
      <img src={url} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
    );
  }
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-button-text`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-background-soft p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 font-semibold text-heading">{value}</p>
      </div>
    </div>
  );
}

// ---------- PAGE ----------

function SessionDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const isTherapist = user?.role === "therapist";

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setSession(await fetchSessionById(id));
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  // CHANGE THE STATUS, THEN RELOAD (THE SERVER DECIDES WHAT CONTACT DETAILS TO SHOW)
  async function changeStatus(
    status: "confirmed" | "rejected" | "cancelled",
    message?: string,
  ) {
    if (!session) return;
    if (message && !window.confirm(message)) return;

    setError("");
    setBusy(true);
    try {
      await updateSessionStatus(session.id, status);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't update the session.",
      );
    } finally {
      setBusy(false);
    }
  }

  const backTo = isTherapist ? "/dashboard/sessions" : "/my-sessions";
  const wrapper = isTherapist ? "" : "mx-auto max-w-3xl px-4 py-8";

  if (loading) {
    return (
      <div className={wrapper}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-black/5" />
          <div className="h-48 rounded-2xl bg-black/5" />
          <div className="h-56 rounded-2xl bg-black/5" />
        </div>
      </div>
    );
  }

  if (failed || !session) {
    return (
      <div className={wrapper}>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <h1 className="text-lg font-semibold text-heading">
            We couldn't open this session
          </h1>
          <p className="text-sm text-muted">
            It may not exist, or it isn't one of your sessions.
          </p>
          <Link
            to={backTo}
            className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-button-text hover:bg-primary-hover"
          >
            Back to sessions
          </Link>
        </div>
      </div>
    );
  }

  const info = statusInfo(session);
  const upcoming = !hasEnded(session);
  const online = session.sessionType === "online";
  const { therapist, patient } = session;

  const canRespond = isTherapist && session.status === "pending" && upcoming;
  const canCancel =
    upcoming && (session.status === "pending" || session.status === "confirmed");

  return (
    <div className={wrapper}>
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        All sessions
      </Link>

      {/* SESSION CARD */}
      <section className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-heading">Session details</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${info.badge}`}
          >
            {info.label}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Fact icon={CalendarDays} label="Date" value={formatDate(session.date)} />
          <Fact
            icon={Clock}
            label="Time"
            value={`${session.startTime} - ${session.endTime}`}
          />
          <Fact
            icon={Hourglass}
            label="Duration"
            value={`${session.durationMinutes} minutes`}
          />
          <Fact
            icon={online ? Video : MapPin}
            label="Session type"
            value={online ? "Online" : "In person"}
          />
        </div>

        {!online && therapist.location && (
          <p className="mt-4 flex items-center gap-2 text-sm text-heading">
            <MapPin className="h-4 w-4 text-muted" />
            Location: {therapist.location}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {(canRespond || canCancel) && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
            {canRespond && (
              <>
                <button
                  disabled={busy}
                  onClick={() => changeStatus("confirmed")}
                  className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-button-text hover:bg-primary-hover disabled:opacity-60"
                >
                  Confirm session
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    changeStatus("rejected", "Decline this session request?")
                  }
                  className="cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  Decline
                </button>
              </>
            )}
            {!canRespond && canCancel && (
              <button
                disabled={busy}
                onClick={() =>
                  changeStatus(
                    "cancelled",
                    "Cancel this session? The time slot becomes available again.",
                  )
                }
                className="cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                Cancel session
              </button>
            )}
          </div>
        )}
      </section>

      {/* THE OTHER PERSON */}
      {isTherapist ? (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 font-semibold text-heading">Client</h2>

          <div className="flex items-center gap-4">
            <Avatar name={patient.name} url={patient.avatarUrl} />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-heading">
                {patient.name}
              </p>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                {session.history.length === 0
                  ? "New client"
                  : "Returning client"}
              </span>
            </div>
          </div>

          {patient.email || patient.phone ? (
            <ul className="mt-5 space-y-3 text-sm text-heading">
              {patient.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted" />
                  <a href={`mailto:${patient.email}`} className="hover:text-primary">
                    {patient.email}
                  </a>
                </li>
              )}
              {patient.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted" />
                  <a href={`tel:${patient.phone}`} className="hover:text-primary">
                    {patient.phone}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-5 rounded-xl bg-background-soft px-4 py-3 text-sm text-muted">
              {session.status === "confirmed"
                ? "This client hasn't added contact details."
                : "Contact details are shared once you confirm the session."}
            </p>
          )}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 font-semibold text-heading">Your therapist</h2>

          <div className="flex items-center gap-4">
            <Avatar name={therapist.name} url={therapist.avatarUrl} size="h-20 w-20" />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-heading">
                {therapist.name}
              </p>
              {therapist.yearsOfExperience != null && (
                <p className="text-sm text-muted">
                  {therapist.yearsOfExperience} years of experience
                </p>
              )}
            </div>
          </div>

          {therapist.bio && (
            <p className="mt-4 text-sm leading-6 text-heading/80">
              {therapist.bio}
            </p>
          )}

          {therapist.specialties.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {therapist.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <ul className="mt-5 grid gap-3 text-sm text-heading sm:grid-cols-2">
            {therapist.languages.length > 0 && (
              <li className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-muted" />
                {therapist.languages.join(", ")}
              </li>
            )}
            {therapist.sessionPrice != null && (
              <li className="flex items-center gap-3">
                <Wallet className="h-4 w-4 text-muted" />${therapist.sessionPrice}{" "}
                per session
              </li>
            )}
            {therapist.location && (
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted" />
                {therapist.location}
              </li>
            )}
            {therapist.yearsOfExperience != null && (
              <li className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted" />
                {therapist.yearsOfExperience} years in practice
              </li>
            )}
          </ul>

          <Link
            to={`/therapists/${therapist.id}`}
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            View full profile
          </Link>
        </section>
      )}

      {/* OTHER SESSIONS WITH THIS CLIENT (THERAPIST ONLY) */}
      {isTherapist && (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-heading">
              Other sessions with this client
            </h2>
            <span className="text-xs text-muted">
              {session.history.length} other{" "}
              {session.history.length === 1 ? "session" : "sessions"}
            </span>
          </div>

          {session.history.length === 0 ? (
            <p className="rounded-xl bg-background-soft px-4 py-3 text-sm text-muted">
              This is your first session with {patient.name}.
            </p>
          ) : (
            <ul className="space-y-3">
              {session.history.map((past) => {
                const pastInfo = statusInfo(past);
                return (
                  <li key={past.id}>
                    <Link
                      to={`/dashboard/sessions/${past.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3 transition hover:border-primary"
                    >
                      <div>
                        <p className="text-sm font-medium text-heading">
                          {formatDate(past.date)}
                        </p>
                        <p className="text-xs text-muted">
                          {past.startTime} - {past.endTime} ·{" "}
                          {past.sessionType === "online" ? "Online" : "In person"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${pastInfo.badge}`}
                      >
                        {pastInfo.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default SessionDetails;
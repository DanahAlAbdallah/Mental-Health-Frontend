import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  FileText,
  Inbox,
  PenLine,
  Plus,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchMySessions, updateSessionStatus } from "../../api/sessions";
import { fetchTherapistSlots } from "../../api/availability";
import { fetchMyArticles } from "../../api/articles";
import type { Article, AvailabilitySlot, Session } from "../../types";

// ---------- HELPERS ----------

function todayString(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function hasEnded(session: Session): boolean {
  return new Date(`${session.date}T${session.endTime}:00`) < new Date();
}

function sortKey(session: Session): string {
  return `${session.date} ${session.startTime}`;
}

// "Today", "Tomorrow" OR A SHORT DATE
function dayLabel(date: string): string {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date(`${todayString()}T00:00:00`);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return target.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// ---------- SMALL COMPONENTS ----------

function StatCard({
  to,
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  to: string;
  label: string;
  value: number;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            highlight
              ? "bg-amber-100 text-amber-700"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
      <p className="text-3xl font-bold text-heading">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Link>
  );
}

function Panel({
  title,
  linkTo,
  linkLabel,
  children,
}: {
  title: string;
  linkTo: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-heading">{title}</h2>
        <Link
          to={linkTo}
          className="text-sm font-medium text-primary hover:underline"
        >
          {linkLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

function DateChip({ date }: { date: string }) {
  const d = new Date(`${date}T00:00:00`);
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
      <span className="text-lg font-bold leading-none">{d.getDate()}</span>
      <span className="mt-0.5 text-[11px] font-semibold uppercase">
        {d.toLocaleDateString(undefined, { month: "short" })}
      </span>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center">
      <Icon className="h-6 w-6 text-muted" />
      <p className="text-sm text-muted">{text}</p>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 rounded-3xl bg-black/5" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-black/5" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-black/5" />
        <div className="h-64 rounded-2xl bg-black/5" />
      </div>
    </div>
  );
}

// ---------- PAGE ----------

function Overview() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // LOAD EVERYTHING AT THE SAME TIME
  useEffect(() => {
    if (!user) return;
    let active = true;

    Promise.all([
      fetchMySessions(),
      fetchTherapistSlots(user.id),
      fetchMyArticles(),
    ])
      .then(([s, sl, a]) => {
        if (!active) return;
        setSessions(s);
        setSlots(sl);
        setArticles(a);
      })
      .catch(() => {
        if (active) setError("We couldn't load your dashboard data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  // CONFIRM OR DECLINE A REQUEST DIRECTLY FROM THE OVERVIEW
  async function respond(id: string, status: "confirmed" | "rejected") {
    if (status === "rejected" && !window.confirm("Decline this request?")) {
      return;
    }

    setError("");
    setBusyId(id);
    try {
      const updated = await updateSessionStatus(id, status);
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

  if (loading) return <OverviewSkeleton />;

  // ---------- DERIVED DATA ----------
  const today = todayString();

  const pending = sessions
    .filter((s) => s.status === "pending" && !hasEnded(s))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const upcoming = sessions
    .filter((s) => s.status === "confirmed" && !hasEnded(s))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const todays = upcoming.filter((s) => s.date === today);
  const nextSession = upcoming[0];

  const freeSlots = slots.filter(
    (s) => !s.isBooked && new Date(`${s.date}T${s.startTime}:00`) > new Date(),
  );

  // ONE SENTENCE THAT SUMMARIZES THE DAY
  const summary: string[] = [];
  if (todays.length > 0) {
    summary.push(`You have ${plural(todays.length, "session")} today.`);
  } else if (nextSession) {
    summary.push(
      `Your next session is ${dayLabel(nextSession.date).toLowerCase()} at ${nextSession.startTime}.`,
    );
  } else {
    summary.push("You have no sessions scheduled yet.");
  }
  if (pending.length > 0) {
    summary.push(`${plural(pending.length, "request")} waiting for your reply.`);
  }

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-6 text-button-text shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative">
          <p className="text-sm font-medium opacity-80">{greeting()}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-xl text-sm opacity-90 sm:text-base">
            {summary.join(" ")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard/availability"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
            >
              <Plus className="h-4 w-4" />
              Add availability
            </Link>
            <Link
              to="/dashboard/articles/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
            >
              <PenLine className="h-4 w-4" />
              Write an article
            </Link>
            <Link
              to="/dashboard/sessions"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
            >
              <CalendarCheck className="h-4 w-4" />
              All sessions
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* WARNING WHEN CLIENTS CAN'T BOOK */}
      {freeSlots.length === 0 && (
        <Link
          to="/dashboard/availability"
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 transition-colors hover:bg-amber-100"
        >
          <TriangleAlert className="h-5 w-5 shrink-0" />
          <span>
            <strong>You have no free time slots.</strong> Clients can't book you
            until you add availability.
          </span>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
        </Link>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          to="/dashboard/sessions"
          label="Pending requests"
          value={pending.length}
          icon={Inbox}
          highlight={pending.length > 0}
        />
        <StatCard
          to="/dashboard/sessions"
          label="Upcoming sessions"
          value={upcoming.length}
          icon={CalendarCheck}
        />
        <StatCard
          to="/dashboard/availability"
          label="Free slots"
          value={freeSlots.length}
          icon={CalendarClock}
        />
        <StatCard
          to="/dashboard/articles"
          label="Published articles"
          value={articles.length}
          icon={FileText}
        />
      </div>

      {/* PANELS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PENDING REQUESTS */}
        <Panel
          title="Requests to review"
          linkTo="/dashboard/sessions"
          linkLabel="View all"
        >
          {pending.length === 0 ? (
            <EmptyState icon={Inbox} text="You're all caught up." />
          ) : (
            <ul className="space-y-3">
              {pending.slice(0, 4).map((session) => {
                const busy = busyId === session.id;
                return (
                  <li
                    key={session.id}
                    className="flex items-center gap-4 rounded-xl border border-border p-3"
                  >
                    <DateChip date={session.date} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-heading">
                        {session.patientName ?? "Client"}
                      </p>
                      <p className="text-sm text-muted">
                        {dayLabel(session.date)} · {session.startTime} -{" "}
                        {session.endTime}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        disabled={busy}
                        onClick={() => respond(session.id, "confirmed")}
                        className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-button-text hover:bg-primary-hover disabled:opacity-60"
                      >
                        Confirm
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => respond(session.id, "rejected")}
                        className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* UPCOMING SESSIONS */}
        <Panel
          title="Upcoming sessions"
          linkTo="/dashboard/sessions"
          linkLabel="View all"
        >
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              text="No confirmed sessions coming up."
            />
          ) : (
            <ul className="space-y-3">
              {upcoming.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center gap-4 rounded-xl border border-border p-3"
                >
                  <DateChip date={session.date} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-heading">
                      {session.patientName ?? "Client"}
                    </p>
                    <p className="text-sm text-muted">
                      {session.startTime} - {session.endTime}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      session.date === today
                        ? "bg-primary text-button-text"
                        : "bg-background-soft text-heading"
                    }`}
                  >
                    {dayLabel(session.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default Overview;
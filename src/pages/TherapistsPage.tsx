import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchTherapists, type Therapist } from "../api/users";

function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists().then((data) => {
      setTherapists(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8">Loading therapists...</div>;
  }


return (
  <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Header */}
      <header className="space-y-3">
        <p className="text-sm font-medium text-primary">
          Your journey starts here
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
          Find a Therapist
        </h1>

        <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
          Discover professionals who can support you on your journey
          toward better mental well-being.
        </p>
      </header>

      {/* Therapist count */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm text-muted">
          Meet our professionals
        </p>

        <span className="rounded-full bg-surface-soft px-3 py-1.5 text-sm font-medium text-muted">
          {therapists.length}{" "}
          {therapists.length === 1 ? "therapist" : "therapists"}
        </span>
      </div>

      {/* Therapist cards */}
      {therapists.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-5 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
          </div>

          <h2 className="font-semibold text-heading">
            No therapists available yet
          </h2>

          <p className="mt-2 text-sm text-muted">
            Please check back soon to discover our professionals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {therapists.map((therapist) => (
            <Link
              key={therapist.id}
              to={`/therapists/${therapist.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {/* Avatar placeholder */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-soft text-primary transition group-hover:bg-primary group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                </svg>
              </div>

              {/* Therapist details */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-heading transition group-hover:text-primary">
                  {therapist.name}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Mental health professional
                </p>

                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  View profile
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  </div>
);


}

export default TherapistsPage;

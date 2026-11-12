import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { fetchTherapistSlots } from "../../api/availability";
import { bookSession } from "../../api/sessions";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import type { Therapist, AvailabilitySlot } from "../../types";
import { fetchTherapistDetails } from "../../api/users";

// THE THERAPIST PROFILE & BOOKING DETAIL PAGE
function TherapistDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState(false);

  // ONLY CLIENTS CAN REQUEST SESSIONS
  const isClient = user?.role === "client";

  // LOADS BOTH THERAPIST PROFILE AND AVAILABLE SLOTS
 useEffect(() => {
    // Ensure id is present and is a string before fetching
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);
        const [therapistData, slotsData] = await Promise.all([
          fetchTherapistDetails(id as string), // type assertion or guard guarantees it's a string
          fetchTherapistSlots(id as string),
        ]);
        setTherapist(therapistData);
        setSlots(slotsData);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Could not load therapist profile",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);
  async function handleBooking(slotId: string) {
    if (!token || !isClient) {
      setBookingError(true);
      setBookingMessage("Please log in as a client to request a session.");
      return;
    }

    setBookingSlotId(slotId);
    setBookingMessage("");
    setBookingError(false);

    try {
      await bookSession(slotId);

      setSlots((currentSlots) =>
        currentSlots.filter((slot) => slot.id !== slotId),
      );

      setBookingMessage(
        "Your request was sent successfully and is waiting for therapist approval.",
      );
    } catch (error) {
      setBookingError(true);
      setBookingMessage(
        error instanceof Error
          ? error.message
          : "Unable to request this session. Please try again.",
      );
    } finally {
      setBookingSlotId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading therapist profile...
      </div>
    );
  }

  if (loadError || !therapist) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
          <h2 className="text-lg font-semibold mb-2">Unable to load profile</h2>
          <p className="text-sm mb-6">{loadError || "Therapist not found."}</p>
          <Link
            to="/therapists"
            className="inline-flex items-center justify-center rounded-xl bg-white border border-border px-4 py-2 text-sm font-medium text-heading hover:bg-background transition"
          >
            ← Back to therapists directory
          </Link>
        </div>
      </div>
    );
  }

  const { profile } = therapist;

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* BACK NAVIGATION */}
        <Link
          to="/therapists"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <span aria-hidden="true">←</span>
          Back to therapists
        </Link>

        {/* THERAPIST PROFILE HERO CARD */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* AVATAR */}
            <div className="relative shrink-0">
              {therapist.avatarUrl ? (
                <img
                  src={therapist.avatarUrl}
                  alt={therapist.name}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border border-border shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-surface-soft text-primary text-3xl font-bold border border-border">
                  {therapist.name.charAt(0)}
                </div>
              )}
            </div>

            {/* PROFILE DETAILS */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-heading">
                  {therapist.name}
                </h1>
                
                {/* SPECIALTIES TAGS */}
                {profile.specialties && profile.specialties.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                    {profile.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-primary"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK STATS BADGES */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
                {profile.yearsOfExperience !== undefined && (
                  <div className="rounded-xl border border-border bg-background-soft px-3 py-1.5 text-xs font-medium text-heading">
                    💼 {profile.yearsOfExperience} years experience
                  </div>
                )}
                {profile.sessionPrice !== undefined && (
                  <div className="rounded-xl border border-border bg-background-soft px-3 py-1.5 text-xs font-medium text-heading">
                    💲 ${profile.sessionPrice} / session
                  </div>
                )}
                <div className="rounded-xl border border-border bg-background-soft px-3 py-1.5 text-xs font-medium text-heading capitalize">
                  📍 {profile.sessionType} {profile.location ? `(${profile.location})` : ""}
                </div>
              </div>

              {/* LANGUAGES */}
              {profile.languages && profile.languages.length > 0 && (
                <p className="text-xs text-muted pt-1">
                  Languages: <span className="text-heading font-medium">{profile.languages.join(", ")}</span>
                </p>
              )}
            </div>
          </div>

          {/* BIO & ABOUT SECTION */}
          <div className="mt-8 border-t border-border pt-6 space-y-3">
            <h2 className="text-base font-semibold text-heading">About {therapist.name}</h2>
            <p className="text-sm leading-relaxed text-muted whitespace-pre-line">
              {profile.bio || "Dedicated to providing a safe, confidential, and empathetic space for your mental wellness journey."}
            </p>
          </div>
        </div>

        {/* RESULT OF LAST BOOKING SESSION */}
        {bookingMessage && (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-xl border p-4 text-sm ${
              bookingError
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-border bg-background-soft text-heading"
            }`}
          >
            {bookingMessage}
          </div>
        )}

        {/* AVAILABLE SLOTS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold text-heading">Available appointments</h2>
              <p className="text-xs text-muted">Select an open time slot below to request a session.</p>
            </div>

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

              <h3 className="font-semibold text-heading">No available times</h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                {therapist.name} currently has no open appointments. Please check back later or explore other therapists.
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
                  {/* TIME ICON */}
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

                  {/* DATE AND TIME */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-heading">
                      {formatDate(slot.date)}
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      {slot.startTime} – {slot.endTime}
                    </p>
                  </div>

                  {/* BOOKING ACTION */}
                  {isClient && (
                    <button
                      type="button"
                      onClick={() => handleBooking(slot.id)}
                      disabled={bookingSlotId !== null}
                      className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-button-text transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
                    >
                      {bookingSlotId === slot.id
                        ? "Requesting..."
                        : "Request session"}
                    </button>
                  )}
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
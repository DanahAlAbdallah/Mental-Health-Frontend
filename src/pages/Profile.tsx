import { useEffect, useState } from "react";
import { useAuth  } from "../context/AuthContext";
import { fetchMyProfile, updateMyProfile, updateMyUser } from "../api/users";
import type { TherapistProfile } from "../types";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  bio: string;
  specialties: string;
  yearsOfExperience: string;
  languages: string;
  sessionPrice: string;
  sessionType: "online" | "in-person" | "both";
  location: string;
};

const initialForm: ProfileForm = {
  name: "",
  email: "",
  phone: "",
  avatarUrl: "",
  bio: "",
  specialties: "",
  yearsOfExperience: "",
  languages: "",
  sessionPrice: "",
  sessionType: "both",
  location: "",
};

function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isTherapist = user?.role === "therapist";

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        let therapistProfile: TherapistProfile | null = null;

        if (user.role === "therapist") {
          therapistProfile = await fetchMyProfile();
        }

        if (!active) return;

        setForm({
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          avatarUrl: user.avatarUrl ?? "",
          bio: therapistProfile?.bio ?? "",
          specialties: therapistProfile?.specialties?.join(", ") ?? "",
          yearsOfExperience:
            therapistProfile?.yearsOfExperience != null
              ? String(therapistProfile.yearsOfExperience)
              : "",
          languages: therapistProfile?.languages?.join(", ") ?? "",
          sessionPrice:
            therapistProfile?.sessionPrice != null
              ? String(therapistProfile.sessionPrice)
              : "",
          sessionType: therapistProfile?.sessionType ?? "both",
          location: therapistProfile?.location ?? "",
        });
      } catch {
        if (active) {
          setError("We couldn't load your profile. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  // 👇 ADD THIS, after the effect above
  useEffect(() => {
    console.log("Form updated:", form);
  }, [form]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update the user's general account information.
     const updatedUser = await updateMyUser({
  name: form.name.trim(),
  phone: form.phone.trim() || null,
  avatarUrl: form.avatarUrl.trim() || null,
});

updateUser(updatedUser);

      // Update therapist-specific information separately.
      if (isTherapist) {
        const years = form.yearsOfExperience.trim();
        const price = form.sessionPrice.trim();

        const therapistData: TherapistProfile = {
          userId: user.id,
          bio: form.bio.trim(),
          specialties: form.specialties
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          languages: form.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          yearsOfExperience: years === "" ? undefined : Number(years),
          sessionPrice:
            price === "" ? undefined : Math.round(Number(price) * 100) / 100,
          sessionType: form.sessionType,
          location: form.location.trim() || undefined,
        };
        console.log(therapistData);
        await updateMyProfile(therapistData);
      }

      setSuccess("Your profile has been updated successfully.");
    } catch {
      setError(
        "We couldn't save your changes. Please check your information and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-center text-muted">Loading your profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-center text-muted">
          Please sign in to view your profile.
        </p>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">
            YOUR ATHAR ACCOUNT
          </p>

          <h1 className="text-3xl font-bold text-heading sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Manage your personal information
            {isTherapist
              ? " and help clients get to know you."
              : " and keep your account up to date."}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-border bg-background-soft p-5 shadow-sm sm:p-8"
        >
          {/* PROFILE HEADER */}
          <section className="flex items-center gap-4">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="Profile avatar"
                className="h-20 w-20 rounded-full border border-border object-cover"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                {form.name.trim().charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-heading">
                {form.name || "Your name"}
              </h2>

              <p className="text-sm capitalize text-muted">{user.role}</p>

              <p className="mt-1 break-all text-sm text-muted">{form.email}</p>
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* GENERAL INFORMATION */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold text-heading">
              Personal information
            </h2>

            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-heading"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                required
                maxLength={100}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-heading"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                className={`${inputClass} cursor-not-allowed opacity-70`}
                disabled
              />
              <p className="mt-1 text-xs text-muted">
                Email changes are disabled here.
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-heading"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+961 XX XXX XXX"
                maxLength={30}
              />
            </div>

            <div>
              <label
                htmlFor="avatarUrl"
                className="text-sm font-medium text-heading"
              >
                Profile picture URL
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={form.avatarUrl}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </section>

          {/* THERAPIST INFORMATION */}
          {isTherapist && (
            <>
              <div className="h-px bg-border" />

              <section className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-heading">
                    Professional information
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Help clients understand your experience and services.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium text-heading"
                  >
                    Professional bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className={`${inputClass} min-h-32 resize-y`}
                    placeholder="Introduce yourself and describe your approach to therapy..."
                    maxLength={3000}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialties"
                    className="text-sm font-medium text-heading"
                  >
                    Specialties
                  </label>
                  <input
                    id="specialties"
                    name="specialties"
                    value={form.specialties}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Anxiety, stress, relationships"
                    required
                  />
                  <p className="mt-1 text-xs text-muted">
                    Separate specialties with commas.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="yearsOfExperience"
                    className="text-sm font-medium text-heading"
                  >
                    Years of experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={form.yearsOfExperience}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="languages"
                    className="text-sm font-medium text-heading"
                  >
                    Languages
                  </label>
                  <input
                    id="languages"
                    name="languages"
                    value={form.languages}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Arabic, English, French"
                  />
                  <p className="mt-1 text-xs text-muted">
                    Separate languages with commas.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="sessionPrice"
                    className="text-sm font-medium text-heading"
                  >
                    Session price ($)
                  </label>
                  <input
                    id="sessionPrice"
                    name="sessionPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.sessionPrice}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your session price"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sessionType"
                    className="text-sm font-medium text-heading"
                  >
                    Session type
                  </label>
                  <select
                    id="sessionType"
                    name="sessionType"
                    value={form.sessionType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In person</option>
                    <option value="both">Online and in person</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="text-sm font-medium text-heading"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Nabatieh, Lebanon"
                  />
                </div>
              </section>
            </>
          )}

          {/* FEEDBACK */}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <div className="flex justify-end border-t border-border pt-5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Profile;

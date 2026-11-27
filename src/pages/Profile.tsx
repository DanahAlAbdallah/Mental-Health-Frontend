import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  fetchMyProfile,
  updateMyProfile,
  updateMyUser,
  uploadMyAvatar,
} from "../api/users";

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

  // PROFILE PHOTO STATES
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const isTherapist = user?.role === "therapist";

  // LOAD PROFILE INFORMATION
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

  // CREATE A TEMPORARY PREVIEW FOR THE SELECTED PHOTO
  useEffect(() => {
    if (!selectedPhoto) {
      setPhotoPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedPhoto);

    setPhotoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedPhoto]);

  // HANDLE NORMAL FORM INPUTS
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

  // SELECT AND VALIDATE PROFILE PHOTO
  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
  

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedPhoto(file);
    setError("");
    setSuccess("");
  }

  // UPLOAD PROFILE PHOTO
  async function handleUploadPhoto() {
    if (!selectedPhoto) return;

    setUploadingPhoto(true);
    setError("");
    setSuccess("");

    try {
      const updatedUser = await uploadMyAvatar(selectedPhoto);
      updateUser(updatedUser);

      setForm((current) => ({
        ...current,
        avatarUrl: updatedUser.avatarUrl ?? "",
      }));

      setSelectedPhoto(null);

      setSuccess("Your profile photo has been updated.");
    } catch {
      setError("We couldn't upload your photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  // SAVE PROFILE INFORMATION
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // UPDATE GENERAL ACCOUNT INFORMATION
      const updatedUser = await updateMyUser({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        avatarUrl: form.avatarUrl.trim() || null,
      });

      updateUser(updatedUser);

      // UPDATE THERAPIST-SPECIFIC INFORMATION
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

  // LOADING STATE
  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-center text-muted">Loading your profile...</p>
      </main>
    );
  }

  // NOT LOGGED IN
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

  const displayedPhoto = photoPreview || form.avatarUrl;

return (
  <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl space-y-7">

      {/* PAGE HEADER */}
      <header>
        <h1 className="text-2xl font-semibold text-heading">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your personal information and account details.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PROFILE CARD */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-heading">
            Profile
          </h2>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center gap-3">
              {displayedPhoto ? (
                <img
                  src={displayedPhoto}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                  {form.name.trim().charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <label
                htmlFor="profilePhoto"
                className="cursor-pointer text-sm font-medium text-primary hover:text-primary-hover"
              >
                Change photo
              </label>

              <input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {selectedPhoto && (
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={uploadingPhoto}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {uploadingPhoto ? "Uploading..." : "Upload photo"}
                </button>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-heading">
                {form.name || "Your name"}
              </h3>
              <p className="mt-1 text-sm capitalize text-muted">
                {user.role}
              </p>
              <p className="mt-1 break-all text-sm text-muted">
                {form.email}
              </p>
              <p className="mt-2 text-xs text-muted">
                JPG, PNG or WEBP. Maximum 5 MB.
              </p>
            </div>
          </div>
        </section>

        {/* PERSONAL INFORMATION */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-heading">
            Personal information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-heading">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your full name"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-heading">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                className={`${inputClass} cursor-not-allowed opacity-60`}
                disabled
              />
              <p className="text-xs text-muted">
                Email changes are disabled here.
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="phone" className="text-sm font-medium text-heading">
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
          </div>
        </section>

        {/* THERAPIST INFORMATION */}
        {isTherapist && (
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-heading">
              Professional information
            </h2>
            <p className="mb-5 text-sm text-muted">
              Help clients learn more about your experience and services.
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium text-heading">
                  Professional bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Introduce yourself and describe your approach to therapy..."
                  maxLength={1000}
                  required
                />
                <p className="text-right text-xs text-muted">
                  {form.bio.length}/1000 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="specialties" className="text-sm font-medium text-heading">
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
                <p className="text-xs text-muted">
                  Separate specialties with commas.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="yearsOfExperience" className="text-sm font-medium text-heading">
                    Years of experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="70"
                    step="1"
                    value={form.yearsOfExperience}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 5"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="languages" className="text-sm font-medium text-heading">
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
                  <p className="text-xs text-muted">
                    Separate languages with commas.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="sessionPrice" className="text-sm font-medium text-heading">
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

                <div className="space-y-2">
                  <label htmlFor="sessionType" className="text-sm font-medium text-heading">
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

                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="location" className="text-sm font-medium text-heading">
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
              </div>
            </div>
          </section>
        )}

        {/* FEEDBACK */}
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </p>
        )}

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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

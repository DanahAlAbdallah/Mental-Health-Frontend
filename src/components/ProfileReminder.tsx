import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMyProfile } from "../api/users";

// WHERE WE REMEMBER THAT THE USER CLOSED THE REMINDER. SESSION STORAGE IS CLEARED WHEN THE
// BROWSER TAB CLOSES, SO THE REMINDER COMES BACK NEXT VISIT UNTIL THE PROFILE IS COMPLETE
const DISMISS_KEY = "profile-reminder-dismissed";

// A BANNER THAT ASKS THE LOGGED IN USER TO COMPLETE THEIR PROFILE.
// THERAPISTS ARE ASKED FOR A BIO AND SPECIALTIES, CLIENTS ONLY FOR A PHONE NUMBER
function ProfileReminder() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const [incomplete, setIncomplete] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === "1",
  );

  // RUNS WHEN THE USER OR THE PAGE CHANGES: CHECKS IF THE PROFILE IS STILL INCOMPLETE.
  // CHECKING ON EVERY PAGE CHANGE MAKES THE BANNER DISAPPEAR RIGHT AFTER SAVING
  useEffect(() => {
    if (!user) {
      setIncomplete(false);
      return;
    }

    if (user.role === "therapist") {
      fetchMyProfile()
        .then((profile) =>
          setIncomplete(
            !profile.bio?.trim() || profile.specialties.length === 0,
          ),
        )
        .catch(() => setIncomplete(false));
    } else if (user.role === "client") {
      setIncomplete(!user.phone);
    } else {
      setIncomplete(false);
    }
  }, [user, pathname]);

  // RUNS WHEN THE USER CLICKS THE X: HIDES THE BANNER FOR THIS VISIT
  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  // NOTHING TO SHOW: NOT LOGGED IN, PROFILE COMPLETE, CLOSED, OR ALREADY ON THE PROFILE PAGE
  if (!user || !incomplete || dismissed || pathname === "/profile") {
    return null;
  }

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-4 border-b border-border bg-background-soft px-4 py-3 text-sm text-heading sm:px-6"
    >
      <p>
        {user.role === "therapist"
          ? "Complete your profile so clients can get to know you."
          : "Complete your profile to make booking easier."}{" "}
        <Link
          to="/profile"
          className="font-semibold underline hover:text-primary-hover"
        >
          Complete profile →
        </Link>
      </p>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Close reminder"
        className="shrink-0 rounded-md px-2 text-muted transition hover:text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        ✕
      </button>
    </div>
  );
}

export default ProfileReminder;

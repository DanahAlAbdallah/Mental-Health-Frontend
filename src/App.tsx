import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/Landing/LandingPage";
import TherapistsPage from "./pages/TherapistsPage";
import TherapistDetailPage from "./pages/TherapistDetailPage";
import ProfileReminder from "./components/ProfileReminder";
import Profile from "./pages/Profile";
import TherapistRoute from "./components/TherapitRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import MyArticles from "./pages/dashboard/MyArticles";
import MyAvailability from "./pages/dashboard/MyAvailability";
import MySessions from "./pages/dashboard/MySessions";
import ArticleForm from "./pages/dashboard/ArticleForm";
import ArticleDetailPage from "./pages/Articles/ArticleDetailPage";
import ArticlesPage from "./pages/Articles/ArticlesPage";
import ClientRoute from "./components/ClientRoute";
import MyBookings from "./pages/MyBookings";
import RequireAuth from "./components/RequireAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const location = useLocation();

  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <>
      {showNavbar && <Navbar />}
      <ProfileReminder />
      <Routes>
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<LoginPage />} />

        {/* SIGNUP */}
        <Route path="/signup" element={<SignupPage />} />

        {/* FORGET PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* RESET PASSWORD */}
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* --------------------------------ARTICLES ROUTES------------------------- */}

        {/* MAIN ARTICLES PAGE */}
        <Route path="/articles" element={<ArticlesPage />} />

        {/* ARTICLE DETAIL PAGE */}
        <Route path="/articles/:id" element={<ArticleDetailPage />} />

        {/* THERAPIST SESSIONS */}

        <Route path="/therapists/:id" element={<TherapistDetailPage />} />
        <Route path="/therapists" element={<TherapistsPage />} />

        {/* THERAPIST ROUTES */}
        <Route element={<TherapistRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="articles" element={<MyArticles />} />
            <Route path="articles/new" element={<ArticleForm />} />
            <Route path="articles/:id/edit" element={<ArticleForm />} />
            <Route path="sessions" element={<MySessions />} />
            <Route path="availability" element={<MyAvailability />} />
          </Route>
        </Route>

        {/* CLIENT ROUTES */}
        <Route element={<ClientRoute />}>
          <Route path="/my-sessions" element={<MyBookings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

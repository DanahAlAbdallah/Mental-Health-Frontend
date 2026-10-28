import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RequireRole from "./components/RequireRole";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/Landing/LandingPage";
import AvailabilityPage from "./pages/AvailabilityPage";
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
import EditArticlePage from "./pages/Articles/EditArticlePage";
import ClientRoute from "./components/ClientRoute";
import MyBookings from "./pages/MyBookings";
import RequireAuth from "./components/RequireAuth";

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

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* --------------------------------ARTICLES ROUTES------------------------- */}

        {/* MAIN ARTICLES PAGE */}
        <Route path="/articles" element={<ArticlesPage />} />

        {/* ARTICLE DETAIL PAGE */}
        <Route path="/articles/:id" element={<ArticleDetailPage />} />

        {/* ADD NEW ARTICLE BY THERAPIST OR ADMIN */}
        {/* <Route
          path="/articles/new"
          element={
            <RequireRole allowed={["therapist", "admin"]}>
              <AddArticlePage />
            </RequireRole>
          }
        /> */}

        {/* EDIT ARTICLE BY THERAPIST OR ADMIN */}
        <Route
          path="/articles/:id/edit"
          element={
            <RequireRole allowed={["therapist", "admin"]}>
              <EditArticlePage />
            </RequireRole>
          }
        />

        {/* --------------------------------THERAPIST ROUTES------------------------- */}
        {/* AVAILABILITY */}
        <Route
          path="/availability"
          element={
            <RequireRole allowed={["therapist"]}>
              <AvailabilityPage />
            </RequireRole>
          }
        />

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

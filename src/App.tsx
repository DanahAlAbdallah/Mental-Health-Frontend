import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import LoginPage from "./pages/LoginPage";
import AddArticlePage from "./pages/AddArticlePage";
import RequireRole from "./components/RequireRole";
import EditArticlePage from "./pages/EditArticlePage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import AvailabilityPage from "./pages/AvailabilityPage";

function App() {
  const location = useLocation();

  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* MAIN ARTICLES PAGE */}
        <Route path="/articles" element={<ArticlesPage />} />

        {/* ARTICLE DETAIL PAGE */}
        <Route path="/articles/:id" element={<ArticleDetailPage />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADD NEW ARTICLE BY THERAPIST OR ADMIN */}
        <Route
          path="/articles/new"
          element={
            <RequireRole allowed={["therapist", "admin"]}>
              <AddArticlePage />
            </RequireRole>
          }
        />

        {/* EDIT ARTICLE BY THERAPIST OR ADMIN */}
        <Route
          path="/articles/:id/edit"
          element={
            <RequireRole allowed={["therapist", "admin"]}>
              <EditArticlePage />
            </RequireRole>
          }
        />

        {/* SIGNUP */}
        <Route path="/signup" element={<SignupPage />} />

        {/* AVAILABILITY */}
        <Route
          path="/availability"
          element={
            <RequireRole allowed={["therapist"]}>
              <AvailabilityPage />
            </RequireRole>
          }
        />
      </Routes>
    </>
  );
}

export default App;

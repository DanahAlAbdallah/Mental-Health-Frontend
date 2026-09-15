import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import LoginPage from "./pages/LoginPage";
import AddArticlePage from "./pages/AddArticlePage";
import RequireRole from "./components/RequireRole";
import EditArticlePage from "./pages/EditArticlePage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* MAIN ARTICLES PAGE */}
        <Route path="/" element={<ArticlesPage />} />

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
      </Routes>
    </>
  );
}

export default App;

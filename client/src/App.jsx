import { Navigate, Route, Routes } from "react-router-dom";
import AuthBootstrap from "./components/layout/AuthBootstrap.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DocumentPreviewPage from "./pages/DocumentPreviewPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <AuthBootstrap />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/documents/:documentId"
          element={
            <ProtectedRoute>
              <DocumentPreviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/useAuth";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/RouteParts";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ReviewPage from "./pages/ReviewPage";
import ComparePage from "./pages/ComparePage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";

function AppRoutes() {
  const { user, signIn, signOut } = useAuth();
  const [result, setResult] = useState(null);
  return (
    <AppShell user={user} onLogout={signOut}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/review" replace />
              ) : (
                <AuthPage mode="login" onAuth={signIn} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/review" replace />
              ) : (
                <AuthPage mode="signup" onAuth={signIn} />
              )
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute user={user}>
                <ReviewPage setResult={setResult} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute user={user}>
                <ComparePage setResult={setResult} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute user={user}>
                <HistoryPage setResult={setResult} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute user={user}>
                <ResultPage result={result} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

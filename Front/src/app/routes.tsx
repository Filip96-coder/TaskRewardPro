import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../ui/pages/Auth/LoginPage";
import DashboardPage from "../ui/pages/Dashboard/DashBoardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

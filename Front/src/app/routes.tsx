import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../ui/pages/Auth/LoginPage";
import DashboardPage from "../ui/pages/Dashboard/DashBoardPage";
import RegisterPage from "../ui/pages/Auth/registerPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
       <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

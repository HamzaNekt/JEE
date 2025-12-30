import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { BiensPage } from "./pages/BiensPage";
import ClientsPage from "./pages/ClientsPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { ReactElement } from "react";

const Protected = ({ children }: { children: ReactElement }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </Protected>
            }
          />
          <Route
            path="/biens"
            element={
              <Protected>
                <DashboardLayout>
                  <BiensPage />
                </DashboardLayout>
              </Protected>
            }
          />
          <Route
            path="/clients"
            element={
              <Protected>
                <DashboardLayout>
                  <ClientsPage />
                </DashboardLayout>
              </Protected>
            }
          />
          <Route
            path="/reservations"
            element={
              <Protected>
                <DashboardLayout>
                  <ReservationsPage />
                </DashboardLayout>
              </Protected>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import ProtectedRoute from "@/app/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import IndexPage from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import RequesterHome from "@/pages/RequesterHome";
import Tickets from "@/pages/Tickets";
import TicketDetail from "@/pages/TicketDetail";
import UsersPage from "@/pages/Users";
import ProfilePage from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

import { ROUTES } from "@/constants/routes";
import { UserRole } from "@/types/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.register} element={<Register />} />

            {/* Root redirect by role */}
            <Route
              path={ROUTES.home}
              element={
                <ProtectedRoute>
                  <IndexPage />
                </ProtectedRoute>
              }
            />

            {/* Admin + Agent */}
            <Route
              path={ROUTES.dashboard}
              element={
                <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Agent]}>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.tickets}
              element={
                <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Agent]}>
                  <AppLayout>
                    <Tickets />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Requester */}
            <Route
              path={ROUTES.requesterHome}
              element={
                <ProtectedRoute allowedRoles={[UserRole.Requester]}>
                  <AppLayout>
                    <RequesterHome />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Shared */}
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TicketDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.users}
              element={
                <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <AppLayout>
                    <UsersPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.profile}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
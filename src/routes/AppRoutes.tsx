import { Switch, Route } from "wouter";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Contracts from "@/pages/Contracts";
import ContractDetail from "@/pages/ContractDetail";
import ContractNew from "@/pages/ContractNew";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import Alerts from "@/pages/Alerts";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import RenewalTracker from "@/pages/RenewalTracker";
import NotFound from "@/pages/not-found";
import Unauthorized from "@/pages/Unauthorized";
import ServerError from "@/pages/ServerError";
import UserManagement from "@/pages/UserManagement";
import ChangePassword from "@/pages/ChangePassword";

export default function AppRoutes() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/401" component={Unauthorized} />
      <Route path="/500" component={ServerError} />

      {/* Force Password Change route */}
      <Route path="/change-password">
        <ProtectedRoute allowMustChangePassword>
          <ChangePassword />
        </ProtectedRoute>
      </Route>

      {/* All other routes require authentication */}
      <Route>
        <ProtectedRoute>
          <AppLayout>
            <Switch>
              {/* Available to all authenticated users */}
              <Route path="/" component={Dashboard} />
              <Route path="/contracts" component={Contracts} />
              <Route path="/contracts/new" component={ContractNew} />
              <Route path="/contracts/renewal-tracker" component={RenewalTracker} />
              <Route path="/contracts/:id/edit">
                <ProtectedRoute>
                  <ContractNew />
                </ProtectedRoute>
              </Route>
              <Route path="/contracts/:id" component={ContractDetail} />
              <Route path="/reports" component={Reports} />
              <Route path="/alerts" component={Alerts} />

              {/* Admin-only routes */}
              <Route path="/analytics">
                <ProtectedRoute requiredRole="admin">
                  <Analytics />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/users">
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              </Route>
              <Route path="/settings">
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              </Route>

              <Route component={NotFound} />
            </Switch>
          </AppLayout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

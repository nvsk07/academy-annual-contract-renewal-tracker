import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Contracts from "@/pages/Contracts";
import ContractDetail from "@/pages/ContractDetail";
import ContractNew from "@/pages/ContractNew";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import Alerts from "@/pages/Alerts";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/contracts/new" component={ContractNew} />
        <Route path="/contracts/:id" component={ContractDetail} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/reports" component={Reports} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import DarknetHub from "@/pages/darknet";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/darknet" component={DarknetHub} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
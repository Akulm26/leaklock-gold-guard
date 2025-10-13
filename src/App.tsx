import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import OTP from "./pages/OTP";
import ProfileSetup from "./pages/ProfileSetup";
import ActionSelect from "./pages/ActionSelect";
import SmsPermission from "./pages/SmsPermission";
import AutoSync from "./pages/AutoSync";
import AddManual from "./pages/AddManual";
import ConfirmDetected from "./pages/ConfirmDetected";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/action-select" element={<ActionSelect />} />
          <Route path="/sms-permission" element={<SmsPermission />} />
          <Route path="/auto-sync" element={<AutoSync />} />
          <Route path="/add-manual" element={<AddManual />} />
          <Route path="/confirm-detected" element={<ConfirmDetected />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

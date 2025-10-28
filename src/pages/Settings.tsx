import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Shield, CreditCard, LogOut, ChevronRight, Bell, MessageSquare } from "lucide-react";
import { toast } from "sonner";
export default function Settings() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const phone = localStorage.getItem("phone");
  const email = localStorage.getItem("userEmail") || "Not set";
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem("pushNotifications") !== "false");
  const [globalReminderEnabled, setGlobalReminderEnabled] = useState(() => localStorage.getItem("globalReminderEnabled") === "true");
  const [globalReminderDays, setGlobalReminderDays] = useState(() => localStorage.getItem("globalReminderDays") || "3");
  const [scanFrequency, setScanFrequency] = useState(() => parseInt(localStorage.getItem("scanFrequency") || "3"));
  useEffect(() => {
    localStorage.setItem("pushNotifications", pushEnabled.toString());
  }, [pushEnabled]);
  useEffect(() => {
    localStorage.setItem("globalReminderEnabled", globalReminderEnabled.toString());
  }, [globalReminderEnabled]);
  useEffect(() => {
    localStorage.setItem("globalReminderDays", globalReminderDays);
  }, [globalReminderDays]);
  useEffect(() => {
    localStorage.setItem("scanFrequency", scanFrequency.toString());
  }, [scanFrequency]);
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/");
    }
  };
  const handleApplyGlobalToAll = () => {
    if (confirm("Apply this reminder rule to all existing subscriptions?")) {
      const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
      const updated = subs.map((sub: any) => ({
        ...sub,
        reminders: {
          ...sub.reminders,
          enabled: globalReminderEnabled,
          per_item_Tn: [parseInt(globalReminderDays)]
        }
      }));
      localStorage.setItem("subscriptions", JSON.stringify(updated));
      toast.success("Global reminder applied to all plans");
    }
  };
  
  const [smsAccessEnabled, setSmsAccessEnabled] = useState(true);

  const settingSections = [{
    title: "Profile & Account",
    items: [{
      icon: User,
      label: "Name",
      value: userName,
      action: () => {}
    }, {
      icon: Shield,
      label: "Linked Number",
      value: phone,
      action: () => {}
    }, {
      icon: User,
      label: "Email",
      value: email,
      action: () => {}
    }]
  }, {
    title: "Permissions & Privacy",
    items: [{
      icon: Shield,
      label: "SMS Access",
      value: "Granted",
      toggle: true,
      checked: smsAccessEnabled,
      onToggle: setSmsAccessEnabled,
      action: () => {}
    }]
  }, {
    title: "Subscriptions",
    items: [{
      icon: CreditCard,
      label: "Manage Plans",
      value: null,
      action: () => navigate("/dashboard")
    }]
  }];
  return <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-8 pb-24 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>

          {settingSections.map(section => <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="glass-card rounded-xl overflow-hidden">
                {section.items.map((item: any, index) => <div key={item.label} className={`w-full p-4 flex items-center ${item.toggle || section.title === "Subscriptions" ? "justify-between" : ""} ${index !== section.items.length - 1 ? "border-b border-border/50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <item.icon className="text-muted-foreground" size={20} />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        {item.value && <p className="text-sm text-muted-foreground">{item.value}</p>}
                      </div>
                    </div>
                    {item.toggle ? (
                      <Switch checked={item.checked} onCheckedChange={item.onToggle} />
                    ) : section.title === "Subscriptions" ? (
                      <button onClick={item.action} className="hover:bg-secondary/30 transition-colors p-2 -m-2 rounded-lg">
                        <ChevronRight className="text-muted-foreground" size={20} />
                      </button>
                    ) : null}
                  </div>)}
              </div>
            </div>)}

          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Notifications
            </h3>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="text-muted-foreground" size={20} />
                  <div>
                    <p className="font-medium">Allow Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Get reminders for renewals</p>
                  </div>
                </div>
                <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
              </div>
            </div>
          </div>

          {/* Global Reminders */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Global Reminders
            </h3>
            <div className="glass-card rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-muted-foreground" size={20} />
                  <div>
                    <p className="font-medium">Standard Reminder Rule</p>
                    <p className="text-sm text-muted-foreground">Apply to all new plans</p>
                  </div>
                </div>
                <Switch checked={globalReminderEnabled} onCheckedChange={setGlobalReminderEnabled} />
              </div>
              
              {globalReminderEnabled && <>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Remind me before (days)</label>
                    <Select value={globalReminderDays} onValueChange={setGlobalReminderDays}>
                      <SelectTrigger className="glass-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <SelectItem key={n} value={n.toString()}>
                            {n === 1 ? "One day prior" : `${n} days prior`}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="gold-outline" size="sm" className="w-full" onClick={handleApplyGlobalToAll}>
                    Apply to All Existing Plans
                  </Button>
                </>}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Advanced analytics & multi-account sync — coming soon.
            </p>
          </div>
        </div>

        {/* Logout */}
        <Button variant="gold-outline" size="lg" className="w-full mt-6" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </Button>
      </div>
      <BottomNav />
    </MobileLayout>;
}
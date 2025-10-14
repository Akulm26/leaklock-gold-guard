import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Bell, Settings, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SubscriptionActionBot } from "@/components/SubscriptionActionBot";

interface Subscription {
  id: string;
  source: "auto" | "manual";
  merchant_normalized: string;
  plan_name: string;
  amount: number;
  currency: string;
  cycle: "monthly" | "quarterly" | "yearly" | "custom";
  start_date: string;
  next_renewal: string;
  last_payment_date?: string;
  status: "active" | "paused" | "canceled";
  reminders: {
    enabled: boolean;
    per_item_Tn: number[];
    per_item_daily_from_T: number | null;
  };
  savings_month_to_date: number;
  savings_lifetime: number;
  confidence?: number;
  last_seen_at?: string;
  phone?: string;
  // Legacy fields for backward compatibility
  name?: string;
  renewal?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const userName = localStorage.getItem("userName");
  const [botOpen, setBotOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "renew">("cancel");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = () => {
    const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    // Migrate old subscriptions to new schema
    const migratedSubs = subs.map((sub: any) => ({
      ...sub,
      // Add default values for new fields if they don't exist
      status: sub.status || "active",
      merchant_normalized: sub.merchant_normalized || sub.name || "Unknown",
      plan_name: sub.plan_name || sub.name || "Unknown",
      currency: sub.currency || "INR",
      cycle: sub.cycle || "monthly",
      start_date: sub.start_date || new Date().toISOString(),
      next_renewal: sub.next_renewal || sub.renewal || new Date().toISOString(),
      reminders: sub.reminders || {
        enabled: false,
        per_item_Tn: [],
        per_item_daily_from_T: null
      },
      savings_month_to_date: sub.savings_month_to_date || 0,
      savings_lifetime: sub.savings_lifetime || 0
    }));
    setSubscriptions(migratedSubs);
    // Save migrated data back to localStorage
    localStorage.setItem("subscriptions", JSON.stringify(migratedSubs));
  };

  const handleDelete = (id: string) => {
    const updated = subscriptions.filter((sub) => sub.id !== id);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    toast.success("Plan deleted.");
  };

  const openBot = (sub: Subscription, action: "pause" | "cancel" | "renew") => {
    setSelectedSubscription(sub);
    setActionType(action);
    setBotOpen(true);
  };

  const handleBotConfirm = () => {
    if (!selectedSubscription) return;

    const id = selectedSubscription.id;
    const updated = subscriptions.map((sub) => {
      if (sub.id === id) {
        if (actionType === "pause") {
          return { ...sub, status: "paused" as const };
        } else if (actionType === "cancel") {
          return { ...sub, status: "canceled" as const };
        } else if (actionType === "renew") {
          const currentDate = new Date(sub.next_renewal || sub.renewal || new Date());
          let newRenewal = new Date(currentDate);
          
          switch (sub.cycle) {
            case "monthly":
              newRenewal.setMonth(newRenewal.getMonth() + 1);
              break;
            case "quarterly":
              newRenewal.setMonth(newRenewal.getMonth() + 3);
              break;
            case "yearly":
              newRenewal.setFullYear(newRenewal.getFullYear() + 1);
              break;
            default:
              newRenewal.setMonth(newRenewal.getMonth() + 1);
          }
          
          return { 
            ...sub, 
            status: "active" as const, 
            next_renewal: newRenewal.toISOString(),
            last_payment_date: new Date().toISOString()
          };
        }
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    
    const messages = {
      pause: "Plan paused. Savings will accrue.",
      cancel: "Plan canceled. Savings will accrue.",
      renew: "Plan renewed successfully."
    };
    toast.success(messages[actionType]);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: "Expired", color: "text-destructive" };
    if (days === 0) return { text: "Today", color: "text-primary" };
    if (days === 1) return { text: "Tomorrow", color: "text-primary" };
    if (days <= 3) return { text: `${days} days`, color: "text-primary" };
    return { text: `${days} days`, color: "text-muted-foreground" };
  };

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const savingsThisMonth = subscriptions.reduce((sum, sub) => sum + (sub.savings_month_to_date || 0), 0);
  const savingsLifetime = subscriptions.reduce((sum, sub) => sum + (sub.savings_lifetime || 0), 0);
  
  const nextRenewal = subscriptions
    .filter(s => s.status === "active")
    .sort((a, b) => 
      new Date(a.next_renewal || a.renewal || "").getTime() - 
      new Date(b.next_renewal || b.renewal || "").getTime()
    )[0];

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active" && new Date(sub.next_renewal || sub.renewal || "") >= new Date()
  );
  const pausedSubscriptions = subscriptions.filter(
    (sub) => sub.status === "paused"
  );
  const expiredSubscriptions = subscriptions.filter(
    (sub) => sub.status === "canceled" || new Date(sub.next_renewal || sub.renewal || "") < new Date()
  );

  const renderSubscriptionCard = (sub: Subscription) => {
    const displayName = sub.plan_name || sub.name || sub.merchant_normalized;
    const renewalDate = sub.next_renewal || sub.renewal || "";
    const renewal = formatDate(renewalDate);
    const isExpiring = renewal.color === "text-primary";
    const hasReminders = sub.reminders?.enabled;
    const hasSavings = (sub.savings_lifetime || 0) > 0;
    
    const statusColors = {
      active: "bg-primary/20 text-primary",
      paused: "bg-yellow-500/20 text-yellow-500",
      canceled: "bg-destructive/20 text-destructive"
    };
    
    return (
      <div key={sub.id} className={`glass-card rounded-xl p-4 animate-fade-in ${isExpiring ? "border-primary/50" : ""}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{displayName}</h3>
              {isExpiring && hasReminders && <Bell className="text-primary animate-pulse" size={16} />}
            </div>
            <p className="text-2xl font-bold text-primary">₹{sub.amount}</p>
            {hasSavings && (
              <p className="text-xs text-green-400 mt-1">
                Saved ₹{sub.savings_lifetime} lifetime
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate(`/edit-subscription/${sub.id}`)}
            >
              <Edit size={16} />
            </Button>
            {sub.status === "paused" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-400"
                onClick={() => openBot(sub, "renew")}
                title="Resume subscription"
              >
                <span className="text-xs">▶</span>
              </Button>
            )}
            {sub.status === "canceled" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary"
                onClick={() => openBot(sub, "renew")}
                title="Renew subscription"
              >
                <span className="text-xs">🔄</span>
              </Button>
            )}
            {sub.status === "active" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openBot(sub, "pause")}
                  title="Pause subscription"
                >
                  <span className="text-xs">⏸</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-yellow-500"
                  onClick={() => openBot(sub, "cancel")}
                  title="Cancel subscription"
                >
                  <span className="text-xs">✕</span>
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive"
              onClick={() => handleDelete(sub.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm gap-2">
          <span className={`font-medium ${renewal.color}`}>
            {sub.status === "active" ? `Renews ${renewal.text}` : 
             sub.status === "paused" ? "Paused" : "Canceled"}
          </span>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[sub.status]}`}>
              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
            </span>
            <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium">
              {sub.source === "auto" ? "Auto" : "Manual"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-8 pb-24 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings size={20} />
          </Button>
        </div>

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground">Track your subscriptions</p>
        </div>

        {/* Summary */}
        {subscriptions.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Plans</p>
              <p className="text-2xl font-bold">{subscriptions.length}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Next Renewal</p>
              {nextRenewal && (
                <p className="text-2xl font-bold text-primary">
                  {formatDate(nextRenewal.next_renewal || nextRenewal.renewal || "").text}
                </p>
              )}
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Savings This Month</p>
              <p className="text-2xl font-bold text-green-400">₹{savingsThisMonth}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Lifetime Savings</p>
              <p className="text-2xl font-bold text-green-400">₹{savingsLifetime}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
              <div className="p-6 rounded-full bg-secondary/50">
                <Plus className="text-muted-foreground" size={48} />
              </div>
          <div>
            <h3 className="font-bold text-lg mb-2">No subscriptions yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Auto-detect from SMS or add one manually to get started
            </p>
            <Button
              variant="gold-outline"
              size="sm"
              onClick={() => navigate("/llm-assistant")}
            >
              Need help canceling a plan?
            </Button>
          </div>
        </div>
          ) : (
            <Tabs defaultValue="all" className="h-full flex flex-col">
              <TabsList className="w-full mb-4 glass-card grid grid-cols-4">
                <TabsTrigger value="all">
                  All ({subscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeSubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="paused">
                  Paused ({pausedSubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="expired">
                  Expired ({expiredSubscriptions.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="all" className="mt-0 space-y-3">
                  {subscriptions.map(renderSubscriptionCard)}
                </TabsContent>

                <TabsContent value="active" className="mt-0 space-y-3">
                  {activeSubscriptions.length > 0 ? (
                    activeSubscriptions.map(renderSubscriptionCard)
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No active subscriptions
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="paused" className="mt-0 space-y-3">
                  {pausedSubscriptions.length > 0 ? (
                    pausedSubscriptions.map(renderSubscriptionCard)
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No paused subscriptions
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="expired" className="mt-0 space-y-3">
                  {expiredSubscriptions.length > 0 ? (
                    expiredSubscriptions.map(renderSubscriptionCard)
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No expired subscriptions
                    </p>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>

      </div>
      
      <SubscriptionActionBot
        isOpen={botOpen}
        onClose={() => setBotOpen(false)}
        subscription={selectedSubscription}
        actionType={actionType}
        onConfirm={handleBotConfirm}
      />
      
      <BottomNav />
    </MobileLayout>
  );
}

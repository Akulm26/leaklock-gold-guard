import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Bell, Settings, Edit, Trash2, MessageCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { StatusChangeSheet } from "@/components/StatusChangeSheet";
import { SoftEvidenceBanner } from "@/components/SoftEvidenceBanner";
import { AmazonAssistantSheet } from "@/components/AmazonAssistantSheet";
import { AmazonRenewalNudge } from "@/components/AmazonRenewalNudge";


interface EvidenceEvent {
  type: "sms" | "email" | "no_debit" | "app_notification";
  confidence: "high" | "med";
  at: string;
  note?: string;
}

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
  status_changed_at?: string;
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
  // Detection flags
  detected_change?: {
    type: "hard" | "soft";
    status: "canceled" | "paused";
    evidence: string;
    detected_at: string;
  };
  watch_flag?: boolean;
  missed_charges?: number;
  // New fields for external detection
  evidence_events?: EvidenceEvent[];
  status_watch?: {
    suspected_change: boolean;
    since?: string;
  };
  intended_action?: "none" | "skip_this_cycle" | "pause_n_cycles" | "cancel";
  pending_change?: {
    enabled: boolean;
    action: string;
    for_cycle_date?: string;
  };
  grace_days?: number;
  amazon_nudge_dismissed?: boolean;
  // Legacy fields
  name?: string;
  renewal?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const userName = localStorage.getItem("userName");
  const [botOpen, setBotOpen] = useState(false);
  const [detectedChange, setDetectedChange] = useState<{
    subscriptionId: string;
    serviceName: string;
    detectedStatus: "canceled" | "paused";
    evidence: string;
  } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [amazonAssistant, setAmazonAssistant] = useState<{
    subscriptionId: string;
    subscriptionName: string;
    action: "skip" | "pause" | "cancel";
  } | null>(null);
  const [amazonSheetOpen, setAmazonSheetOpen] = useState(false);

  useEffect(() => {
    loadSubscriptions();
    checkForDetectedChanges();
    checkPendingChanges();
  }, []);

  const calculateSavings = (sub: any) => {
    // Only calculate savings for paused or canceled subscriptions
    if (sub.status !== "paused" && sub.status !== "canceled") {
      return { monthly: 0, lifetime: 0 };
    }

    const statusChangedAt = sub.status_changed_at ? new Date(sub.status_changed_at) : new Date();
    const now = new Date();
    
    // Calculate months elapsed since status change
    const monthsElapsed = (now.getFullYear() - statusChangedAt.getFullYear()) * 12 + 
                         (now.getMonth() - statusChangedAt.getMonth());
    
    // Calculate monthly cost based on cycle
    let monthlyCost = sub.amount;
    if (sub.cycle === "yearly") monthlyCost = sub.amount / 12;
    else if (sub.cycle === "quarterly") monthlyCost = sub.amount / 3;
    
    // Lifetime savings = monthly cost × months elapsed
    const lifetimeSavings = Math.max(0, Math.round(monthlyCost * monthsElapsed));
    
    // Monthly savings = monthly cost if in current month, 0 otherwise
    const isCurrentMonth = statusChangedAt.getMonth() === now.getMonth() && 
                          statusChangedAt.getFullYear() === now.getFullYear();
    const monthlySavings = isCurrentMonth ? Math.round(monthlyCost) : 0;
    
    return { monthly: monthlySavings, lifetime: lifetimeSavings };
  };

  const loadSubscriptions = () => {
    const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    // Migrate old subscriptions to new schema and calculate savings
    const migratedSubs = subs.map((sub: any) => {
      const savings = calculateSavings(sub);
      return {
        ...sub,
        // Add default values for new fields if they don't exist
        status: sub.status || "active",
        status_changed_at: sub.status_changed_at || (sub.status !== "active" ? new Date().toISOString() : undefined),
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
        savings_month_to_date: savings.monthly,
        savings_lifetime: savings.lifetime
      };
    });
    setSubscriptions(migratedSubs);
    // Save migrated data back to localStorage
    localStorage.setItem("subscriptions", JSON.stringify(migratedSubs));
  };

  const checkForDetectedChanges = () => {
    const subs: Subscription[] = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const hardEvidence = subs.find(sub => 
      sub.detected_change?.type === "hard" && sub.status === "active"
    );
    
    if (hardEvidence && hardEvidence.detected_change) {
      setDetectedChange({
        subscriptionId: hardEvidence.id,
        serviceName: hardEvidence.plan_name || hardEvidence.merchant_normalized,
        detectedStatus: hardEvidence.detected_change.status,
        evidence: hardEvidence.detected_change.evidence,
      });
      setSheetOpen(true);
    }
  };

  const handleConfirmStatus = (subscriptionId: string, status: "canceled" | "paused") => {
    const updated = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return {
          ...sub,
          status,
          status_changed_at: new Date().toISOString(),
          detected_change: undefined,
          watch_flag: false,
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    loadSubscriptions();
    toast.success(`Subscription marked as ${status}`);
    setSheetOpen(false);
  };

  const handleNotSure = (subscriptionId: string) => {
    const updated = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return {
          ...sub,
          watch_flag: true,
          detected_change: undefined,
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    toast.info("Marked for monitoring. We'll check again next cycle.");
    setSheetOpen(false);
  };

  const handleOpenStatusChange = (sub: Subscription) => {
    setDetectedChange({
      subscriptionId: sub.id,
      serviceName: sub.plan_name || sub.merchant_normalized,
      detectedStatus: sub.status === "canceled" ? "canceled" : "paused",
      evidence: sub.detected_change?.evidence || "Manual status check"
    });
    setSheetOpen(true);
  };

  const handleSoftEvidenceAction = (subscriptionId: string, action: "paused" | "canceled" | "keep") => {
    const updated = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        if (action === "keep") {
          return {
            ...sub,
            missed_charges: 0,
            status_watch: { suspected_change: false }
          };
        }
        return {
          ...sub,
          status: action,
          status_changed_at: new Date().toISOString(),
          missed_charges: 0,
          status_watch: { suspected_change: false }
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    loadSubscriptions();
    
    if (action !== "keep") {
      toast.success(`Subscription marked as ${action}`);
    } else {
      toast.info("Subscription kept active");
    }
  };

  const checkPendingChanges = () => {
    const subs: Subscription[] = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const now = new Date();
    
    subs.forEach(sub => {
      if (sub.pending_change?.enabled && sub.pending_change.for_cycle_date) {
        const cycleDate = new Date(sub.pending_change.for_cycle_date);
        const graceDays = sub.grace_days || 3;
        const verificationDate = new Date(cycleDate);
        verificationDate.setDate(verificationDate.getDate() + graceDays);
        
        if (now >= verificationDate) {
          // Check if debit occurred (simulated - in production check transactions)
          const debitOccurred = Math.random() > 0.5; // Mock
          
          if (!debitOccurred) {
            // Action confirmed
            const action = sub.pending_change.action;
            handlePendingVerified(sub.id, action);
          } else {
            // Action failed
            handlePendingFailed(sub.id);
          }
        }
      }
    });
  };

  const handlePendingVerified = (subscriptionId: string, action: string) => {
    const updated = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        const savings = calculateSavings({ ...sub, status: "paused" });
        return {
          ...sub,
          pending_change: { enabled: false, action: "none" },
          savings_lifetime: (sub.savings_lifetime || 0) + sub.amount
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    toast.success(`${action} confirmed — ₹${subscriptions.find(s => s.id === subscriptionId)?.amount} saved.`);
  };

  const handlePendingFailed = (subscriptionId: string) => {
    const updated = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return {
          ...sub,
          pending_change: { enabled: false, action: "none" }
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    toast.error("Charge detected — skip didn't complete.");
  };

  const handleAmazonAction = (subscriptionId: string, action: "skip" | "pause" | "cancel") => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    if (!sub) return;
    
    // Dismiss the nudge card immediately
    const updated = subscriptions.map(s => 
      s.id === subscriptionId ? { ...s, amazon_nudge_dismissed: true } : s
    );
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    
    setAmazonAssistant({
      subscriptionId,
      subscriptionName: sub.plan_name || sub.merchant_normalized,
      action
    });
    setAmazonSheetOpen(true);
  };

  const handleAmazonComplete = () => {
    if (!amazonAssistant) return;
    
    const updated = subscriptions.map(sub => {
      if (sub.id === amazonAssistant.subscriptionId) {
        const actionMap = {
          skip: "skip_this_cycle" as const,
          pause: "pause_n_cycles" as const,
          cancel: "cancel" as const
        };
        const mappedAction = actionMap[amazonAssistant.action];
        
        return {
          ...sub,
          pending_change: {
            enabled: true,
            action: mappedAction,
            for_cycle_date: sub.next_renewal
          },
          intended_action: mappedAction
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    
    const graceDays = 3;
    const verifyDate = new Date(updated.find(s => s.id === amazonAssistant.subscriptionId)?.next_renewal || "");
    verifyDate.setDate(verifyDate.getDate() + graceDays);
    
    toast.info(`We'll verify after ${verifyDate.toLocaleDateString()}.`);
    setAmazonSheetOpen(false);
  };

  const handleAmazonKeep = (subscriptionId: string) => {
    const updated = subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return {
          ...sub,
          intended_action: "none" as const,
          amazon_nudge_dismissed: true // Dismiss the nudge
        };
      }
      return sub;
    });
    
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
  };

  const handleDelete = (id: string) => {
    const updated = subscriptions.filter((sub) => sub.id !== id);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    toast.success("Plan deleted.");
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
    const showSoftEvidence = sub.status === "active" && (sub.missed_charges || 0) >= 2;
    
    // Check if Amazon subscription needs proactive nudge (7-10 days before renewal)
    const isAmazon = sub.merchant_normalized.toLowerCase().includes("amazon");
    const daysUntilRenewal = Math.ceil((new Date(renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const showAmazonNudge = isAmazon && sub.status === "active" && daysUntilRenewal >= 7 && daysUntilRenewal <= 10 && !sub.amazon_nudge_dismissed;
    
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
              onClick={() => handleOpenStatusChange(sub)}
              title="Update status"
            >
              <Info size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate(`/edit-subscription/${sub.id}`)}
            >
              <Edit size={16} />
            </Button>
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

        {/* Soft Evidence Banner */}
        {showSoftEvidence && (
          <SoftEvidenceBanner
            missedCycles={sub.missed_charges || 0}
            onMarkPaused={() => handleSoftEvidenceAction(sub.id, "paused")}
            onMarkCanceled={() => handleSoftEvidenceAction(sub.id, "canceled")}
            onKeepActive={() => handleSoftEvidenceAction(sub.id, "keep")}
          />
        )}

        {/* Amazon Renewal Nudge */}
        {showAmazonNudge && (
          <AmazonRenewalNudge
            itemName={displayName}
            renewalDate={renewalDate}
            onSkip={() => handleAmazonAction(sub.id, "skip")}
            onPause={() => handleAmazonAction(sub.id, "pause")}
            onCancel={() => handleAmazonAction(sub.id, "cancel")}
            onKeep={() => handleAmazonKeep(sub.id)}
          />
        )}
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

      {/* Floating Chatbot Button */}
      <Button
        variant="gold"
        size="icon"
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl gold-glow z-50"
        onClick={() => navigate("/llm-assistant")}
      >
        <MessageCircle size={24} />
      </Button>

      {/* Status Change Detection Sheet */}
      <StatusChangeSheet
        open={sheetOpen}
        detectedChange={detectedChange}
        onConfirm={handleConfirmStatus}
        onNotSure={handleNotSure}
        onClose={() => setSheetOpen(false)}
      />

      {/* Amazon Assistant Sheet */}
      {amazonAssistant && (
        <AmazonAssistantSheet
          open={amazonSheetOpen}
          subscriptionName={amazonAssistant.subscriptionName}
          action={amazonAssistant.action}
          onComplete={handleAmazonComplete}
          onClose={() => setAmazonSheetOpen(false)}
        />
      )}
      
      <BottomNav />
    </MobileLayout>
  );
}

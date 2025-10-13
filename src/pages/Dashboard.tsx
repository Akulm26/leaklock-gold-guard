import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Bell, Settings, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewal: string;
  source: string;
  phone?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = () => {
    const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    setSubscriptions(subs);
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
  const nextRenewal = subscriptions.sort((a, b) => 
    new Date(a.renewal).getTime() - new Date(b.renewal).getTime()
  )[0];

  const activeSubscriptions = subscriptions.filter(
    (sub) => new Date(sub.renewal) >= new Date()
  );
  const expiredSubscriptions = subscriptions.filter(
    (sub) => new Date(sub.renewal) < new Date()
  );

  const renderSubscriptionCard = (sub: Subscription) => {
    const renewal = formatDate(sub.renewal);
    const isExpiring = renewal.color === "text-primary";
    
    return (
      <div key={sub.id} className={`glass-card rounded-xl p-4 animate-fade-in ${isExpiring ? "border-primary/50" : ""}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{sub.name}</h3>
              {isExpiring && <Bell className="text-primary animate-pulse" size={16} />}
            </div>
            <p className="text-2xl font-bold text-primary">₹{sub.amount}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
        
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${renewal.color}`}>
            Renews {renewal.text}
          </span>
          <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium">
            {sub.source === "auto" ? "Auto" : "Manual"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-8 animate-fade-in">
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
                  {formatDate(nextRenewal.renewal).text}
                </p>
              )}
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
                <p className="text-sm text-muted-foreground max-w-xs">
                  Auto-detect from SMS or add one manually to get started
                </p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="h-full flex flex-col">
              <TabsList className="w-full mb-4 glass-card">
                <TabsTrigger value="all" className="flex-1">
                  All ({subscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="flex-1">
                  Active ({activeSubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="expired" className="flex-1">
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

        {/* FAB */}
        <Button
          variant="gold"
          size="icon"
          className="fixed bottom-24 right-8 h-16 w-16 rounded-full shadow-2xl gold-glow z-50"
          onClick={() => navigate("/add-manual")}
        >
          <Plus size={24} />
        </Button>
      </div>
    </MobileLayout>
  );
}

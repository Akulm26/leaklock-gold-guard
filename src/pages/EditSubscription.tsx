import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  phone?: string;
}

export default function EditSubscription() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<"monthly" | "quarterly" | "yearly" | "custom">("monthly");
  const [renewalDate, setRenewalDate] = useState<Date>();
  const [status, setStatus] = useState<"active" | "paused" | "canceled">("active");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([3]);
  const [dailyFromT, setDailyFromT] = useState<string>("none");

  useEffect(() => {
    const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const found = subs.find((s: Subscription) => s.id === id);
    if (found) {
      setSubscription(found);
      setName(found.plan_name || found.merchant_normalized);
      setAmount(found.amount.toString());
      setCycle(found.cycle);
      setStatus(found.status);
      setRenewalDate(new Date(found.next_renewal));
      setRemindersEnabled(found.reminders?.enabled || false);
      setSelectedDays(found.reminders?.per_item_Tn || [3]);
      setDailyFromT(found.reminders?.per_item_daily_from_T?.toString() || "none");
    } else {
      toast.error("Subscription not found");
      navigate("/dashboard");
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!name || !amount || !renewalDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const updated = subs.map((s: Subscription) => {
      if (s.id === id) {
        const statusChanged = s.status !== status;
        return {
          ...s,
          plan_name: name,
          merchant_normalized: name,
          amount: parseFloat(amount),
          cycle,
          status,
          status_changed_at: statusChanged ? new Date().toISOString() : s.status_changed_at,
          next_renewal: renewalDate.toISOString(),
          reminders: {
            enabled: remindersEnabled,
            per_item_Tn: selectedDays,
            per_item_daily_from_T: dailyFromT === "none" ? null : parseInt(dailyFromT),
          },
        };
      }
      return s;
    });

    localStorage.setItem("subscriptions", JSON.stringify(updated));
    toast.success("Changes updated");
    navigate("/dashboard");
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => b - a)
    );
  };

  const quickDays = [1, 3, 7, 10, 14, 21, 30];

  if (!subscription) return null;

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-8 pb-24 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edit Subscription</h1>
          <p className="text-muted-foreground">Update plan details and reminders</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Basic Info */}
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={cycle} onValueChange={(v: any) => setCycle(v)}>
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Next Renewal Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal glass-card",
                      !renewalDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {renewalDate ? format(renewalDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={renewalDate}
                    onSelect={setRenewalDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Reminders */}
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Reminders</p>
                <p className="text-sm text-muted-foreground">Custom alerts for this plan</p>
              </div>
              <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
            </div>

            {remindersEnabled && (
              <>
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="flex items-center gap-2">
                    <AlertCircle size={14} />
                    Remind me before (days)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {quickDays.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                          selectedDays.includes(day)
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "glass-card hover:bg-secondary"
                        )}
                      >
                        T-{day}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="Custom days (e.g., 5)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseInt((e.target as HTMLInputElement).value);
                        if (val > 0) {
                          toggleDay(val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  {selectedDays.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Selected: T-{selectedDays.join(", T-")}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label>Daily Reminders (Start from T-n)</Label>
                  <Select value={dailyFromT} onValueChange={setDailyFromT}>
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="30">T-30 days</SelectItem>
                      <SelectItem value="21">T-21 days</SelectItem>
                      <SelectItem value="14">T-14 days</SelectItem>
                      <SelectItem value="10">T-10 days</SelectItem>
                      <SelectItem value="7">T-7 days</SelectItem>
                    </SelectContent>
                  </Select>
                  {dailyFromT !== "none" && (
                    <p className="text-xs text-muted-foreground">
                      Daily notifications will start {dailyFromT} days before renewal
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-6">
          <Button variant="gold" size="lg" className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="text" className="w-full" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}

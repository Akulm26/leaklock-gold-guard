import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
interface Subscription {
  id: string;
  name: string;
  provider: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string;
  status: "active" | "paused" | "canceled";
  reminders?: any;
  user_id: string;
}
interface EditSubscriptionSheetProps {
  open: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSaved: () => void;
  onStatusChange: (subscriptionId: string, action: "pause" | "cancel" | "resume") => void;
}
export function EditSubscriptionSheet({
  open,
  subscription,
  onClose,
  onSaved,
  onStatusChange
}: EditSubscriptionSheetProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState("monthly");
  const [renewalDate, setRenewalDate] = useState<Date>();
  const [status, setStatus] = useState<"active" | "paused" | "canceled">("active");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([3]);
  const [dailyFromT, setDailyFromT] = useState<string>("none");
  const [lastPaymentDate, setLastPaymentDate] = useState<Date>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  useEffect(() => {
    if (subscription) {
      setName(subscription.name || subscription.provider);
      setAmount(subscription.amount.toString());
      setCycle(subscription.billing_cycle);
      setStatus(subscription.status);
      setRenewalDate(new Date(subscription.next_billing_date));
      const reminders = subscription.reminders || {
        enabled: false,
        per_item_Tn: [3],
        per_item_daily_from_T: null
      };
      setRemindersEnabled(reminders.enabled);
      setSelectedDays(reminders.per_item_Tn || [3]);
      setDailyFromT(reminders.per_item_daily_from_T?.toString() || "none");
    }
  }, [subscription]);
  const handleSave = async () => {
    if (!subscription || !name || !amount || !renewalDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const statusChanged = subscription.status !== status;
      const updateData: any = {
        name,
        provider: name,
        amount: parseFloat(amount),
        billing_cycle: cycle,
        status,
        next_billing_date: renewalDate.toISOString().split('T')[0],
        last_payment_date: lastPaymentDate?.toISOString().split('T')[0],
        reminders: {
          enabled: remindersEnabled,
          per_item_Tn: selectedDays,
          per_item_daily_from_T: dailyFromT === "none" ? null : parseInt(dailyFromT)
        }
      };

      // Only update status_changed_at if status actually changed
      if (statusChanged) {
        updateData.status_changed_at = new Date().toISOString();
      }

      const { error } = await supabase.from('subscriptions').update(updateData).eq('id', subscription.id);
      if (error) throw error;
      toast.success("Changes updated");
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to save changes');
    }
  };
  const toggleDay = (day: number) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => b - a));
  };
  
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    if (!subscription) return;

    try {
      // Save cancellation reason to database
      const { error } = await supabase
        .from('subscriptions')
        .update({ cancellation_reason: cancellationReason.trim() })
        .eq('id', subscription.id);

      if (error) throw error;

      // Close modal and trigger status change
      setShowCancelModal(false);
      setCancellationReason("");
      onStatusChange(subscription.id, "cancel");
      onClose();
    } catch (error) {
      console.error('Error saving cancellation reason:', error);
      toast.error('Failed to save cancellation reason');
    }
  };
  const quickDays = [1, 3, 7, 10, 14, 21, 30];
  if (!subscription) return null;
  const showResumeButton = status === "paused" || status === "canceled";
  return <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Subscription</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={cycle} onValueChange={setCycle}>
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

            {status !== "canceled" && (
              <div className="space-y-2">
                <Label>Next Renewal Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal glass-card", !renewalDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {renewalDate ? format(renewalDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={renewalDate} onSelect={setRenewalDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label>Last Payment Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal glass-card", !lastPaymentDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPaymentDate ? format(lastPaymentDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={lastPaymentDate} onSelect={setLastPaymentDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <span className={cn("inline-block px-3 py-1.5 rounded-lg text-sm font-medium", status === "active" && "bg-primary/20 text-primary", status === "paused" && "bg-yellow-500/20 text-yellow-500", status === "canceled" && "bg-destructive/20 text-destructive")}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
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

            {remindersEnabled && <>
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="flex items-center gap-2">
                    <AlertCircle size={14} />
                    Remind me before (days)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {quickDays.map(day => <button key={day} onClick={() => toggleDay(day)} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all", selectedDays.includes(day) ? "bg-primary text-primary-foreground shadow-md" : "glass-card hover:bg-secondary")}>
                        {day === 1 ? "One day prior" : `${day} days prior`}
                      </button>)}
                  </div>
                  <Input type="number" placeholder="Custom days (e.g., 5)" onKeyDown={e => {
                if (e.key === "Enter") {
                  const val = parseInt((e.target as HTMLInputElement).value);
                  if (val > 0) {
                    toggleDay(val);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }} />
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label>Daily Reminders (Start from)</Label>
                  <Select value={dailyFromT} onValueChange={setDailyFromT}>
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="30">30 days prior</SelectItem>
                      <SelectItem value="21">21 days prior</SelectItem>
                      <SelectItem value="14">14 days prior</SelectItem>
                      <SelectItem value="10">10 days prior</SelectItem>
                      <SelectItem value="7">7 days prior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>}
          </div>

          {/* Status Actions */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <Label>Actions</Label>
            {status === "active" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onStatusChange(subscription.id, "pause");
                    onClose();
                  }}
                >
                  Confirm Pause
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancelClick}
                >
                  Confirm Cancel
                </Button>
              </div>
            )}
            {(status === "paused" || status === "canceled") && (
              <Button
                variant="gold"
                className="w-full"
                onClick={() => {
                  onStatusChange(subscription.id, "resume");
                  onClose();
                }}
              >
                Renew Subscription
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-6 sticky bottom-0 bg-background pb-6">
          <Button variant="gold" size="lg" className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="text" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </SheetContent>

      {/* Cancellation Reason Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Please tell us why you're canceling this subscription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason for cancellation *</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please tell us why you're canceling..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellationReason("");
                }}
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmCancel}
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>;
}
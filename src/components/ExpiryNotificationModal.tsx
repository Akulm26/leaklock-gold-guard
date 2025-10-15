import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ExpiryNotificationModalProps {
  open: boolean;
  subscription: { 
    id: string; 
    name: string; 
    provider: string; 
    next_billing_date: string;
    amount: number;
  } | null;
  onKeep: () => void;
  onCancel: () => void;
}

export function ExpiryNotificationModal({
  open,
  subscription,
  onKeep,
  onCancel,
}: ExpiryNotificationModalProps) {
  if (!subscription) return null;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-primary/20">
              <Calendar className="text-primary" size={24} />
            </div>
            <AlertDialogTitle className="text-xl">
              This plan renews soon
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-2">
            <p>
              <span className="font-semibold text-foreground">{subscription.name || subscription.provider}</span> will renew on{" "}
              <span className="font-semibold text-primary">{format(new Date(subscription.next_billing_date), "MMM dd, yyyy")}</span>
            </p>
            <p className="text-2xl font-bold text-primary mt-3">₹{subscription.amount}</p>
            <p className="text-sm">
              Keep it or cancel before the renewal date?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <AlertDialogAction
            onClick={onKeep}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Keep for now
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={onCancel}
            className="w-full mt-0"
          >
            Cancel Subscription
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
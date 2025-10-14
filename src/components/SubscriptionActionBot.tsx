import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink, CheckCircle } from "lucide-react";

interface Subscription {
  id: string;
  merchant_normalized: string;
  plan_name: string;
}

interface Message {
  role: "assistant" | "user";
  content: string;
  hasActions?: boolean;
}

interface SubscriptionActionBotProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  actionType: "pause" | "cancel" | "renew";
  onConfirm: () => void;
}

// Known providers with their action capabilities and instructions
const PROVIDER_INFO: Record<string, {
  allowsPause: boolean;
  cancelSteps?: string[];
  pauseSteps?: string[];
  renewSteps?: string[];
  url?: string;
}> = {
  netflix: {
    allowsPause: false,
    cancelSteps: [
      "Open Netflix app or visit netflix.com",
      "Go to Account settings",
      "Click 'Cancel Membership'",
      "Confirm cancellation",
      "You'll have access until the end of your billing period"
    ],
    renewSteps: [
      "Open Netflix app or visit netflix.com",
      "Go to Account settings",
      "Click 'Restart Membership'",
      "Choose your plan and confirm"
    ],
    url: "https://www.netflix.com/cancelplan"
  },
  spotify: {
    allowsPause: true,
    cancelSteps: [
      "Open Spotify app or visit spotify.com/account",
      "Click on 'Subscription' in the menu",
      "Select 'Cancel Premium'",
      "Follow the prompts to confirm",
      "Premium benefits end at the next billing date"
    ],
    pauseSteps: [
      "Open Spotify app or visit spotify.com/account",
      "Go to Subscription settings",
      "Select 'Pause my subscription'",
      "Choose how long to pause (1-3 months)",
      "Confirm your choice"
    ],
    renewSteps: [
      "Open Spotify app or visit spotify.com/account",
      "Click on 'Subscription'",
      "Select 'Resume Premium'",
      "Confirm to restart your subscription"
    ],
    url: "https://www.spotify.com/account/subscription/"
  },
  "amazon prime": {
    allowsPause: false,
    cancelSteps: [
      "Go to Amazon.in and sign in",
      "Navigate to 'Account & Lists' → 'Prime Membership'",
      "Click 'End Membership'",
      "Follow the cancellation flow",
      "Confirm your choice"
    ],
    renewSteps: [
      "Go to Amazon.in and sign in",
      "Navigate to 'Account & Lists' → 'Prime Membership'",
      "Click 'Restart Your Membership'",
      "Complete the payment process"
    ],
    url: "https://www.amazon.in/mc/manageyourmembership"
  },
  youtube: {
    allowsPause: true,
    cancelSteps: [
      "Open YouTube app or visit youtube.com",
      "Go to Settings → Purchases & memberships",
      "Select your YouTube Premium subscription",
      "Click 'Manage' then 'Cancel subscription'",
      "Confirm cancellation"
    ],
    pauseSteps: [
      "Open YouTube app or visit youtube.com",
      "Go to Settings → Purchases & memberships",
      "Select 'Pause membership'",
      "Choose duration and confirm"
    ],
    renewSteps: [
      "Open YouTube app or visit youtube.com",
      "Go to Settings → Purchases & memberships",
      "Click 'Resume membership'",
      "Confirm to restart"
    ],
    url: "https://www.youtube.com/paid_memberships"
  },
};

export function SubscriptionActionBot({
  isOpen,
  onClose,
  subscription,
  actionType,
  onConfirm
}: SubscriptionActionBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const generateResponse = () => {
    if (!subscription) return;

    const providerName = subscription.merchant_normalized.toLowerCase();
    const providerInfo = PROVIDER_INFO[providerName];

    let content = "";
    let hasActions = false;

    if (actionType === "pause") {
      if (!providerInfo) {
        content = `I don't have specific information about pausing subscriptions for ${subscription.merchant_normalized}. I recommend checking their website or app for pause options in your subscription settings.`;
      } else if (!providerInfo.allowsPause) {
        content = `Unfortunately, ${subscription.merchant_normalized} does not allow pausing subscriptions. You can only cancel or keep it active.`;
      } else if (providerInfo.pauseSteps) {
        content = `Here's how to pause your ${subscription.merchant_normalized} subscription:\n\n${providerInfo.pauseSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\nOnce you've completed these steps, confirm below to update your LeakLock records.`;
        hasActions = true;
      }
    } else if (actionType === "cancel") {
      if (!providerInfo || !providerInfo.cancelSteps) {
        content = `I don't have specific cancellation steps for ${subscription.merchant_normalized}. Here's a general approach:\n\n1. Open the provider's app or website\n2. Navigate to Billing or Subscription settings\n3. Look for 'Manage Subscription' or 'Cancel'\n4. Follow the cancellation flow\n5. Save any confirmation emails\n\nOnce you've completed these steps, confirm below to update your LeakLock records.`;
        hasActions = true;
      } else {
        content = `Here's how to cancel your ${subscription.merchant_normalized} subscription:\n\n${providerInfo.cancelSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\nOnce you've completed these steps, confirm below to update your LeakLock records.`;
        hasActions = true;
      }
    } else if (actionType === "renew") {
      if (!providerInfo || !providerInfo.renewSteps) {
        content = `I don't have specific renewal steps for ${subscription.merchant_normalized}. Generally, you can:\n\n1. Open the provider's app or website\n2. Navigate to your subscription settings\n3. Look for 'Renew' or 'Reactivate'\n4. Complete the payment process\n\nOnce you've completed these steps, confirm below to update your LeakLock records.`;
        hasActions = true;
      } else {
        content = `Here's how to renew your ${subscription.merchant_normalized} subscription:\n\n${providerInfo.renewSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\nOnce you've completed these steps, confirm below to update your LeakLock records.`;
        hasActions = true;
      }
    }

    setMessages([{ role: "assistant", content, hasActions }]);
  };

  const handleOpen = () => {
    if (isOpen && subscription) {
      generateResponse();
      setShowConfirm(false);
    }
  };

  const handleConfirmAction = () => {
    onConfirm();
    onClose();
    setMessages([]);
    setShowConfirm(false);
  };

  const providerInfo = subscription ? PROVIDER_INFO[subscription.merchant_normalized.toLowerCase()] : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (open) handleOpen();
      else {
        onClose();
        setMessages([]);
        setShowConfirm(false);
      }
    }}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Bot className="text-primary" size={20} />
            </div>
            <div>
              <span className="capitalize">{actionType}</span> Subscription
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.map((msg, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p>
              
              {msg.hasActions && (
                <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                  {providerInfo?.url && (
                    <Button
                      variant="gold-outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(providerInfo.url, "_blank")}
                    >
                      <ExternalLink size={16} />
                      Open {subscription?.merchant_normalized} Site
                    </Button>
                  )}
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full"
                    onClick={handleConfirmAction}
                  >
                    <CheckCircle size={16} />
                    I've completed this - Update LeakLock
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

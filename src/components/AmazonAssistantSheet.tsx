import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";

interface AmazonAssistantSheetProps {
  open: boolean;
  subscriptionName: string;
  action: "skip" | "pause" | "cancel";
  onComplete: () => void;
  onClose: () => void;
}

// Mock recipe data - in production this would come from an LLM/database
const getRecipe = (action: "skip" | "pause" | "cancel") => {
  const recipes: Record<string, { known: boolean; steps?: string[] }> = {
    skip: {
      known: true,
      steps: [
        "Open Amazon app or website",
        "Go to 'Your Memberships & Subscriptions'",
        "Select your Subscribe & Save subscription",
        "Tap 'Manage subscription'",
        "Choose 'Skip next delivery'",
        "Confirm the skip"
      ]
    },
    pause: {
      known: true,
      steps: [
        "Open Amazon app or website",
        "Navigate to 'Your Memberships & Subscriptions'",
        "Find your Subscribe & Save item",
        "Tap 'Manage subscription'",
        "Select 'Pause subscription'",
        "Choose duration (1-3 months)",
        "Confirm your pause"
      ]
    },
    cancel: {
      known: true,
      steps: [
        "Open Amazon app or website",
        "Go to 'Your Memberships & Subscriptions'",
        "Select the subscription to cancel",
        "Tap 'Manage subscription'",
        "Choose 'Cancel subscription'",
        "Confirm cancellation"
      ]
    }
  };

  return recipes[action] || { known: false };
};

export function AmazonAssistantSheet({
  open,
  subscriptionName,
  action,
  onComplete,
  onClose,
}: AmazonAssistantSheetProps) {
  const recipe = getRecipe(action);
  const actionLabels = {
    skip: "skip this month",
    pause: "pause",
    cancel: "cancel"
  };

  const handleOpenAmazon = () => {
    // Try Amazon app deep link, fallback to web
    const deepLink = "com.amazon.mobile.shopping.web://";
    const webUrl = "https://www.amazon.in/cpe/yourpayments/settings/managesubscriptions";
    
    // Attempt deep link
    window.location.href = deepLink;
    
    // Fallback to web after delay
    setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 500);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10 mt-1">
              {recipe.known ? (
                <CheckCircle2 className="text-primary" size={20} />
              ) : (
                <AlertCircle className="text-muted-foreground" size={20} />
              )}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl mb-2">
                Manage Amazon Subscribe & Save
              </SheetTitle>
              <SheetDescription className="text-base">
                {subscriptionName}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {recipe.known ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 space-y-3">
              <p className="text-sm font-medium text-foreground">
                Follow these steps to {actionLabels[action]}:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {recipe.steps?.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-medium min-w-[1.5rem]">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 text-base gap-2 border-primary/30"
              onClick={handleOpenAmazon}
            >
              <ExternalLink size={18} />
              Open Amazon
            </Button>

            <Button
              className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onComplete}
            >
              I've completed it
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-3">
                I don't have specific steps for this action yet.
              </p>
              <p className="text-sm text-foreground font-medium mb-2">
                Try these general steps:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">1.</span>
                  <span>Go to Billing or Account Settings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">2.</span>
                  <span>Find "Manage subscription"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">3.</span>
                  <span>Look for Skip / Pause / Cancel options</span>
                </li>
              </ol>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 text-base gap-2 border-primary/30"
              onClick={handleOpenAmazon}
            >
              <ExternalLink size={18} />
              Open Amazon
            </Button>

            <Button
              className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onComplete}
            >
              I've completed it
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
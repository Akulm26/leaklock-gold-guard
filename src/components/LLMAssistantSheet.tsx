import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LLMAssistantSheetProps {
  open: boolean;
  subscription: { id: string; name: string; provider: string } | null;
  action: "pause" | "cancel" | "renew" | null;
  onClose: () => void;
  onCompleted: (subscriptionId: string, action: "pause" | "cancel" | "renew") => void;
}

export function LLMAssistantSheet({
  open,
  subscription,
  action,
  onClose,
  onCompleted,
}: LLMAssistantSheetProps) {
  const [steps, setSteps] = useState<string>("");
  const [providerUrl, setProviderUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pauseUnsupported, setPauseUnsupported] = useState(false);

  useEffect(() => {
    if (open && subscription && action) {
      fetchSteps();
    }
  }, [open, subscription, action]);

  const fetchSteps = async () => {
    if (!subscription || !action) return;

    setLoading(true);
    setPauseUnsupported(false);

    try {
      const { data, error } = await supabase.functions.invoke('subscription-assistant', {
        body: { 
          message: `How do I ${action} my ${subscription.name || subscription.provider} subscription?`,
          serviceName: subscription.name || subscription.provider,
          action
        }
      });

      if (error) throw error;

      setSteps(data.response || "I don't have specific steps for this service.");
      setProviderUrl(data.providerUrl || "#");
      
      if (action === "pause" && data.pauseUnsupported) {
        setPauseUnsupported(true);
        setSteps("This service does not support pausing subscriptions. You can cancel instead and resubscribe later if needed.\n\n" + (data.cancelSteps || ""));
      }
    } catch (error) {
      console.error('Error fetching steps:', error);
      setSteps("I don't know the exact steps for this service. Please visit their website and look for account or billing settings.");
      setProviderUrl("#");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleted = () => {
    if (!subscription || !action) return;
    
    // Set pending change flag
    onCompleted(subscription.id, action);
    toast.success("We'll verify shortly");
    onClose();
  };

  if (!subscription || !action) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Bot className="text-primary" size={24} />
            </div>
            <div>
              <SheetTitle className="text-xl">Subscription Assistant</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {action === "cancel" ? "Cancel" : action === "renew" ? "Renew" : "Pause"} {subscription.name || subscription.provider}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="glass-card rounded-xl p-6 animate-pulse">
              <p className="text-muted-foreground">Getting steps...</p>
            </div>
          ) : (
            <>
              {pauseUnsupported && (
                <div className="glass-card rounded-xl p-4 border-yellow-500/50 bg-yellow-500/10">
                  <p className="text-sm font-medium text-yellow-500 mb-2">⚠️ Pausing Not Supported</p>
                  <p className="text-sm text-muted-foreground">
                    This service doesn't support pausing. Below are cancellation steps instead.
                  </p>
                </div>
              )}

              <div className="glass-card rounded-xl p-6">
                <p className="whitespace-pre-line text-sm leading-relaxed">{steps}</p>
              </div>

              <div className="space-y-3">
                {providerUrl && providerUrl !== "#" && (
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={() => window.open(providerUrl, "_blank")}
                  >
                    <ExternalLink size={20} className="mr-2" />
                    Open Provider
                  </Button>
                )}

                {!loading && steps !== "I don't know the exact steps for this service. Please visit their website and look for account or billing settings." && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleCompleted}
                  >
                    <CheckCircle size={20} className="mr-2" />
                    I've completed it
                  </Button>
                )}

                {steps === "I don't know the exact steps for this service. Please visit their website and look for account or billing settings." && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Try searching: <span className="font-medium text-foreground">"{subscription.name || subscription.provider} {action} subscription"</span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
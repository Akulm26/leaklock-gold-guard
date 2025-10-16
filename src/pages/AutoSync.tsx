import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Sync stages shown to the user during the auto-sync process
 * These are displayed sequentially while the actual sync happens in the background
 */
const SYNC_STAGES = [
  { label: "Connecting to your account", duration: 1500 },
  { label: "Scanning for subscriptions", duration: 2000 },
  { label: "Analyzing subscription patterns", duration: 1800 },
  { label: "Finalizing results", duration: 1200 },
];

export default function AutoSync() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [detectedSubscriptions, setDetectedSubscriptions] = useState<any[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    /**
     * Auto-sync process using Supabase
     * 
     * This effect:
     * 1. Simulates UI progress through sync stages
     * 2. Calls the sync-subscriptions edge function to:
     *    - Fetch subscription templates from database
     *    - Randomly generate 6-9 subscriptions for the user
     *    - Store them in the subscriptions table
     * 3. Handles success/error states and navigation
     */
    const performSync = async () => {
      try {
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error('Session error:', sessionError);
          setError('Authentication required. Please sign in again.');
          toast.error('Authentication required');
          navigate('/');
          return;
        }

        // Start UI progress animation
        const totalDuration = SYNC_STAGES.reduce((sum, stage) => sum + stage.duration, 0);
        let elapsedTime = 0;

        const progressInterval = setInterval(() => {
          elapsedTime += 100;
          const newProgress = Math.min((elapsedTime / totalDuration) * 95, 95);
          setProgress(newProgress);

          // Update current stage based on elapsed time
          let cumulativeDuration = 0;
          for (let i = 0; i < SYNC_STAGES.length; i++) {
            cumulativeDuration += SYNC_STAGES[i].duration;
            if (elapsedTime < cumulativeDuration) {
              setCurrentStage(i);
              break;
            }
          }
        }, 100);

        // Call the sync-subscriptions edge function
        // This creates 6-9 random subscriptions from templates in the database
        console.log('Calling sync-subscriptions function...');
        const { data, error: functionError } = await supabase.functions.invoke(
          'sync-subscriptions',
          {
            headers: {
              Authorization: `Bearer ${sessionData.session.access_token}`,
            },
          }
        );

        clearInterval(progressInterval);

        if (functionError) {
          console.error('Error syncing subscriptions:', functionError);
          setError(functionError.message || 'Failed to sync subscriptions');
          toast.error('Sync failed. Please try again.');
          return;
        }

        console.log('Sync successful:', data);
        
        // Update UI with success state
        setProgress(100);
        setSubscriptionCount(data?.subscriptions?.length || 0);
        setDetectedSubscriptions(data?.subscriptions || []);
        
        // Initialize all as selected
        const initialSelected: Record<string, boolean> = {};
        (data?.subscriptions || []).forEach((sub: any) => {
          initialSelected[sub.id] = true;
        });
        setSelectedSubs(initialSelected);
        
        setIsComplete(true);

        toast.success(`Found ${data?.subscriptions?.length || 0} subscriptions`);

      } catch (err) {
        console.error('Unexpected error during sync:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        toast.error('Sync failed. Please try again.');
      }
    };

    performSync();
  }, [navigate]);

  const handleAccept = async () => {
    const acceptedIds = Object.keys(selectedSubs).filter(id => selectedSubs[id]);
    
    if (acceptedIds.length === 0) {
      toast.info("No subscriptions selected");
      navigate("/dashboard");
      return;
    }

    toast.success(`${acceptedIds.length} subscription${acceptedIds.length > 1 ? 's' : ''} added`);
    navigate("/dashboard");
  };

  const handleReject = async () => {
    // Delete all detected subscriptions from database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .in('id', detectedSubscriptions.map(sub => sub.id));

      if (error) throw error;

      toast.info("Subscriptions rejected");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error rejecting subscriptions:', error);
      toast.error('Failed to reject subscriptions');
    }
  };

  const toggleSubscription = (id: string) => {
    setSelectedSubs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo size="large" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center space-y-12">
          {/* Scanning Animation */}
          <div className="flex justify-center">
            {error ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="text-5xl">⚠️</span>
                </div>
              </div>
            ) : isComplete ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-scale-in gold-glow">
                  <Check className="text-primary" size={64} strokeWidth={3} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-border/20 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-t-primary border-primary/20 animate-spin" />
                </div>
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={48} />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-6">
            {error ? (
              <div className="text-center space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-destructive">Sync Failed</h2>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : isComplete ? (
              <div className="space-y-6 animate-fade-in max-h-[60vh] overflow-y-auto">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Review Detected Subscriptions</h2>
                  <p className="text-sm text-muted-foreground">
                    Select subscriptions to track
                  </p>
                </div>
                
                <div className="space-y-3">
                  {detectedSubscriptions.map((sub) => (
                    <div key={sub.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedSubs[sub.id]}
                          onCheckedChange={() => toggleSubscription(sub.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{sub.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ₹{sub.amount} • Next renewal: {new Date(sub.next_billing_date).toLocaleDateString()}
                          </p>
                          <div className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mt-2">
                            Auto-detected
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  {Object.values(selectedSubs).filter(Boolean).length} of {detectedSubscriptions.length} selected
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-center">
                    {SYNC_STAGES[currentStage]?.label}...
                  </p>
                  <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stage Indicators */}
                <div className="flex justify-center gap-2">
                  {SYNC_STAGES.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index < currentStage
                          ? "bg-primary"
                          : index === currentStage
                          ? "bg-primary animate-pulse"
                          : "bg-border/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        {error ? (
          <Button
            variant="outline"
            size="lg"
            className="w-full animate-fade-in"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        ) : isComplete ? (
          <div className="space-y-3 animate-fade-in">
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleAccept}
            >
              Accept Selected
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleReject}
            >
              Reject All
            </Button>
          </div>
        ) : null}
      </div>
    </MobileLayout>
  );
}

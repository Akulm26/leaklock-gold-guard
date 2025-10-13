import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";

const POPULAR_SERVICES = [
  "Netflix", "Amazon Prime", "Spotify", "YouTube Premium",
  "Disney+ Hotstar", "PhonePe Autopay", "Google One", "Audible"
];

export default function AddManual() {
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    if (!service.trim()) {
      toast.error("Please enter service name");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter valid amount");
      return;
    }
    if (!renewalDate) {
      toast.error("Please select renewal date");
      return;
    }

    // Get existing subscriptions
    const existing = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const newSub = {
      id: Date.now().toString(),
      name: service,
      amount: parseFloat(amount),
      renewal: new Date(renewalDate).toISOString(),
      source: "manual",
      phone: phone || undefined,
    };
    
    localStorage.setItem("subscriptions", JSON.stringify([...existing, newSub]));
    toast.success("Saved to your plans.");
    navigate("/dashboard");
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary/50"
          >
            <ArrowLeft size={20} />
          </Button>
          <Logo />
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Subscription</h1>
            <p className="text-muted-foreground">
              Enter subscription details manually
            </p>
          </div>

          {/* Popular Services */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Popular Services</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => setService(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    service === s
                      ? "bg-primary text-primary-foreground"
                      : "glass-card hover:border-primary/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Service Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., Netflix, Spotify"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-transparent border-none focus-visible:ring-0"
              />
            </div>

            <div className="glass-card rounded-xl p-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Plan Amount (₹) *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 flex-1"
                />
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Next Renewal Date *
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground" size={18} />
                <Input
                  type="date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 flex-1"
                />
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Phone Number (Optional)
              </label>
              <Input
                type="tel"
                placeholder="+91"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            Save Plan
          </Button>
          <Button
            variant="text"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

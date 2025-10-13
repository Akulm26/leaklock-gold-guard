import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Shield, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const phone = localStorage.getItem("phone");

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const settingSections = [
    {
      title: "Profile & Account",
      items: [
        { icon: User, label: "Name", value: userName, action: () => {} },
        { icon: Shield, label: "Linked Number", value: `+91 ${phone}`, action: () => {} },
      ],
    },
    {
      title: "Permissions & Privacy",
      items: [
        { 
          icon: Shield, 
          label: "SMS Access", 
          value: "Granted", 
          action: () => toast.info("SMS permission is active") 
        },
      ],
    },
    {
      title: "Subscriptions",
      items: [
        { 
          icon: CreditCard, 
          label: "Manage Plans", 
          value: null, 
          action: () => navigate("/dashboard") 
        },
      ],
    },
  ];

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-8 pb-24 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>

          {settingSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="glass-card rounded-xl overflow-hidden">
                {section.items.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors ${
                      index !== section.items.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="text-muted-foreground" size={20} />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Advanced analytics & multi-account sync — coming soon.
            </p>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="gold-outline"
          size="lg"
          className="w-full mt-6"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, Settings as SettingsIcon } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/add-manual", icon: Plus, label: "Add" },
    { path: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-primary/20 safe-area-bottom z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={24} className={isActive ? "gold-glow" : ""} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

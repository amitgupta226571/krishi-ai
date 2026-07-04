import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Camera,
  Bot,
  CloudSun,
  TrendingUp,
  FlaskConical,
  Store,
  History,
  User as UserIcon,
  LayoutGrid,
  LogOut,
  Menu,
  X,
  Leaf,
} from "lucide-react";
import logo from "@/assets/krishi-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/dashboard/disease", label: "Disease Scan", icon: Camera },
  { to: "/dashboard/chat", label: "AI Chat", icon: Bot },
  { to: "/dashboard/weather", label: "Weather", icon: CloudSun },
  { to: "/dashboard/yield", label: "Yield Prediction", icon: TrendingUp },
  { to: "/dashboard/fertilizer", label: "Fertilizer Planner", icon: FlaskConical },
  { to: "/dashboard/market", label: "Market Prices", icon: Store },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar text-sidebar-foreground p-4 z-40">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <img src={logo} alt="" className="w-9 h-9" />
          <div>
            <div className="font-display font-bold text-lg leading-none text-white">KrishiAI</div>
            <div className="text-[10px] text-sidebar-foreground/70 mt-0.5">
              Farming, upgraded
            </div>
          </div>
        </Link>
        <nav className="mt-8 space-y-1 flex-1">
          {NAV.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 rounded-2xl bg-sidebar-accent p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-glow flex items-center justify-center text-primary-foreground font-bold">
              {email[0]?.toUpperCase() ?? "F"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-sidebar-foreground/70">Signed in</div>
              <div className="text-sm truncate">{email || "Farmer"}</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="p-2 rounded-lg hover:bg-sidebar-primary/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center gap-3 p-4 sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
        <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-muted">
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="w-7 h-7" />
          <span className="font-display font-bold">KrishiAI</span>
        </Link>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="" className="w-8 h-8" />
                <span className="font-display font-bold text-white">KrishiAI</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-6 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to as never}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button
              variant="outline"
              className="w-full mt-6 bg-transparent border-sidebar-border text-white hover:bg-sidebar-accent"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      )}

      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-2">
          {title}
          <Leaf className="w-5 h-5 text-primary-glow" />
        </h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

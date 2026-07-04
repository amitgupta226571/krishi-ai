import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  Bot,
  CloudSun,
  TrendingUp,
  FlaskConical,
  Store,
  History as HistoryIcon,
  BookOpen,
  Wind,
  Droplets,
  Sun,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, listReports } from "@/lib/reports.functions";
import { weatherTip } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function DashboardHome() {
  const [name, setName] = useState<string>("");
  const fetchProfile = useServerFn(getProfile);
  const fetchReports = useServerFn(listReports);
  const fetchTip = useServerFn(weatherTip);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setName((data.user?.user_metadata?.name as string) || "Farmer"));
  }, []);

  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const reportsQ = useQuery({ queryKey: ["reports"], queryFn: () => fetchReports() });
  const tipQ = useQuery({
    queryKey: ["tip"],
    queryFn: () => fetchTip({ data: { location: profileQ.data?.state, crop: profileQ.data?.crop } }),
    enabled: !!profileQ.data,
  });

  const displayName = profileQ.data?.name || name;

  const modules = [
    { to: "/dashboard/disease", icon: Camera, label: "Detect Disease", tone: "from-primary/30 to-primary/5", desc: "Scan a leaf" },
    { to: "/dashboard/chat", icon: Bot, label: "Ask AI", tone: "from-sky/40 to-sky/5", desc: "Chat with agronomist" },
    { to: "/dashboard/weather", icon: CloudSun, label: "Weather", tone: "from-sun/40 to-sun/5", desc: "7-day forecast" },
    { to: "/dashboard/yield", icon: TrendingUp, label: "Yield", tone: "from-earth/30 to-earth/5", desc: "Predict harvest" },
    { to: "/dashboard/fertilizer", icon: FlaskConical, label: "Fertilizer", tone: "from-primary-glow/40 to-primary-glow/5", desc: "NPK planner" },
    { to: "/dashboard/market", icon: Store, label: "Market", tone: "from-accent to-accent/20", desc: "Mandi prices" },
    { to: "/dashboard/history", icon: HistoryIcon, label: "History", tone: "from-secondary to-secondary/50", desc: "Past scans" },
    { to: "/dashboard/profile", icon: BookOpen, label: "Profile", tone: "from-muted to-muted/40", desc: "My farm" },
  ] as const;

  return (
    <div>
      {/* Hero greeting + weather card */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-8">
        <div
          className="relative rounded-3xl p-8 md:p-10 text-white overflow-hidden shadow-glow"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="text-sm opacity-80">{greeting()},</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-1">
            {displayName} 🌾
          </h1>
          <p className="mt-3 max-w-md text-white/85">
            {tipQ.data?.tip ??
              "Loading today's field tip from your AI agronomist..."}
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/dashboard/disease"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 text-primary px-5 py-2.5 text-sm font-semibold hover:bg-white"
            >
              <Camera className="w-4 h-4" /> Scan a crop
            </Link>
            <Link
              to="/dashboard/chat"
              className="inline-flex items-center gap-2 rounded-full glass-dark text-white px-5 py-2.5 text-sm font-semibold"
            >
              <Bot className="w-4 h-4" /> Ask AI
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-card border shadow-card p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Today</div>
              <div className="font-display text-3xl font-bold mt-1">28°C</div>
              <div className="text-sm text-muted-foreground">Sunny · {profileQ.data?.village ?? "Your village"}</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-sun/20 flex items-center justify-center">
              <Sun className="w-9 h-9 text-earth" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <MiniStat icon={Droplets} label="Humidity" value="68%" />
            <MiniStat icon={CloudSun} label="Rain" value="40%" />
            <MiniStat icon={Wind} label="Wind" value="12" />
          </div>
        </div>
      </div>

      {/* Module cards */}
      <h2 className="text-xl font-display font-bold mb-4">Your farming toolkit</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className={`group rounded-3xl p-6 bg-gradient-to-br ${m.tone} border border-border/60 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all`}
          >
            <div className="w-11 h-11 rounded-xl bg-background/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <m.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="font-display font-bold text-lg">{m.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
            <ArrowRight className="w-4 h-4 mt-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>

      {/* Recent scans */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold">Recent scans</h2>
          <Link to="/dashboard/history" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {reportsQ.isLoading ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (reportsQ.data?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-10 text-center text-muted-foreground">
            No scans yet.{" "}
            <Link to="/dashboard/disease" className="text-primary underline">
              Try your first scan
            </Link>
            .
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {reportsQ.data?.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-2xl bg-card border p-5 shadow-soft">
                <div className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
                <div className="font-display font-bold text-lg mt-1">{r.disease}</div>
                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${r.health_score}%` }}
                  />
                </div>
                <div className="text-xs mt-2 text-muted-foreground">
                  Health {r.health_score}% · {r.confidence}% conf.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3 text-center">
      <Icon className="w-4 h-4 mx-auto text-primary" />
      <div className="text-lg font-bold mt-1">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

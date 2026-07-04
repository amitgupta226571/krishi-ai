import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Droplets, Wind, Sun, Cloud, CloudRain, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { weatherTip } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/dashboard/weather")({
  component: WeatherPage,
});

const DAYS = ["Today", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ICONS = [Sun, Sun, Cloud, CloudRain, CloudRain, Cloud, Sun];
const TEMPS = [28, 30, 27, 24, 23, 26, 29];
const RAIN = [10, 5, 40, 80, 70, 30, 15];

function WeatherPage() {
  const tipFn = useServerFn(weatherTip);
  const tipQ = useQuery({ queryKey: ["tip-full"], queryFn: () => tipFn({ data: {} }) });

  return (
    <div>
      <PageHeader icon={CloudSun} title="Weather" subtitle="AI-powered 7-day forecast for your fields." />

      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-glow"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl animate-drift" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-sm opacity-80">Today · Sunny</div>
            <div className="font-display text-7xl font-bold mt-1">28°</div>
            <div className="mt-2 flex gap-4 text-sm opacity-90">
              <span>Feels 31°</span>
              <span>H 32° · L 22°</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Droplets} label="Humidity" value="68%" />
            <Stat icon={Cloud} label="Rain" value="40%" />
            <Stat icon={Wind} label="Wind" value="12 km/h" />
          </div>
        </div>
      </div>

      {/* AI recommendation */}
      <div className="mt-6 rounded-3xl border bg-gradient-to-br from-primary/10 to-transparent p-6 flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">
            AI Recommendation
          </div>
          <p className="mt-1 text-lg font-medium">
            {tipQ.data?.tip ?? "Preparing today's tip from your AI agronomist..."}
          </p>
        </div>
      </div>

      {/* 7-day */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-bold mb-4">7-day forecast</h2>
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {DAYS.map((d, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={d}
                className="rounded-2xl bg-card border p-4 text-center shadow-soft hover:shadow-card transition"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{d}</div>
                <Icon className="w-8 h-8 mx-auto my-3 text-primary" />
                <div className="font-display text-2xl font-bold">{TEMPS[i]}°</div>
                <div className="text-xs text-sky mt-1">{RAIN[i]}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-dark rounded-2xl p-4 text-center">
      <Icon className="w-5 h-5 mx-auto opacity-80" />
      <div className="text-xl font-bold mt-1">{value}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}

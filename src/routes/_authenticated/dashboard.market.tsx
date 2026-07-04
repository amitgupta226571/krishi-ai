import { createFileRoute } from "@tanstack/react-router";
import { Store, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export const Route = createFileRoute("/_authenticated/dashboard/market")({
  component: MarketPage,
});

const CROPS = [
  { name: "Wheat", price: 2450, unit: "/quintal", change: 2.4, best: "Fri" },
  { name: "Rice (Paddy)", price: 2180, unit: "/quintal", change: -1.1, best: "Mon" },
  { name: "Tomato", price: 34, unit: "/kg", change: 8.2, best: "Wed" },
  { name: "Cotton", price: 6900, unit: "/quintal", change: 3.6, best: "Thu" },
  { name: "Sugarcane", price: 340, unit: "/quintal", change: 0.4, best: "Fri" },
  { name: "Onion", price: 28, unit: "/kg", change: -3.5, best: "Sat" },
];

const MANDIS = [
  { name: "Azadpur Mandi", city: "Delhi", distance: "12 km" },
  { name: "Vashi APMC", city: "Mumbai", distance: "35 km" },
  { name: "Yeshwanthpur", city: "Bengaluru", distance: "22 km" },
];

function MarketPage() {
  return (
    <div>
      <PageHeader icon={Store} title="Market Prices" subtitle="Live mandi prices and AI trend prediction." />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CROPS.map((c) => {
          const up = c.change >= 0;
          return (
            <div key={c.name} className="rounded-3xl bg-card border p-6 shadow-soft hover:shadow-card transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.name}</div>
                  <div className="font-display text-3xl font-bold mt-1">₹{c.price}</div>
                  <div className="text-xs text-muted-foreground">{c.unit}</div>
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    up ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {up ? "+" : ""}
                  {c.change}%
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Best selling day:</span>
                <span className="font-semibold text-primary">{c.best}</span>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Nearby mandis</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {MANDIS.map((m) => (
          <div key={m.name} className="rounded-2xl bg-card border p-5 shadow-soft flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-earth/15 text-earth flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-muted-foreground">
                {m.city} · {m.distance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

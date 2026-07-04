import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerFn } from "@tanstack/react-start";
import { predictYield } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/yield")({
  component: YieldPage,
});

type Prediction = {
  expected_yield_tons: number;
  yield_per_acre: number;
  confidence: number;
  profit_estimate_inr: number;
  risk_factors: string[];
  recommendations: string[];
  trend: { month: string; growth: number }[];
};

function YieldPage() {
  const [form, setForm] = useState({
    crop: "Wheat",
    area: "5",
    rainfall: "600",
    temperature: "26",
    soil: "Loamy",
    previous: "3.5",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);
  const predict = useServerFn(predictYield);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = (await predict({ data: form })) as Prediction;
      setResult(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader icon={TrendingUp} title="Yield Prediction" subtitle="ML-powered forecast of your season's harvest." />
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <form onSubmit={submit} className="rounded-3xl bg-card border p-6 shadow-soft space-y-4">
          <Field label="Crop" value={form.crop} onChange={setField("crop")} />
          <Field label="Land area (acres)" value={form.area} onChange={setField("area")} type="number" />
          <Field label="Rainfall (mm)" value={form.rainfall} onChange={setField("rainfall")} type="number" />
          <Field label="Avg temperature (°C)" value={form.temperature} onChange={setField("temperature")} type="number" />
          <Field label="Soil type" value={form.soil} onChange={setField("soil")} />
          <Field label="Previous yield (t/acre)" value={form.previous} onChange={setField("previous")} type="number" />
          <Button type="submit" className="w-full h-11 rounded-xl shadow-glow" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Predict yield"}
          </Button>
        </form>

        <div className="space-y-4">
          {!result ? (
            <div className="rounded-3xl border-2 border-dashed p-12 text-center text-muted-foreground h-full flex items-center justify-center">
              Fill in the details and get a personalized prediction.
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <Big label="Expected yield" value={`${result.expected_yield_tons} t`} tone="primary" />
                <Big label="Per acre" value={`${result.yield_per_acre} t`} />
                <Big label="Est. profit" value={`₹${(result.profit_estimate_inr ?? 0).toLocaleString()}`} tone="earth" />
              </div>
              <div className="rounded-3xl bg-card border p-6 shadow-soft">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Growth trend
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={result.trend ?? []}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                      }}
                    />
                    <Bar dataKey="growth" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ListCard title="Recommendations" items={result.recommendations ?? []} tone="primary" />
                <ListCard title="Risk factors" items={result.risk_factors ?? []} tone="earth" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="h-10 rounded-xl" />
    </div>
  );
}

function Big({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "primary" | "earth" }) {
  const bg = tone === "primary" ? "bg-primary text-primary-foreground" : tone === "earth" ? "bg-earth text-earth-foreground" : "bg-card border";
  return (
    <div className={`rounded-2xl ${bg} p-5 shadow-soft`}>
      <div className="text-xs uppercase tracking-widest opacity-80">{label}</div>
      <div className="font-display text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "primary" | "earth" }) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "earth" ? "bg-earth/10" : "bg-primary/10"}`}>
      <div className="text-xs uppercase tracking-widest font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${tone === "earth" ? "bg-earth" : "bg-primary"}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

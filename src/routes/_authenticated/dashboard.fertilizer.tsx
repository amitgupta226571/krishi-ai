import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, Loader2, CalendarDays, Sprout, Coins } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerFn } from "@tanstack/react-start";
import { planFertilizer } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/fertilizer")({
  component: FertilizerPage,
});

type Plan = {
  npk_ratio: string;
  primary_fertilizer: string;
  quantity_kg_per_acre: number;
  schedule: { week: string; action: string; quantity: string }[];
  organic_alternative: string;
  cost_estimate_inr: number;
  tips: string[];
};

function FertilizerPage() {
  const [form, setForm] = useState({
    crop: "Tomato",
    soil: "Loamy",
    area: "2",
    stage: "Vegetative",
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const planFn = useServerFn(planFertilizer);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = (await planFn({ data: form })) as Plan;
      setPlan(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        icon={FlaskConical}
        title="Fertilizer Planner"
        subtitle="Personalized NPK schedule with organic alternatives."
      />
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <form onSubmit={submit} className="rounded-3xl bg-card border p-6 shadow-soft space-y-4">
          <F label="Crop" v={form.crop} on={setField("crop")} />
          <F label="Soil type" v={form.soil} on={setField("soil")} />
          <F label="Area (acres)" v={form.area} on={setField("area")} type="number" />
          <F label="Growth stage" v={form.stage} on={setField("stage")} />
          <Button type="submit" className="w-full h-11 rounded-xl shadow-glow" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate plan"}
          </Button>
        </form>

        <div className="space-y-4">
          {!plan ? (
            <div className="rounded-3xl border-2 border-dashed p-12 text-center text-muted-foreground h-full flex items-center justify-center">
              Enter crop details for a custom NPK plan.
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <Big label="NPK Ratio" value={plan.npk_ratio} tone="primary" />
                <Big label="Primary" value={plan.primary_fertilizer} />
                <Big label="Cost estimate" value={`₹${(plan.cost_estimate_inr ?? 0).toLocaleString()}`} tone="earth" icon={Coins} />
              </div>

              <div className="rounded-3xl bg-card border p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <div className="text-xs uppercase tracking-widest font-semibold">Application schedule</div>
                </div>
                <div className="space-y-3">
                  {plan.schedule?.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-14 shrink-0 rounded-lg bg-primary/10 text-primary text-center py-1.5 text-xs font-semibold">
                        {s.week}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.action}</div>
                        <div className="text-xs text-muted-foreground">{s.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-earth/10 border p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sprout className="w-4 h-4 text-earth" />
                  <div className="text-xs uppercase tracking-widest font-semibold">Organic alternative</div>
                </div>
                <p className="text-sm">{plan.organic_alternative}</p>
              </div>

              <div className="rounded-3xl bg-primary/5 border p-6">
                <div className="text-xs uppercase tracking-widest font-semibold mb-3">Tips</div>
                <ul className="space-y-1.5 text-sm">
                  {plan.tips?.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 bg-primary shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function F({ label, v, on, type = "text" }: { label: string; v: string; on: (s: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={v} onChange={(e) => on(e.target.value)} type={type} className="h-10 rounded-xl" />
    </div>
  );
}

function Big({
  label,
  value,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  tone?: "default" | "primary" | "earth";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const bg = tone === "primary" ? "bg-primary text-primary-foreground" : tone === "earth" ? "bg-earth text-earth-foreground" : "bg-card border";
  return (
    <div className={`rounded-2xl ${bg} p-5 shadow-soft`}>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest opacity-80">{label}</div>
        {Icon && <Icon className="w-4 h-4 opacity-70" />}
      </div>
      <div className="font-display text-2xl font-bold mt-1 truncate">{value}</div>
    </div>
  );
}

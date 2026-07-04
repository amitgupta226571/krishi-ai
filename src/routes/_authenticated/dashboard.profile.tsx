import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User as UserIcon, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProfile, updateProfile } from "@/lib/reports.functions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
});

const LANGS = ["English", "Hindi", "Punjabi", "Marathi", "Tamil", "Telugu", "Bhojpuri", "Bengali"];

function ProfilePage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getProfile);
  const updateFn = useServerFn(updateProfile);
  const q = useQuery({ queryKey: ["profile"], queryFn: () => getFn() });

  const [form, setForm] = useState({
    name: "",
    village: "",
    state: "",
    crop: "",
    farm_size: "",
    language: "English",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (q.data) {
      setForm({
        name: q.data.name ?? "",
        village: q.data.village ?? "",
        state: q.data.state ?? "",
        crop: q.data.crop ?? "",
        farm_size: q.data.farm_size ?? "",
        language: q.data.language ?? "English",
      });
    }
  }, [q.data]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateFn({ data: form });
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader icon={UserIcon} title="Your Profile" subtitle="Personalize your KrishiAI experience." />

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 border p-8 text-center h-fit shadow-soft">
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center font-display text-4xl font-bold shadow-glow">
            {(form.name || "F")[0].toUpperCase()}
          </div>
          <div className="mt-4 font-display font-bold text-xl">{form.name || "Farmer"}</div>
          {form.village && <div className="text-sm text-muted-foreground">{form.village}, {form.state}</div>}
          {form.crop && (
            <div className="mt-4 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              🌾 {form.crop}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-card border p-6 shadow-soft space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="Full name" v={form.name} on={(v) => setForm((f) => ({ ...f, name: v }))} />
            <F label="Village" v={form.village} on={(v) => setForm((f) => ({ ...f, village: v }))} />
            <F label="State" v={form.state} on={(v) => setForm((f) => ({ ...f, state: v }))} />
            <F label="Primary crop" v={form.crop} on={(v) => setForm((f) => ({ ...f, crop: v }))} />
            <F label="Farm size (acres)" v={form.farm_size} on={(v) => setForm((f) => ({ ...f, farm_size: v }))} />
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select value={form.language} onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl shadow-glow" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save changes</>}
          </Button>
        </form>
      </div>
    </div>
  );
}

function F({ label, v, on }: { label: string; v: string; on: (s: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={v} onChange={(e) => on(e.target.value)} className="h-10 rounded-xl" />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Upload, Loader2, Leaf, Shield, Pill, Sprout, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { analyzeCropImage } from "@/lib/ai.functions";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard/disease")({
  component: DiseasePage,
});

type Report = {
  id: string;
  disease: string;
  confidence: number;
  health_score: number;
  severity: string;
  symptoms: string;
  treatment: string;
  medicine: string;
  organic: string;
  recovery: string;
  crop: string;
  image_url: string | null;
};

const STAGES = [
  "Uploading image...",
  "Scanning leaf...",
  "Analyzing disease...",
  "Checking confidence...",
  "Generating report...",
];

function DiseasePage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [stage, setStage] = useState<number>(-1);
  const [report, setReport] = useState<Report | null>(null);
  const analyze = useServerFn(analyzeCropImage);
  const qc = useQueryClient();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image");
      return;
    }
    setReport(null);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setStage(0);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Not signed in");

      const path = `${uid}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`;
      const { error: upErr } = await supabase.storage.from("crop-images").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;

      setStage(1);
      const { data: signed, error: sErr } = await supabase.storage
        .from("crop-images")
        .createSignedUrl(path, 60 * 60);
      if (sErr) throw sErr;

      setStage(2);
      const timer = setInterval(() => setStage((s) => Math.min(s + 1, 4)), 900);
      const result = (await analyze({ data: { imageUrl: signed.signedUrl } })) as Report;
      clearInterval(timer);
      setStage(-1);
      setReport({ ...result, image_url: signed.signedUrl });
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Diagnosis ready");
    } catch (e) {
      setStage(-1);
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div>
      <PageHeader icon={Camera} title="Disease Detection" subtitle="Upload a crop image and get an AI diagnosis in seconds." />

      {!report && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-10 md:p-16 text-center hover:bg-primary/10 transition-colors"
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="max-h-72 mx-auto rounded-2xl shadow-card object-contain"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto">
              <Upload className="w-9 h-9 text-primary" />
            </div>
          )}
          <div className="mt-6 font-display text-2xl font-bold">Drop your crop image here</div>
          <p className="text-muted-foreground mt-1">or pick from your gallery / camera</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              className="rounded-full h-11 px-6"
              onClick={() => fileInput.current?.click()}
              disabled={stage >= 0}
            >
              <Upload className="w-4 h-4 mr-2" /> Choose image
            </Button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              ref={fileInput}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {stage >= 0 && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">{STAGES[stage]}</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {report && <ReportView report={report} onReset={() => { setReport(null); setPreview(null); }} />}
    </div>
  );
}

function ReportView({ report, onReset }: { report: Report; onReset: () => void }) {
  const healthy = report.disease.toLowerCase() === "healthy" || report.health_score >= 85;
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
      <div className="rounded-3xl bg-card border shadow-card overflow-hidden">
        {report.image_url && (
          <img src={report.image_url} alt="" className="w-full aspect-square object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {report.crop || "Crop"}
              </div>
              <div className="font-display text-2xl font-bold">{report.disease}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Confidence</div>
              <div className="text-2xl font-bold text-primary">{report.confidence}%</div>
            </div>
          </div>
          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Health meter
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${report.health_score}%`,
                  background: healthy ? "var(--gradient-hero)" : "var(--gradient-sun)",
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {report.health_score}% · Severity: {report.severity}
            </div>
          </div>
          <Button onClick={onReset} variant="outline" className="w-full mt-6 rounded-xl">
            Scan another image
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <ReportCard icon={Leaf} title="Symptoms" body={report.symptoms} />
        <ReportCard icon={Shield} title="Treatment plan" body={report.treatment} tone="primary" />
        <ReportCard icon={Pill} title="Medicine" body={report.medicine} />
        <ReportCard icon={Sprout} title="Organic solution" body={report.organic} tone="earth" />
        <ReportCard icon={Clock} title="Expected recovery" body={report.recovery} />
      </div>
    </div>
  );
}

function ReportCard({
  icon: Icon,
  title,
  body,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tone?: "default" | "primary" | "earth";
}) {
  const bg =
    tone === "primary" ? "bg-primary/10" : tone === "earth" ? "bg-earth/10" : "bg-card";
  const iconColor = tone === "earth" ? "text-earth" : "text-primary";
  return (
    <div className={`rounded-2xl ${bg} border p-5 shadow-soft`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <div className="font-semibold text-sm uppercase tracking-widest">{title}</div>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}

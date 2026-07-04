import { createFileRoute, Link } from "@tanstack/react-router";
import { History as HistoryIcon, Camera } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listReports } from "@/lib/reports.functions";

export const Route = createFileRoute("/_authenticated/dashboard/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const fn = useServerFn(listReports);
  const q = useQuery({ queryKey: ["reports"], queryFn: () => fn() });

  return (
    <div>
      <PageHeader icon={HistoryIcon} title="Disease History" subtitle="Every scan, treatment, and recovery in one timeline." />

      {q.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : !q.data?.length ? (
        <div className="rounded-3xl border-2 border-dashed p-12 text-center">
          <Camera className="w-10 h-10 mx-auto text-muted-foreground" />
          <div className="mt-3 font-medium">No scans yet</div>
          <Link to="/dashboard/disease" className="text-primary underline mt-1 inline-block">
            Try your first disease scan
          </Link>
        </div>
      ) : (
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-primary/20" />
          {q.data.map((r) => (
            <div key={r.id} className="relative mb-6">
              <div className="absolute -left-[26px] top-4 w-4 h-4 rounded-full bg-primary shadow-glow border-4 border-background" />
              <div className="rounded-2xl bg-card border p-5 shadow-soft flex gap-4 items-start">
                {r.image_url ? (
                  <img src={r.image_url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-display font-bold text-lg">{r.disease}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {r.severity}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(r.created_at).toLocaleString()} · {r.crop || "Crop"}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${r.health_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      Health {r.health_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

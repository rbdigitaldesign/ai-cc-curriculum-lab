import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QUESTIONS, pushAssignments } from "@/lib/curriculum-store";
import { Shuffle, Send, Copy, ExternalLink, Download } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

export default function TutorDashboard() {
  const studentUrl = `${window.location.origin}/student`;
  const [tableCount, setTableCount] = useState(6);
  const [assignments, setLocal] = useState<Record<number, number>>({});

  const handleAssign = (table: number, questionId: string) => {
    setLocal((prev) => ({ ...prev, [table]: Number(questionId) }));
  };

  const randomise = useCallback(() => {
    const newAssignments: Record<number, number> = {};
    for (let i = 1; i <= tableCount; i++) {
      newAssignments[i] = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)].id;
    }
    setLocal(newAssignments);
  }, [tableCount]);

  const push = async () => {
    const complete = Array.from({ length: tableCount }, (_, i) => i + 1).every(
      (t) => assignments[t]
    );
    if (!complete) {
      toast.error("Please assign a question to every table first.");
      return;
    }
    const result = await pushAssignments(assignments);
    if (result.success) {
      toast.success("Questions pushed to all tables!");
    } else {
      toast.error(result.error || "Failed to push questions.");
    }
  };

  const randomiseAndPush = async () => {
    const newAssignments: Record<number, number> = {};
    for (let i = 1; i <= tableCount; i++) {
      newAssignments[i] = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)].id;
    }
    setLocal(newAssignments);
    const result = await pushAssignments(newAssignments);
    if (result.success) {
      toast.success("Questions randomised and pushed!");
    } else {
      toast.error(result.error || "Failed to push questions.");
    }
  };

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-5 sm:px-8">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Curriculum Lab
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tutor Dashboard</p>
          </div>
          <Link to="/student">
            <Button variant="outline" size="sm">Student View →</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8 space-y-8">
        {/* Student access */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 bg-white p-2 rounded-lg">
              <QRCodeSVG id="qr-code" value={studentUrl} size={140} />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <p className="text-sm font-semibold text-foreground">Student Access Link</p>
              <p className="text-xs text-muted-foreground">Share this URL, display the QR code, or download it for your slides.</p>
              <code className="block text-sm bg-muted px-3 py-1.5 rounded-md text-foreground break-all select-all">{studentUrl}</code>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(studentUrl);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`${window.location.origin}/join`, "_blank")}
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open in New Tab
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const svg = document.getElementById("qr-code");
                    if (!svg) return;
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement("canvas");
                    canvas.width = 600;
                    canvas.height = 600;
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    img.onload = () => {
                      ctx!.fillStyle = "white";
                      ctx!.fillRect(0, 0, 600, 600);
                      ctx!.drawImage(img, 0, 0, 600, 600);
                      const a = document.createElement("a");
                      a.download = "curriculum-lab-qr.png";
                      a.href = canvas.toDataURL("image/png");
                      a.click();
                    };
                    img.src = "data:image/svg+xml;base64," + btoa(svgData);
                  }}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download QR
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Total Tables in Room</label>
          <Input
            type="number"
            min={1}
            max={50}
            value={tableCount}
            onChange={(e) => {
              const v = Math.max(1, Math.min(50, Number(e.target.value) || 1));
              setTableCount(v);
            }}
            className="max-w-[160px]"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={randomise} variant="secondary">
            <Shuffle className="mr-2 h-4 w-4" /> Randomise
          </Button>
          <Button onClick={randomiseAndPush} variant="default">
            <Shuffle className="mr-2 h-4 w-4" /> Randomise & Push
          </Button>
          <Button onClick={push} variant="outline">
            <Send className="mr-2 h-4 w-4" /> Push Current
          </Button>
        </div>

        {/* Table assignments */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] bg-muted text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <div className="px-4 py-3">Table</div>
            <div className="px-4 py-3">Assigned Question</div>
          </div>
          {tables.map((t) => (
            <div
              key={t}
              className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] border-t border-border items-center"
            >
              <div className="px-4 py-3 font-mono font-bold text-foreground">{t}</div>
              <div className="px-4 py-3">
                <Select
                  value={assignments[t]?.toString() ?? ""}
                  onValueChange={(v) => handleAssign(t, v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a question…" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTIONS.map((q) => (
                      <SelectItem key={q.id} value={q.id.toString()}>
                        {q.id}. {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

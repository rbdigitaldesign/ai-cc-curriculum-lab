import { useState, useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QUESTIONS, DISCUSSION_STEPS, getAssignments, subscribe } from "@/lib/curriculum-store";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function useAssignments() {
  return useSyncExternalStore(subscribe, getAssignments);
}

export default function StudentView() {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const assignments = useAssignments();

  const questionId = tableNumber ? assignments[tableNumber] : undefined;
  const question = questionId ? QUESTIONS.find((q) => q.id === questionId) : undefined;

  if (tableNumber === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Curriculum Lab</h1>
            <p className="text-muted-foreground mt-1 text-sm">Enter your table number to begin</p>
          </div>
          <div className="space-y-3">
            <Input
              type="number"
              min={1}
              placeholder="Table Number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-center text-lg"
              autoFocus
            />
            <Button
              className="w-full"
              disabled={!inputValue || Number(inputValue) < 1}
              onClick={() => setTableNumber(Number(inputValue))}
            >
              Connect
            </Button>
          </div>
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-3 w-3" /> Tutor Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Table <span className="font-bold text-foreground">{tableNumber}</span>
        </span>
        <button
          onClick={() => setTableNumber(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Change table
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        {question ? (
          <div className="max-w-2xl text-center space-y-6">
            <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {question.title}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-foreground">
              {question.text}
            </h2>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground text-sm">Waiting for your tutor to push a question…</p>
          </div>
        )}
      </main>

      {/* Discussion Framework footer */}
      <footer className="border-t border-border bg-muted px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
          Discussion Framework
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
          {DISCUSSION_STEPS.map((step, i) => (
            <div
              key={i}
              className="rounded-md bg-card border border-border px-3 py-2 text-center"
            >
              <span className="block text-xs font-bold text-primary">{i + 1}</span>
              <span className="text-xs text-foreground font-medium">{step}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

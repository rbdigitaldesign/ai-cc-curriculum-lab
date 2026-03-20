import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QUESTIONS, DISCUSSION_STEPS, subscribeToAssignments } from "@/lib/curriculum-store";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, AlertTriangle } from "lucide-react";

export default function StudentView() {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    try {
      const unsubscribe = subscribeToAssignments((data) => {
        setAssignments(data);
        setConnectionError(false);
      });
      // If no data after 15s, show connection warning
      timeout = setTimeout(() => {
        setConnectionError(true);
      }, 15000);
      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch {
      setConnectionError(true);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Clear connection error once we get data
  useEffect(() => {
    if (Object.keys(assignments).length > 0) {
      setConnectionError(false);
    }
  }, [assignments]);

  const handleConnect = () => {
    const num = Number(inputValue);
    if (!Number.isInteger(num) || num < 1) {
      setError("Please enter a valid table number (1 or above).");
      return;
    }
    // Check if table exists in current assignments
    const hasAssignments = Object.keys(assignments).length > 0;
    if (hasAssignments && !assignments[num]) {
      const maxTable = Math.max(...Object.keys(assignments).map(Number));
      setError(`Table ${num} doesn't exist. Tables 1–${maxTable} are available.`);
      return;
    }
    setError(null);
    setTableNumber(num);
  };

  const questionId = tableNumber ? assignments[tableNumber] : undefined;
  const question = questionId ? QUESTIONS.find((q) => q.id === questionId) : undefined;

  // If tutor changed table count and this table no longer exists
  const tableRemoved = tableNumber !== null && Object.keys(assignments).length > 0 && !assignments[tableNumber];

  if (tableNumber === null || tableRemoved) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Curriculum Lab</h1>
            <p className="text-muted-foreground mt-1 text-sm">Enter your table number to begin</p>
          </div>

          {tableRemoved && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Table {tableNumber} is no longer active. Please select a different table.
              </AlertDescription>
            </Alert>
          )}

          {connectionError && Object.keys(assignments).length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Waiting for tutor to start the session. You can still enter your table number.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Input
              type="number"
              min={1}
              placeholder="Table Number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConnect();
              }}
              className="text-center text-lg"
              autoFocus
            />
            <Button
              className="w-full"
              disabled={!inputValue || Number(inputValue) < 1}
              onClick={handleConnect}
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
          onClick={() => {
            setTableNumber(null);
            setInputValue("");
            setError(null);
          }}
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
      <footer className="border-t border-border bg-muted px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-center">
          Discussion Framework
        </p>
        <p className="text-xs text-muted-foreground text-center mb-4 max-w-md mx-auto">
          Follow these four steps to structure your table's conversation. Tap a step to see guidance.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
          {DISCUSSION_STEPS.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(isActive ? null : i)}
                className={`rounded-lg border px-3 py-3 text-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <span className={`block text-sm font-bold mb-0.5 ${isActive ? "text-primary-foreground" : "text-primary"}`}>
                  Step {i + 1}
                </span>
                <span className={`text-xs font-medium ${isActive ? "text-primary-foreground/90" : "text-foreground"}`}>
                  {step.title}
                </span>
                <ChevronDown className={`h-3 w-3 mx-auto mt-1 transition-transform ${isActive ? "rotate-180 text-primary-foreground/70" : "text-muted-foreground"}`} />
              </button>
            );
          })}
        </div>
        {activeStep !== null && (
          <div className="mt-3 max-w-2xl mx-auto rounded-lg bg-card border border-border p-4 text-center animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm text-foreground leading-relaxed">
              {DISCUSSION_STEPS[activeStep].description}
            </p>
          </div>
        )}
      </footer>
    </div>
  );
}

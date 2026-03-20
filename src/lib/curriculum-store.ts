import { supabase } from "@/integrations/supabase/client";

export interface CurriculumQuestion {
  id: number;
  title: string;
  text: string;
}

export const QUESTIONS: CurriculumQuestion[] = [
  { id: 1, title: "Subject Relevance", text: "Are any aspects of your specific subject becoming less useful because of AI?" },
  { id: 2, title: "Literacy & Writing", text: "Should the English writing and reading curriculum change now that AI is here?" },
  { id: 3, title: "Intercultural Skills", text: "Should language learning focus more on intercultural skills than pure linguistics?" },
  { id: 4, title: "Creative Arts & Music", text: "How might the presence of AI affect what is taught in visual arts or music?" },
  { id: 5, title: "AI-Free Learning", text: "Are there subjects or tasks where students should deliberately learn without AI?" },
  { id: 6, title: "Verification vs. Memory", text: "Should we spend less time on memorisation and more on verifying info?" },
  { id: 7, title: "Employer Expectations", text: "Would employers prefer graduates from an AI-encouraged or AI-banned university?" },
  { id: 8, title: "CS Evolution", text: "How might AI fundamentally change the computer science curriculum?" },
  { id: 9, title: "Assessment of AI Use", text: "If AI use is encouraged, should students be marked on their \"AI Prompting\" skills?" },
];

export const DISCUSSION_STEPS = [
  { title: "Individual Reflection", description: "Take 2 minutes to silently consider the question. Write down your initial thoughts before sharing with anyone." },
  { title: "Group Share", description: "Go around the table — each person shares their position in 60 seconds. Listen without interrupting." },
  { title: "Find the Tension", description: "Identify where you disagree. What assumptions differ? What evidence supports each side?" },
  { title: "Agree on Justification", description: "You don't need to agree on the answer — agree on the strongest reasoning. Prepare to present your table's best argument." },
];

const SESSION_ID = "default";

// Push assignments to the database
export async function pushAssignments(assignments: Record<number, number>): Promise<{ success: boolean; error?: string }> {
  try {
    const rows = Object.entries(assignments).map(([tableNumber, questionId]) => ({
      session_id: SESSION_ID,
      table_number: Number(tableNumber),
      question_id: questionId,
    }));

    const { error: deleteError } = await supabase
      .from("table_assignments")
      .delete()
      .eq("session_id", SESSION_ID);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return { success: false, error: "Failed to clear previous assignments." };
    }

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("table_assignments").insert(rows);
      if (insertError) {
        console.error("Insert error:", insertError);
        return { success: false, error: "Failed to push assignments to database." };
      }
    }
    return { success: true };
  } catch (err) {
    console.error("Push error:", err);
    return { success: false, error: "Network error. Please check your connection." };
  }
}

// Fetch current assignments from the database
export async function fetchAssignments(): Promise<Record<number, number>> {
  const { data } = await supabase
    .from("table_assignments")
    .select("table_number, question_id")
    .eq("session_id", SESSION_ID);

  const result: Record<number, number> = {};
  data?.forEach((row) => {
    result[row.table_number] = row.question_id;
  });
  return result;
}

// Subscribe to real-time changes
export function subscribeToAssignments(
  onChange: (assignments: Record<number, number>) => void
) {
  // Fetch initial
  fetchAssignments().then(onChange);

  const channel = supabase
    .channel("table_assignments_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "table_assignments",
        filter: `session_id=eq.${SESSION_ID}`,
      },
      () => {
        // Re-fetch all on any change
        fetchAssignments().then(onChange);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

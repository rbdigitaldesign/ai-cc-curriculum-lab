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

// Simple pub/sub to simulate push from tutor to student
type Listener = () => void;
const listeners: Set<Listener> = new Set();

let tableAssignments: Record<number, number> = {}; // tableNumber -> questionId
let snapshot = tableAssignments;

export function getAssignments() {
  return snapshot;
}

export function setAssignments(assignments: Record<number, number>) {
  tableAssignments = { ...assignments };
  snapshot = tableAssignments;
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// aiService.mock.ts
//import type { Deck } from "../types/flashcard";
// import type { Flashcard } from "../types/flashcard";

// export function mockGenerateDeck(topic: string, numQuestions: number): Deck {
//   return {
//     id: "mock-deck",
//     title: `Mock: ${topic}`,
//     description: "This is a mock deck for UI testing",
//     topic,
//     cards: Array.from({ length: numQuestions }).map((_, i) => ({
//       id: `mock-card-${i + 1}`,   // ✅ FIX HERE
//       front: `Mock Question ${i + 1} on ${topic}`,
//       back: `Mock Answer ${i + 1}`,
//     })),
//   };
// }


// export function mockGenerateFromFile(numQuestions: number): Array<Omit<Flashcard, "id">> {
//   return Array.from({ length: numQuestions }).map((_, i) => ({
//     front: `Mock File Question ${i + 1}`,
//     back: `Mock File Answer ${i + 1}`,
//   }));
// }



import type { Deck, Flashcard } from "../types/flashcard";
import {Difficulty} from "../types/flashcard";


// ✅ Helper to assign initial difficulty

function assignDifficulty(index: number, total: number): "easy" | "medium" | "hard"{
  const ratio = index / total;

  if (ratio < 0.4) return "easy";
  if (ratio < 0.8) return "medium";
  return "hard";
}

// ============================================================================
// MOCK: Generate Deck
// ============================================================================


export function mockGenerateDeck(
  topic: string, 
  numQuestions: number,
    difficulty: Difficulty = "medium"
): Deck {
  return {
    id: "mock-deck",
    title: `Mock: ${topic} (${difficulty})`,
    description: "Hybrid test deck",
    topic,
    cards: Array.from({ length: numQuestions }).map((_, i) => ({
      id: `mock-card-${i + 1}`,
      front: `[${difficulty}] Question ${i + 1} on ${topic}`,
      back: `Answer ${i + 1}`,
      //difficulty: getInitialDifficulty(i, numQuestions), // ✅ NEW
     // difficulty: difficulties[i % 3], // ✅ rotate difficulty
      difficulty: assignDifficulty(i, numQuestions),
    })),
  };
}

// ============================================================================
// MOCK: Generate from File
// ============================================================================
export function mockGenerateFromFile(
  numQuestions: number
): Array<Omit<Flashcard, "id">> {
  return Array.from({ length: numQuestions }).map((_, i) => ({
    front: `Mock File Question ${i + 1}`,
    back: `Mock File Answer ${i + 1}`,
    difficulty: assignDifficulty(i, numQuestions), // ✅ NEW
  }));
}

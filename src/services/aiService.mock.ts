// aiService.mock.ts
import type { Deck } from "../types/flashcard";
import type { Flashcard } from "../types/flashcard";

export function mockGenerateDeck(topic: string, numQuestions: number): Deck {
  return {
    id: "mock-deck",
    title: `Mock: ${topic}`,
    description: "This is a mock deck for UI testing",
    topic,
    cards: Array.from({ length: numQuestions }).map((_, i) => ({
      id: `mock-card-${i + 1}`,   // ✅ FIX HERE
      front: `Mock Question ${i + 1} on ${topic}`,
      back: `Mock Answer ${i + 1}`,
    })),
  };
}


export function mockGenerateFromFile(numQuestions: number): Array<Omit<Flashcard, "id">> {
  return Array.from({ length: numQuestions }).map((_, i) => ({
    front: `Mock File Question ${i + 1}`,
    back: `Mock File Answer ${i + 1}`,
  }));
}
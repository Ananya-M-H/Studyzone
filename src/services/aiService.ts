//import { supabase } from "../lib/supabase";
// import type { Deck, Flashcard } from "../types/flashcard";
// import { withRetry } from "../utils/retry";

// const USE_EDGE_FUNCTION = true;


// export async function generateDeck(
//   topic: string,
//   numQuestions: number = 10
// ): Promise<Deck> {
//   if (!USE_EDGE_FUNCTION) {
//     throw new Error(
//       "Direct API access is disabled for security. Please enable Edge Functions."
//     );
//   }

//   const { data, error } = await withRetry(
//     () =>
//       supabase.functions.invoke("generate-flashcards", {
//         body: {
//           action: "generateDeck",
//           topic,
//           numQuestions,
//         },
//       }),
//     "generateDeck"
//   );

//   if (error) {
//     throw new Error(`Edge function error: ${error.message}`);
//   }

//   if (data.error) {
//     throw new Error(data.error);
//   }

//   return data as Deck;
// }

// export async function generateBatchDistractors(
//   cards: Flashcard[]
// ): Promise<Record<string, string[]>> {
//   if (cards.length === 0) {
//     return {};
//   }

//   if (!USE_EDGE_FUNCTION) {
//     console.error("Direct API access is disabled for security.");
//     return {};
//   }

//   try {
//     // Process in chunks of 10 to avoid timeout
//     const chunkSize = 10;
//     const chunks: Flashcard[][] = [];
//     for (let i = 0; i < cards.length; i += chunkSize) {
//       chunks.push(cards.slice(i, i + chunkSize));
//     }

//     const results = await Promise.all(
//       chunks.map((chunk) =>
//         withRetry(
//           async () => {
//             const { data, error } = await supabase.functions.invoke(
//               "generate-flashcards",
//               {
//                 body: {
//                   action: "generateDistractors",
//                   cards: chunk.map((c) => ({
//                     id: c.id,
//                     front: c.front,
//                     back: c.back,
//                   })),
//                 },
//               }
//             );

//             if (error) {
//               throw new Error(`Edge function error: ${error.message}`);
//             }

//             if (data.error) {
//               throw new Error(data.error);
//             }

//             return data as Record<string, string[]>;
//           },
//           "generateDistractors"
//         )
//       )
//     );

//     return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
//   } catch (error) {
//     console.error("Error generating batch distractors:", error);
//     return {};
//   }
// }

//Working code ->Dont; touch--------------------------------
// import { supabase } from "../lib/supabase";
// import type { Deck, Flashcard } from "../types/flashcard";
// import { withRetry } from "../utils/retry";

// const FUNCTION_NAME = "generate-flashcards";

// // ============================================================================
// // Generate Deck
// // ============================================================================


// import { mockGenerateDeck } from "./aiService.mock";

// const USE_MOCK = true; // ONLY FOR DEV

// export async function generateDeck(topic: string, numQuestions: number) {
//   if (USE_MOCK) {
//     return mockGenerateDeck(topic, numQuestions);
//   }

//   // real API call stays untouched
//   const { data } = await supabase.functions.invoke("generate-flashcards", {
//     body: { topic, numQuestions },
//   });

//   return data;
// }
//___________________________________________________________________
import { USE_MOCK_AI } from "../config/env";
import { mockGenerateDeck } from "./aiService.mock";
import { supabase } from "../lib/supabase";

const FUNCTION_NAME = "generate-flashcards";

export async function generateDeck(topic: string, numQuestions: number) {
  // ✅ MOCK MODE
  if (USE_MOCK_AI) {
      console.log("🔥 USING MOCK AI");
    return mockGenerateDeck(topic, numQuestions);
  }

  // ❌ REAL API CALL
  const { data, error } = await supabase.functions.invoke(
    FUNCTION_NAME,
    {
      body: {
        action: "generateDeck",
        topic,
        numQuestions,
      },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}





















































// export async function generateDeck(
//   topic: string,
//   numQuestions: number = 10
// ): Promise<Deck> {
//   const { data, error } = await withRetry(
//     () =>
//       supabase.functions.invoke(FUNCTION_NAME, {
//         body: {
//           action: "generateDeck",
//           topic,
//           numQuestions,
//         },
//       }),
//     "generateDeck"
//   );

//   if (error) {
//     throw new Error(`Failed to generate deck: ${error.message}`);
//   }

//   if (!data) {
//     throw new Error("No data received from server");
//   }

//   if (data.error) {
//     throw new Error(data.error);
//   }

//   return data as Deck;
// }

// ============================================================================
// Generate Distractors (Batch)
// ============================================================================
import type { Flashcard } from "../types/flashcard";
import { withRetry } from "../utils/retry";
//const FUNCTION_NAME = "generate-flashcards";

export async function generateBatchDistractors(
  cards: Flashcard[]
): Promise<Record<string, string[]>> {
  if (!cards.length) return {};

  try {
    const chunkSize = 10;

    const chunks: Flashcard[][] = [];
    for (let i = 0; i < cards.length; i += chunkSize) {
      chunks.push(cards.slice(i, i + chunkSize));
    }

    const results = await Promise.all(
      chunks.map((chunk) =>
        withRetry(
          async () => {
            const { data, error } = await supabase.functions.invoke(
              FUNCTION_NAME,
              {
                body: {
                  action: "generateDistractors",
                  cards: chunk.map((c) => ({
                    id: c.id,
                    front: c.front,
                    back: c.back,
                  })),
                },
              }
            );

            if (error) {
              throw new Error(`Failed to generate distractors: ${error.message}`);
            }

            if (!data) {
              throw new Error("No data received for distractors");
            }

            if (data.error) {
              throw new Error(data.error);
            }

            return data as Record<string, string[]>;
          },
          "generateDistractors"
        )
      )
    );

    // Merge all chunk results
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  } catch (err) {
    console.error("Error generating distractors:", err);
    return {};
  }
}

import { useState, useCallback, useEffect,useMemo} from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import type { Deck } from '../types/flashcard';
import { FlashCard } from './FlashCard';
import { QuizMode } from './QuizMode';

type Difficulty = 'easy' | 'medium' | 'hard';

interface StudyModeProps {
  deck: Deck;
  onExit: () => void;
}

// export function StudyMode({ deck, onExit }: StudyModeProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const cardCount = deck.cards?.length ?? 0;

//   useEffect(() => {
//     // Keep index valid when deck changes (e.g. after editing cards)
//     setCurrentIndex((prev) => Math.min(prev, Math.max(cardCount - 1, 0)));
//   }, [cardCount]);

//   const handlePrevious = useCallback(() => {
//     setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
//   }, []);

//   const handleNext = useCallback(() => {
//     setCurrentIndex(prev => prev < cardCount - 1 ? prev + 1 : prev);
//   }, [cardCount]);

//   // Safety check: ensure deck has cards
//   if (cardCount === 0) {
//     return (
//       <div className="max-w-4xl mx-auto text-center py-12">
//         <div className="bg-white rounded-neo-xl border-2 border-neo-border shadow-neo p-8">
//           <p className="text-neo-charcoal text-lg font-medium mb-4">This deck has no flashcards.</p>
//           <button
//             onClick={onExit}
//             className="text-neo-green hover:text-neo-charcoal flex items-center gap-2 mx-auto font-bold transition-colors"
//           >
//             <RotateCcw className="w-4 h-4" />
//             Back to Decks
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentCard = deck.cards[currentIndex];

//   // Safety check: ensure currentCard exists
//   if (!currentCard) {
//     return (
//       <div className="max-w-4xl mx-auto text-center py-12">
//         <div className="bg-white rounded-neo-xl border-2 border-neo-border shadow-neo p-8">
//           <p className="text-neo-charcoal text-lg font-medium mb-4">Card not found.</p>
//           <button
//             onClick={onExit}
//             className="text-neo-green hover:text-neo-charcoal flex items-center gap-2 mx-auto font-bold transition-colors"
//           >
//             <RotateCcw className="w-4 h-4" />
//             Back to Decks
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isFirst = currentIndex === 0;
//   const isLast = currentIndex === cardCount - 1;

//   if (showQuiz) {
//     return <QuizMode deck={deck} onExit={onExit} />;
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-6 flex items-center justify-between">
//         <button
//           onClick={onExit}
//           className="text-neo-gray hover:text-neo-charcoal flex items-center gap-2 font-bold transition-colors"
//         >
//           <RotateCcw className="w-4 h-4" />
//           Back to Decks
//         </button>
//         <h2 className="text-xl font-heading font-bold text-neo-charcoal">{deck.title}</h2>
//         <div className="px-3 py-1.5 bg-neo-yellow/30 rounded-full border-2 border-neo-border text-sm font-bold text-neo-charcoal">
//           {currentIndex + 1} / {cardCount}
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="mb-6 h-3 bg-neo-cream rounded-full border-2 border-neo-border overflow-hidden">
//         <div
//           className="h-full bg-neo-green transition-all duration-300 rounded-full"
//           style={{ width: `${((currentIndex + 1) / cardCount) * 100}%` }}
//         />
//       </div>

//       <div className="mb-8">
//         <FlashCard card={currentCard} />
//       </div>

//       <div className="flex justify-center gap-4 flex-wrap">
//         <button
//           onClick={handlePrevious}
//           disabled={isFirst}
//           className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 border-neo-border transition-all ${isFirst
//             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             : 'bg-white text-neo-charcoal shadow-neo hover:shadow-neo-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-neo-active active:translate-x-[1px] active:translate-y-[1px]'
//             }`}
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={isLast}
//           className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 border-neo-border transition-all ${isLast
//             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             : 'bg-neo-green text-white shadow-neo hover:shadow-neo-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-neo-active active:translate-x-[1px] active:translate-y-[1px]'
//             }`}
//         >
//           Next
//           <ArrowRight className="w-4 h-4" />
//         </button>
//         {isLast && (
//           <button
//             onClick={() => setShowQuiz(true)}
//             className="flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 border-neo-border bg-neo-accent-blue text-neo-charcoal shadow-neo hover:shadow-neo-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-neo-active active:translate-x-[1px] active:translate-y-[1px] transition-all"
//           >
//             <CheckCircle className="w-4 h-4" />
//             Take Quiz
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }


interface StudyModeProps {
  deck: Deck;
  onExit: () => void;
}

export function StudyMode({ deck, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);


  type Difficulty = 'easy' | 'medium' | 'hard';
 
 
  // 🔥 Global difficulty level (for next API call later)
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
   const [performanceMap, setPerformanceMap] = useState<
  Record<string, Difficulty>
>({});
  
const sortedCards = useMemo(() => {
  return [...deck.cards].sort((a, b) => {
    const score = (d: Difficulty) => {
      if (d === 'hard') return 3;
      if (d === 'medium') return 2;
      return 1;
    };

    const aScore = score(a.difficulty);
    const bScore = score(b.difficulty);

    return aScore - bScore; // easy → hard
  });
}, [deck.cards]);



  const cardCount = sortedCards?.length ?? 0;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(cardCount - 1, 0)));
  }, [cardCount]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < cardCount - 1 ? prev + 1 : prev));
  }, [cardCount]);

  const getNextDifficulty = (
  current: Difficulty,
  feedback: Difficulty
): Difficulty => {
  if (feedback === 'easy') {
    if (current === 'easy') return 'medium';
    if (current === 'medium') return 'hard';
    return 'hard';
  }

  if (feedback === 'hard') {
    if (current === 'hard') return 'medium';
    if (current === 'medium') return 'easy';
    return 'easy';
  }

  return current; // medium stays same
};


 const handleAnswerFeedback = (feedback: Difficulty) => {
    const currentCard = sortedCards[currentIndex];
    if (!currentCard) return;

    // ✅ Save performance
    setPerformanceMap((prev) => ({
      ...prev,
      [currentCard.id]: feedback,
    }));
     console.log('Feedback:', feedback);

    // ✅ Compute next difficulty
  //   const nextDifficulty = getNextDifficulty(
  //     currentDifficulty,
  //     feedback
  //   );
  //   setCurrentDifficulty(nextDifficulty);

  //   console.log('📊 Feedback:', feedback);
  //   console.log('🎯 Next Difficulty:', nextDifficulty);

  //   // ✅ Find next matching card
  //   let nextIndex = deck.cards.findIndex(
  //     (card, idx) =>
  //       idx > currentIndex &&
  //       card.difficulty === nextDifficulty
  //   );

  //    // ✅ 2. If not found → pick unseen card
  // if (nextIndex === -1) {
  //     nextIndex = deck.cards.findIndex(
  //     (card, idx) =>
  //       idx > currentIndex &&
  //       !performanceMap[card.id]
  //   );
  // }
  //  // 5. fallback → sequential
  // if (nextIndex === -1) {
  //   nextIndex =
  //     currentIndex < deck.cards.length - 1
  //       ? currentIndex + 1
  //       : currentIndex;
  // }
       // 2. determine target difficulty
  const nextDifficulty =
    feedback === 'easy'
      ? 'hard'
      : feedback === 'hard'
      ? 'easy'
      : 'medium';

  // 3. find next BEST match
  // let nextIndex = sortedCards.findIndex(
  //   (card, idx) =>
  //     idx > currentIndex &&
  //     card.difficulty === nextDifficulty &&
  //     !performanceMap[card.id]
  // );
  let nextIndex = -1;

// 🔥 ONLY check next 2–3 cards (NOT whole deck)
for (let i = currentIndex + 1; i <= currentIndex + 3 && i < sortedCards.length; i++) {
  const card = sortedCards[i];

  if (
    card.difficulty === nextDifficulty &&
    !performanceMap[card.id]
  ) {
    nextIndex = i;
    break;
  }
}

  // 4. fallback: unseen card
 if (nextIndex === -1) {
  for (let i = currentIndex + 1; i < sortedCards.length; i++) {
    if (!performanceMap[sortedCards[i].id]) {
      nextIndex = i;
      break;
    }
  }
}

  // 5. final fallback
  if (nextIndex === -1) {
    nextIndex =
      currentIndex < sortedCards.length - 1
        ? currentIndex + 1
        : currentIndex;
  }

  setCurrentIndex(nextIndex);
  };

  
  // Safety check
  if (cardCount === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-neo-xl border-2 border-neo-border shadow-neo p-8">
          <p className="text-neo-charcoal text-lg font-medium mb-4">
            This deck has no flashcards.
          </p>
          <button
            onClick={onExit}
            className="text-neo-green hover:text-neo-charcoal flex items-center gap-2 mx-auto font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            Back to Decks
          </button>
        </div>
      </div>
    );
  }
   
  const currentCard = sortedCards[currentIndex];
  
  if (!currentCard) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === cardCount - 1;

  if (showQuiz) {
    return <QuizMode deck={deck} onExit={onExit} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onExit}
          className="text-neo-gray hover:text-neo-charcoal flex items-center gap-2 font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          Back
        </button>

        <h2 className="text-xl font-bold text-neo-charcoal">{deck.title}</h2>

        <div className="px-3 py-1.5 bg-neo-yellow/30 rounded-full border-2 border-neo-border text-sm font-bold">
          {currentIndex + 1} / {cardCount}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 h-3 bg-neo-cream rounded-full border-2 border-neo-border overflow-hidden">
        <div
          className="h-full bg-neo-green transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cardCount) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="mb-6">
        <FlashCard card={currentCard} />
      </div>

     <div className="flex gap-3 justify-center mt-6">
        <button onClick={() => handleAnswerFeedback('easy')}>
          Easy
        </button>

        <button onClick={() => handleAnswerFeedback('medium')}>
          Medium
        </button>

        <button onClick={() => handleAnswerFeedback('hard')}>
          Hard
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={handlePrevious}
          disabled={isFirst}
          className="px-6 py-3 border-2 rounded-full font-bold"
        >
          <ArrowLeft className="inline w-4 h-4 mr-2" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={isLast}
          className="px-6 py-3 bg-neo-green text-white border-2 rounded-full font-bold"
        >
          Next
          <ArrowRight className="inline w-4 h-4 ml-2" />
        </button>

        {isLast && (
          <button
            onClick={() => setShowQuiz(true)}
            className="px-6 py-3 bg-blue-200 border-2 rounded-full font-bold"
          >
            <CheckCircle className="inline w-4 h-4 mr-2" />
            Take Quiz
          </button>
        )}
      </div>
    </div>
  );
}

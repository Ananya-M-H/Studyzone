import { useState, useCallback, useEffect } from 'react';
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

  // 🔥 Track difficulty per card
  const [difficultyMap, setDifficultyMap] = useState<Record<string, Difficulty>>({});
 
 
  // 🔥 Global difficulty level (for next API call later)
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
   const [performanceMap, setPerformanceMap] = useState<
  Record<string, Difficulty>
>({});

  const cardCount = deck.cards?.length ?? 0;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(cardCount - 1, 0)));
  }, [cardCount]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < cardCount - 1 ? prev + 1 : prev));
  }, [cardCount]);

  // 🔥 Difficulty transition logic
  const handleDifficulty = (level: Difficulty) => {
    const currentCard = deck.cards[currentIndex];
    if (!currentCard) return;

    // Save per-card difficulty
    setDifficultyMap((prev) => ({
      ...prev,
      [currentCard.id]: level,
    }));

    // 🔥 Transition logic
    if (level === 'easy') {
      setCurrentDifficulty('hard'); // increase difficulty
    } else if (level === 'hard') {
      setCurrentDifficulty('medium'); // decrease difficulty
    } else {
      setCurrentDifficulty('medium'); // stay same
    }

    console.log('📊 Card difficulty:', level);
    console.log('🎯 Next difficulty:', level === 'easy' ? 'hard' : level === 'hard' ? 'medium' : 'medium');
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
   
  const getNextDifficulty = (
  current: Difficulty,
  feedback: Difficulty
): Difficulty => {
  if (feedback === 'easy') return 'hard';
  if (feedback === 'hard') return 'medium';
  return current; // medium stays same
};

  const currentCard = deck.cards[currentIndex];
  
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

      {/* 🔥 Difficulty Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => handleDifficulty('easy')}
          className="px-4 py-2 bg-green-100 border-2 border-green-400 rounded-full font-bold hover:scale-105"
        >
          Easy
        </button>

        <button
          onClick={() => handleDifficulty('medium')}
          className="px-4 py-2 bg-yellow-100 border-2 border-yellow-400 rounded-full font-bold hover:scale-105"
        >
          Medium
        </button>

        <button
          onClick={() => handleDifficulty('hard')}
          className="px-4 py-2 bg-red-100 border-2 border-red-400 rounded-full font-bold hover:scale-105"
        >
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

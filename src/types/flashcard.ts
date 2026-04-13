export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  topic: string;
}

export interface QuizAnswer {
  cardId: string;
  isCorrect: boolean;
  selectedAnswer: string;
  optionsSnapshot: string[];
}

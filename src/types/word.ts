export interface Word {
  kanji: string;
  reading: string;
  meaning: string;
  example?: string;
  example_reading?: string;
}

export interface QuizQuestion {
  word: Word;
  readingChoices: string[];
  meaningChoices: string[];
  selectedReading: string | null;
  selectedMeaning: string | null;
  isFromNewWords: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctReadings: number;
  correctMeanings: number;
  newWordScore: { correct: number; total: number };
  reviewWordScore: { correct: number; total: number };
  timeElapsed: number;
  details: QuestionResult[];
}

export interface QuestionResult {
  word: Word;
  readingCorrect: boolean;
  meaningCorrect: boolean;
  selectedReading: string;
  selectedMeaning: string;
}

export type QuizState = 'IDLE' | 'IN_PROGRESS' | 'FINISHED';
export type QuizMode = 'exam' | 'review';

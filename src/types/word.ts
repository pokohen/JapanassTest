export interface Word {
  kanji: string;
  reading: string;
  meaning: string;
  example?: string;
  example_reading?: string;
}

export type ConjugationType = 'godan' | 'ichidan' | 'irregular' | 'i-adj' | 'na-adj';
export type VerbForm = 'masu' | 'te' | 'ta' | 'nai' | 'potential' | 'volitional';
export type AdjForm = 'past' | 'negative' | 'adverb' | 'te' | 'na-noun' | 'polite';
export type ConjForm = VerbForm | AdjForm;

export interface ConjugationItem {
  base: string;
  reading: string;
  meaning: string;
  type: ConjugationType;
  examples?: ContextExample[];
}

export interface ContextExample {
  form: ConjForm;
  /** 빈칸 자리를 ___ 로 표시한 일본어 문장 */
  sentence: string;
  /** 한국어 번역 (완전한 번역 문장) */
  translation: string;
}

export interface WordQuestion {
  type: 'word';
  word: Word;
  readingChoices: string[];
  meaningChoices: string[];
  selectedReading: string | null;
  selectedMeaning: string | null;
  isFromNewWords: boolean;
}

export interface ConjugationQuestion {
  type: 'conjugation';
  item: ConjugationItem;
  form: ConjForm;
  choices: string[];
  answer: string;
  selected: string | null;
  /** 있으면 "빈칸 채우기" 모드, 없으면 기본 "dictionary → form" 모드 */
  context?: ContextExample;
}

export type QuizQuestion = WordQuestion | ConjugationQuestion;

export interface WordQuestionResult {
  type: 'word';
  word: Word;
  readingCorrect: boolean;
  meaningCorrect: boolean;
  selectedReading: string;
  selectedMeaning: string;
}

export interface ConjugationQuestionResult {
  type: 'conjugation';
  item: ConjugationItem;
  form: ConjForm;
  answer: string;
  selected: string;
  correct: boolean;
  context?: ContextExample;
}

export type QuestionResult = WordQuestionResult | ConjugationQuestionResult;

export interface QuizResult {
  totalQuestions: number;
  correctReadings: number;
  correctMeanings: number;
  newWordScore: { correct: number; total: number };
  reviewWordScore: { correct: number; total: number };
  conjugationScore: { correct: number; total: number };
  timeElapsed: number;
  details: QuestionResult[];
}

export type QuizState = 'IDLE' | 'IN_PROGRESS' | 'FINISHED';
export type QuizMode = 'exam' | 'review';

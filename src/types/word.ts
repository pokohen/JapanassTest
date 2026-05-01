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

export interface ParticleExample {
  /** 빈칸 자리를 ___ 로 표시한 일본어 문장 */
  sentence: string;
  /** 한국어 번역 */
  translation: string;
}

export interface ParticleItem {
  /** 정답이 되는 조사 (예: 'は', 'を') */
  particle: string;
  /** 조사의 이름/역할 (예: '주제 조사') */
  name: string;
  /** 한국어 의미 (예: '~은/는') */
  meaning: string;
  /** 간단한 설명 */
  description: string;
  /** 빈칸 채우기 예문 */
  examples: ParticleExample[];
}

export interface ParticleQuestion {
  type: 'particle';
  item: ParticleItem;
  example: ParticleExample;
  choices: string[];
  answer: string;
  selected: string | null;
}

export interface GrammarExample {
  /** 빈칸 자리를 ___ 로 표시한 일본어 문장 */
  sentence: string;
  /** 빈칸에 들어갈 정답 (예: 'てから', 'たら') */
  answer: string;
  /** 한국어 번역 */
  translation: string;
}

export interface GrammarItem {
  /** 문법 표제 (예: '～てから') */
  pattern: string;
  /** 한국어 명칭/의미 (예: '~하고 나서') */
  name: string;
  /** 짧은 의미 표기 (예: '~한 후에') */
  meaning: string;
  /** 사용 설명 (학습/힌트용) */
  description: string;
  /** 빈칸 채우기 예문 */
  examples: GrammarExample[];
}

export interface GrammarQuestion {
  type: 'grammar';
  item: GrammarItem;
  example: GrammarExample;
  choices: string[];
  answer: string;
  selected: string | null;
}

export interface ReadingSubQuestion {
  /** 질문 (한국어) */
  question: string;
  /** 4지선다 보기 */
  choices: string[];
  /** 정답 (choices 중 하나와 정확히 일치) */
  answer: string;
  /** 해설 (선택) */
  explanation?: string;
}

export interface ReadingPassage {
  /** 식별자 */
  id: string;
  /** 한국어 제목 */
  title: string;
  /** 일본어 지문 */
  passage: string;
  /** 한국어 번역 */
  translation: string;
  /** 5개의 문제 */
  questions: ReadingSubQuestion[];
}

export interface ReadingQuestion {
  type: 'reading';
  passage: ReadingPassage;
  sub: ReadingSubQuestion;
  /** 같은 지문에서 출제된 문제들의 그룹 ID (UI에서 처음에만 지문 강조 등) */
  groupId: string;
  /** 그룹 내 문제 순번 (1부터) */
  indexInGroup: number;
  /** 그룹 내 총 문제 수 */
  totalInGroup: number;
  selected: string | null;
}

export type QuizQuestion =
  | WordQuestion
  | ConjugationQuestion
  | ParticleQuestion
  | GrammarQuestion
  | ReadingQuestion;

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

export interface ParticleQuestionResult {
  type: 'particle';
  item: ParticleItem;
  example: ParticleExample;
  answer: string;
  selected: string;
  correct: boolean;
}

export interface GrammarQuestionResult {
  type: 'grammar';
  item: GrammarItem;
  example: GrammarExample;
  answer: string;
  selected: string;
  correct: boolean;
}

export interface ReadingQuestionResult {
  type: 'reading';
  passage: ReadingPassage;
  sub: ReadingSubQuestion;
  answer: string;
  selected: string;
  correct: boolean;
  groupId: string;
  indexInGroup: number;
  totalInGroup: number;
}

export type QuestionResult =
  | WordQuestionResult
  | ConjugationQuestionResult
  | ParticleQuestionResult
  | GrammarQuestionResult
  | ReadingQuestionResult;

export interface QuizResult {
  totalQuestions: number;
  correctReadings: number;
  correctMeanings: number;
  newWordScore: { correct: number; total: number };
  reviewWordScore: { correct: number; total: number };
  conjugationScore: { correct: number; total: number };
  particleScore: { correct: number; total: number };
  grammarScore: { correct: number; total: number };
  readingScore: { correct: number; total: number };
  timeElapsed: number;
  details: QuestionResult[];
}

export type QuizState = 'IDLE' | 'IN_PROGRESS' | 'FINISHED';
export type QuizMode = 'exam' | 'review';

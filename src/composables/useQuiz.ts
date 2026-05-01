import { ref, computed } from "vue";
import type {
  QuizQuestion,
  WordQuestion,
  ConjugationQuestion,
  ParticleQuestion,
  GrammarQuestion,
  ReadingQuestion,
  QuizResult,
  QuizState,
  QuestionResult,
  QuizMode,
  Word,
  ConjugationItem,
  ConjForm,
  ParticleItem,
  GrammarItem,
  ReadingPassage,
} from "../types/word";
import {
  getNewWords,
  getReviewWords,
  getLatestWeekNumber,
  getTotalWeekCount,
  getConjugationItems,
  getParticleItems,
  getGrammarItems,
  getReadingPassages,
} from "../data";
import { pickRandom, shuffle } from "../utils/shuffle";
import {
  generateReadingChoices,
  generateMeaningChoices,
} from "../utils/choiceGenerator";
import {
  conjugate,
  availableForms,
  generateDistractors,
} from "../utils/conjugation";
import { useTimer } from "./useTimer";

const TOTAL_WORD_QUESTIONS = 50;
const TOTAL_CONJUGATION_QUESTIONS = 8;
const TOTAL_PARTICLE_QUESTIONS = 5;
const TOTAL_GRAMMAR_QUESTIONS = 5;
const READING_PASSAGES_PER_QUIZ = 1;
const READING_QUESTIONS_PER_PASSAGE = 2;

export function useQuiz() {
  const state = ref<QuizState>("IDLE");
  const mode = ref<QuizMode>("exam");
  const questions = ref<QuizQuestion[]>([]);
  const currentIndex = ref(0);
  const result = ref<QuizResult | null>(null);

  const currentQuestion = computed(
    () => questions.value[currentIndex.value] ?? null,
  );
  const latestWeek = computed(() => getLatestWeekNumber());
  const totalWeeks = computed(() => getTotalWeekCount());

  function finishQuiz() {
    if (state.value !== "IN_PROGRESS") return;
    state.value = "FINISHED";
    timer.stop();
    result.value = calculateResult();
  }

  const timer = useTimer(finishQuiz);

  function buildQuestions(): QuizQuestion[] {
    const newWords = getNewWords();
    const reviewWords = getReviewWords();
    const allWords = [...newWords, ...reviewWords];

    let selectedNew: Word[];
    let selectedReview: Word[];

    if (reviewWords.length === 0) {
      selectedNew = pickRandom(newWords, TOTAL_WORD_QUESTIONS);
      selectedReview = [];
    } else if (mode.value === "exam") {
      selectedNew = pickRandom(newWords, 25);
      selectedReview = pickRandom(reviewWords, 25);
    } else {
      selectedReview = pickRandom(reviewWords, 40);
      selectedNew = pickRandom(newWords, 10);
    }

    const pool = allWords.length > 0 ? allWords : newWords;

    const wordQuestions: WordQuestion[] = shuffle([
      ...selectedNew.map((word) => createWordQuestion(word, pool, true)),
      ...selectedReview.map((word) => createWordQuestion(word, pool, false)),
    ]);

    const conjItems = pickRandom(
      getConjugationItems(),
      TOTAL_CONJUGATION_QUESTIONS,
    );
    const conjQuestions: ConjugationQuestion[] = conjItems.map((item) =>
      createConjugationQuestion(item),
    );

    const particleItems = pickRandom(
      getParticleItems(),
      TOTAL_PARTICLE_QUESTIONS,
    );
    const particleQuestions: ParticleQuestion[] = particleItems.map((item) =>
      createParticleQuestion(item, getParticleItems()),
    );

    const grammarItems = pickRandom(
      getGrammarItems(),
      TOTAL_GRAMMAR_QUESTIONS,
    );
    const grammarQuestions: GrammarQuestion[] = grammarItems.map((item) =>
      createGrammarQuestion(item, getGrammarItems()),
    );

    const selectedPassages = pickRandom(
      getReadingPassages(),
      READING_PASSAGES_PER_QUIZ,
    );
    const readingQuestions: ReadingQuestion[] = selectedPassages.flatMap(
      (passage) => createReadingQuestions(passage, READING_QUESTIONS_PER_PASSAGE),
    );

    return [
      ...wordQuestions,
      ...conjQuestions,
      ...particleQuestions,
      ...grammarQuestions,
      ...readingQuestions,
    ];
  }

  function createWordQuestion(
    word: Word,
    pool: Word[],
    isNew: boolean,
  ): WordQuestion {
    return {
      type: "word",
      word,
      readingChoices: generateReadingChoices(word, pool),
      meaningChoices: generateMeaningChoices(word, pool),
      selectedReading: null,
      selectedMeaning: null,
      isFromNewWords: isNew,
    };
  }

  function createParticleQuestion(
    item: ParticleItem,
    pool: ParticleItem[],
  ): ParticleQuestion {
    const example =
      item.examples[Math.floor(Math.random() * item.examples.length)];
    const answer = item.particle;
    const distractors = pool
      .filter((p) => p.particle !== answer)
      .map((p) => p.particle);
    const choices = shuffle([answer, ...pickRandom(distractors, 3)]);
    return {
      type: "particle",
      item,
      example,
      choices,
      answer,
      selected: null,
    };
  }

  function createReadingQuestions(
    passage: ReadingPassage,
    count: number,
  ): ReadingQuestion[] {
    const subs = pickRandom(passage.questions, count);
    const total = subs.length;
    return subs.map((sub, idx) => ({
      type: "reading",
      passage,
      sub: { ...sub, choices: shuffle([...sub.choices]) },
      groupId: passage.id,
      indexInGroup: idx + 1,
      totalInGroup: total,
      selected: null,
    }));
  }

  function createGrammarQuestion(
    item: GrammarItem,
    pool: GrammarItem[],
  ): GrammarQuestion {
    const example =
      item.examples[Math.floor(Math.random() * item.examples.length)];
    const answer = example.answer;

    const distractorPool = new Set<string>();
    for (const g of pool) {
      for (const ex of g.examples) {
        if (ex.answer !== answer) distractorPool.add(ex.answer);
      }
    }
    const distractors = pickRandom(Array.from(distractorPool), 3);
    const choices = shuffle([answer, ...distractors]);

    return {
      type: "grammar",
      item,
      example,
      choices,
      answer,
      selected: null,
    };
  }

  function createConjugationQuestion(
    item: ConjugationItem,
  ): ConjugationQuestion {
    const hasExamples = !!item.examples && item.examples.length > 0;
    const useContext = hasExamples && Math.random() < 0.7;

    let form: ConjForm;
    let context: ConjugationQuestion["context"];

    if (useContext && item.examples) {
      const ex = item.examples[Math.floor(Math.random() * item.examples.length)];
      form = ex.form;
      context = ex;
    } else {
      const forms = availableForms(item);
      form = forms[Math.floor(Math.random() * forms.length)];
    }

    const answer = conjugate(item, form);
    const distractors = generateDistractors(item, answer);
    const pool = [answer, ...distractors];
    while (pool.length < 4) pool.push(answer + "?");
    return {
      type: "conjugation",
      item,
      form,
      choices: shuffle(pool.slice(0, 4)),
      answer,
      selected: null,
      context,
    };
  }

  function startQuiz(selectedMode: QuizMode) {
    mode.value = selectedMode;
    questions.value = buildQuestions();
    currentIndex.value = 0;
    result.value = null;
    state.value = "IN_PROGRESS";
    timer.reset();
    timer.start();
  }

  function answerQuestion(payload: {
    reading?: string;
    meaning?: string;
    selected?: string;
  }) {
    const q = questions.value[currentIndex.value];
    if (!q) return;
    if (q.type === "word") {
      q.selectedReading = payload.reading ?? null;
      q.selectedMeaning = payload.meaning ?? null;
    } else if (q.type === "conjugation") {
      q.selected = payload.selected ?? null;
    } else if (q.type === "particle") {
      q.selected = payload.selected ?? null;
    } else if (q.type === "grammar") {
      q.selected = payload.selected ?? null;
    } else {
      q.selected = payload.selected ?? null;
    }

    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
    } else {
      finishQuiz();
    }
  }

  function calculateResult(): QuizResult {
    let correctReadings = 0;
    let correctMeanings = 0;
    let newCorrect = 0;
    let newTotal = 0;
    let reviewCorrect = 0;
    let reviewTotal = 0;
    let conjCorrect = 0;
    let conjTotal = 0;
    let particleCorrect = 0;
    let particleTotal = 0;
    let grammarCorrect = 0;
    let grammarTotal = 0;
    let readingCorrect = 0;
    let readingTotal = 0;
    let wordQuestionCount = 0;
    const details: QuestionResult[] = [];

    for (const q of questions.value) {
      if (q.type === "word") {
        wordQuestionCount++;
        const readingCorrect = q.selectedReading === q.word.reading;
        const meaningCorrect = q.selectedMeaning === q.word.meaning;

        if (readingCorrect) correctReadings++;
        if (meaningCorrect) correctMeanings++;

        const score = (readingCorrect ? 1 : 0) + (meaningCorrect ? 1 : 0);
        if (q.isFromNewWords) {
          newTotal += 2;
          newCorrect += score;
        } else {
          reviewTotal += 2;
          reviewCorrect += score;
        }

        details.push({
          type: "word",
          word: q.word,
          readingCorrect,
          meaningCorrect,
          selectedReading: q.selectedReading ?? "미응답",
          selectedMeaning: q.selectedMeaning ?? "미응답",
        });
      } else if (q.type === "conjugation") {
        conjTotal++;
        const correct = q.selected === q.answer;
        if (correct) conjCorrect++;
        details.push({
          type: "conjugation",
          item: q.item,
          form: q.form,
          answer: q.answer,
          selected: q.selected ?? "미응답",
          correct,
          context: q.context,
        });
      } else if (q.type === "particle") {
        particleTotal++;
        const correct = q.selected === q.answer;
        if (correct) particleCorrect++;
        details.push({
          type: "particle",
          item: q.item,
          example: q.example,
          answer: q.answer,
          selected: q.selected ?? "미응답",
          correct,
        });
      } else if (q.type === "grammar") {
        grammarTotal++;
        const correct = q.selected === q.answer;
        if (correct) grammarCorrect++;
        details.push({
          type: "grammar",
          item: q.item,
          example: q.example,
          answer: q.answer,
          selected: q.selected ?? "미응답",
          correct,
        });
      } else {
        readingTotal++;
        const correct = q.selected === q.sub.answer;
        if (correct) readingCorrect++;
        details.push({
          type: "reading",
          passage: q.passage,
          sub: q.sub,
          answer: q.sub.answer,
          selected: q.selected ?? "미응답",
          correct,
          groupId: q.groupId,
          indexInGroup: q.indexInGroup,
          totalInGroup: q.totalInGroup,
        });
      }
    }

    return {
      totalQuestions: wordQuestionCount,
      correctReadings,
      correctMeanings,
      newWordScore: { correct: newCorrect, total: newTotal },
      reviewWordScore: { correct: reviewCorrect, total: reviewTotal },
      conjugationScore: { correct: conjCorrect, total: conjTotal },
      particleScore: { correct: particleCorrect, total: particleTotal },
      grammarScore: { correct: grammarCorrect, total: grammarTotal },
      readingScore: { correct: readingCorrect, total: readingTotal },
      timeElapsed: timer.getElapsedSeconds(),
      details,
    };
  }

  function devSkipToResult() {
    mode.value = "exam";
    questions.value = buildQuestions();
    for (const q of questions.value) {
      if (q.type === "word") {
        q.selectedReading = "틀린답";
        q.selectedMeaning = "틀린답";
      } else if (q.type === "conjugation") {
        q.selected = "틀린답";
      } else if (q.type === "particle") {
        q.selected = "틀린답";
      } else if (q.type === "grammar") {
        q.selected = "틀린답";
      } else {
        q.selected = "틀린답";
      }
    }
    state.value = "FINISHED";
    result.value = calculateResult();
  }

  function devStartReadingOnly(passages = 1) {
    mode.value = "exam";
    const selected = pickRandom(getReadingPassages(), passages);
    const readingQuestions: ReadingQuestion[] = selected.flatMap((p) =>
      createReadingQuestions(p, READING_QUESTIONS_PER_PASSAGE),
    );
    questions.value = readingQuestions;
    currentIndex.value = 0;
    result.value = null;
    state.value = "IN_PROGRESS";
    timer.reset();
    timer.start();
  }

  function devStartGrammarOnly(count = 10) {
    mode.value = "exam";
    const items = pickRandom(getGrammarItems(), count);
    const grammarQuestions: GrammarQuestion[] = items.map((item) =>
      createGrammarQuestion(item, getGrammarItems()),
    );
    questions.value = grammarQuestions;
    currentIndex.value = 0;
    result.value = null;
    state.value = "IN_PROGRESS";
    timer.reset();
    timer.start();
  }

  function devStartParticleOnly(count = 10) {
    mode.value = "exam";
    const items = pickRandom(getParticleItems(), count);
    const particleQuestions: ParticleQuestion[] = items.map((item) =>
      createParticleQuestion(item, getParticleItems()),
    );
    questions.value = particleQuestions;
    currentIndex.value = 0;
    result.value = null;
    state.value = "IN_PROGRESS";
    timer.reset();
    timer.start();
  }

  function devStartConjugationOnly(count = 10) {
    mode.value = "exam";
    const conjItems = pickRandom(getConjugationItems(), count);
    const conjQuestions: ConjugationQuestion[] = conjItems.map((item) =>
      createConjugationQuestion(item),
    );
    questions.value = conjQuestions;
    currentIndex.value = 0;
    result.value = null;
    state.value = "IN_PROGRESS";
    timer.reset();
    timer.start();
  }

  function resetQuiz() {
    state.value = "IDLE";
    mode.value = "exam";
    questions.value = [];
    currentIndex.value = 0;
    result.value = null;
    timer.reset();
  }

  return {
    state,
    mode,
    questions,
    currentIndex,
    currentQuestion,
    result,
    latestWeek,
    totalWeeks,
    remainingSeconds: timer.remainingSeconds,
    startQuiz,
    answerQuestion,
    devSkipToResult,
    devStartConjugationOnly,
    devStartGrammarOnly,
    devStartParticleOnly,
    devStartReadingOnly,
    resetQuiz,
  };
}

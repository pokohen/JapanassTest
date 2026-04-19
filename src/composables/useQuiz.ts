import { ref, computed } from "vue";
import type {
  QuizQuestion,
  WordQuestion,
  ConjugationQuestion,
  QuizResult,
  QuizState,
  QuestionResult,
  QuizMode,
  Word,
  ConjugationItem,
  ConjForm,
} from "../types/word";
import {
  getNewWords,
  getReviewWords,
  getLatestWeekNumber,
  getTotalWeekCount,
  getConjugationItems,
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

    return [...wordQuestions, ...conjQuestions];
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
      } else {
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
      }
    }

    return {
      totalQuestions: wordQuestionCount,
      correctReadings,
      correctMeanings,
      newWordScore: { correct: newCorrect, total: newTotal },
      reviewWordScore: { correct: reviewCorrect, total: reviewTotal },
      conjugationScore: { correct: conjCorrect, total: conjTotal },
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
      } else {
        q.selected = "틀린답";
      }
    }
    state.value = "FINISHED";
    result.value = calculateResult();
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
    resetQuiz,
  };
}

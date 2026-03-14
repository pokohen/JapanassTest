import { ref, computed } from 'vue';
import type { QuizQuestion, QuizResult, QuizState, QuestionResult } from '../types/word';
import { getNewWords, getReviewWords, getLatestWeekNumber, getTotalWeekCount } from '../data';
import { pickRandom, shuffle } from '../utils/shuffle';
import { generateReadingChoices, generateMeaningChoices } from '../utils/choiceGenerator';
import { useTimer } from './useTimer';

const NEW_WORD_COUNT = 20;
const REVIEW_WORD_COUNT = 10;
const TOTAL_QUESTIONS = 30;

export function useQuiz() {
  const state = ref<QuizState>('IDLE');
  const questions = ref<QuizQuestion[]>([]);
  const currentIndex = ref(0);
  const result = ref<QuizResult | null>(null);

  const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null);
  const latestWeek = computed(() => getLatestWeekNumber());
  const totalWeeks = computed(() => getTotalWeekCount());

  function finishQuiz() {
    if (state.value !== 'IN_PROGRESS') return;
    state.value = 'FINISHED';
    timer.stop();
    result.value = calculateResult();
  }

  const timer = useTimer(finishQuiz);

  function buildQuestions(): QuizQuestion[] {
    const newWords = getNewWords();
    const reviewWords = getReviewWords();
    const allWords = [...newWords, ...reviewWords];

    let selectedNew: typeof newWords;
    let selectedReview: typeof reviewWords;

    if (reviewWords.length === 0) {
      selectedNew = pickRandom(newWords, TOTAL_QUESTIONS);
      selectedReview = [];
    } else {
      selectedReview = pickRandom(reviewWords, REVIEW_WORD_COUNT);
      selectedNew = pickRandom(newWords, NEW_WORD_COUNT);
    }

    const pool = allWords.length > 0 ? allWords : newWords;

    const quizQuestions: QuizQuestion[] = [
      ...selectedNew.map((word) => createQuestion(word, pool, true)),
      ...selectedReview.map((word) => createQuestion(word, pool, false)),
    ];

    return shuffle(quizQuestions);
  }

  function createQuestion(
    word: typeof questions.value[0]['word'],
    pool: typeof questions.value[0]['word'][],
    isNew: boolean,
  ): QuizQuestion {
    return {
      word,
      readingChoices: generateReadingChoices(word, pool),
      meaningChoices: generateMeaningChoices(word, pool),
      selectedReading: null,
      selectedMeaning: null,
      isFromNewWords: isNew,
    };
  }

  function startQuiz() {
    questions.value = buildQuestions();
    currentIndex.value = 0;
    result.value = null;
    state.value = 'IN_PROGRESS';
    timer.reset();
    timer.start();
  }

  function answerQuestion(reading: string, meaning: string) {
    const q = questions.value[currentIndex.value];
    if (!q) return;
    q.selectedReading = reading;
    q.selectedMeaning = meaning;

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
    const details: QuestionResult[] = [];

    for (const q of questions.value) {
      const readingCorrect = q.selectedReading === q.word.reading;
      const meaningCorrect = q.selectedMeaning === q.word.meaning;

      if (readingCorrect) correctReadings++;
      if (meaningCorrect) correctMeanings++;

      const questionScore = (readingCorrect ? 1 : 0) + (meaningCorrect ? 1 : 0);

      if (q.isFromNewWords) {
        newTotal += 2;
        newCorrect += questionScore;
      } else {
        reviewTotal += 2;
        reviewCorrect += questionScore;
      }

      details.push({
        word: q.word,
        readingCorrect,
        meaningCorrect,
        selectedReading: q.selectedReading ?? '미응답',
        selectedMeaning: q.selectedMeaning ?? '미응답',
      });
    }

    return {
      totalQuestions: questions.value.length,
      correctReadings,
      correctMeanings,
      newWordScore: { correct: newCorrect, total: newTotal },
      reviewWordScore: { correct: reviewCorrect, total: reviewTotal },
      timeElapsed: timer.getElapsedSeconds(),
      details,
    };
  }

  function resetQuiz() {
    state.value = 'IDLE';
    questions.value = [];
    currentIndex.value = 0;
    result.value = null;
    timer.reset();
  }

  return {
    state,
    questions,
    currentIndex,
    currentQuestion,
    result,
    latestWeek,
    totalWeeks,
    remainingSeconds: timer.remainingSeconds,
    startQuiz,
    answerQuestion,
    resetQuiz,
  };
}

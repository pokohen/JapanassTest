<script setup lang="ts">
import { ref } from 'vue';
import { useQuiz } from './composables/useQuiz';
import QuizStart from './components/QuizStart.vue';
import QuizQuestion from './components/QuizQuestion.vue';
import QuizProgress from './components/QuizProgress.vue';
import QuizResults from './components/QuizResults.vue';
import TimerDisplay from './components/TimerDisplay.vue';
import GrammarStudy from './components/GrammarStudy.vue';

const isDev = import.meta.env.DEV;
const showStudy = ref(false);

const {
  state,
  questions,
  currentIndex,
  currentQuestion,
  result,
  latestWeek,
  totalWeeks,
  remainingSeconds,
  startQuiz,
  answerQuestion,
  devSkipToResult,
  devStartConjugationOnly,
  devStartGrammarOnly,
  devStartParticleOnly,
  devStartReadingOnly,
  resetQuiz,
} = useQuiz();
</script>

<template>
  <div class="app">
    <GrammarStudy v-if="state === 'IDLE' && showStudy" @back="showStudy = false" />

    <template v-else-if="state === 'IDLE'">
      <QuizStart
        :latest-week="latestWeek"
        :total-weeks="totalWeeks"
        @start="startQuiz"
        @study="showStudy = true"
      />
      <div v-if="isDev" class="dev-row">
        <button class="dev-btn" @click="devSkipToResult">
          DEV: 결과 바로가기
        </button>
        <button class="dev-btn alt" @click="devStartConjugationOnly()">
          DEV: 활용 퀴즈 바로가기
        </button>
        <button class="dev-btn particle" @click="devStartParticleOnly()">
          DEV: 조사 퀴즈 바로가기
        </button>
        <button class="dev-btn n4" @click="devStartGrammarOnly()">
          DEV: N4 문법 바로가기
        </button>
        <button class="dev-btn dokkai" @click="devStartReadingOnly()">
          DEV: N4 독해 바로가기
        </button>
      </div>
    </template>

    <template v-else-if="state === 'IN_PROGRESS' && currentQuestion">
      <div class="quiz-header">
        <QuizProgress :current="currentIndex" :total="questions.length" />
        <TimerDisplay :remaining="remainingSeconds" />
      </div>
      <QuizQuestion
        :question="currentQuestion"
        @answer="answerQuestion"
      />
    </template>

    <QuizResults
      v-else-if="state === 'FINISHED' && result"
      :result="result"
      @restart="resetQuiz"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.quiz-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fafbfc;
  padding: 0.5rem 0;
}
.dev-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.75rem;
  width: 100%;
}
.dev-btn {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: white;
  background: #d32f2f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
}
.dev-btn.alt { background: #1a237e; }
.dev-btn.particle { background: #6a1b9a; }
.dev-btn.n4 { background: #00695c; }
.dev-btn.dokkai { background: #c62828; }
.dev-btn:hover { opacity: 1; }
</style>

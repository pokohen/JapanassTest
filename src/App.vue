<script setup lang="ts">
import { useQuiz } from './composables/useQuiz';
import QuizStart from './components/QuizStart.vue';
import QuizQuestion from './components/QuizQuestion.vue';
import QuizProgress from './components/QuizProgress.vue';
import QuizResults from './components/QuizResults.vue';
import TimerDisplay from './components/TimerDisplay.vue';

const isDev = import.meta.env.DEV;

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
  resetQuiz,
} = useQuiz();
</script>

<template>
  <div class="app">
    <QuizStart
      v-if="state === 'IDLE'"
      :latest-week="latestWeek"
      :total-weeks="totalWeeks"
      @start="startQuiz"
    />
    <button v-if="isDev && state === 'IDLE'" class="dev-btn" @click="devSkipToResult">
      DEV: 결과 바로가기
    </button>

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
.dev-btn:hover { opacity: 1; }
</style>

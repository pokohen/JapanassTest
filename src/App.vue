<script setup lang="ts">
import { useQuiz } from './composables/useQuiz';
import QuizStart from './components/QuizStart.vue';
import QuizQuestion from './components/QuizQuestion.vue';
import QuizProgress from './components/QuizProgress.vue';
import QuizResults from './components/QuizResults.vue';
import TimerDisplay from './components/TimerDisplay.vue';

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
  padding: 1rem;
  font-family: 'Noto Sans JP', 'Pretendard', -apple-system, sans-serif;
}
.quiz-header {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
</style>

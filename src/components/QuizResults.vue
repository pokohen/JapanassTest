<script setup lang="ts">
import { computed } from 'vue';
import type { QuizResult } from '../types/word';

const props = defineProps<{ result: QuizResult }>();
const emit = defineEmits<{ restart: [] }>();

const totalScore = computed(() => props.result.correctReadings + props.result.correctMeanings);
const totalPossible = computed(() => props.result.totalQuestions * 2);
const percentage = computed(() => Math.round((totalScore.value / totalPossible.value) * 100));

const timeDisplay = computed(() => {
  const min = Math.floor(props.result.timeElapsed / 60);
  const sec = props.result.timeElapsed % 60;
  return `${min}분 ${sec}초`;
});

const grade = computed(() => {
  if (percentage.value >= 90) return { text: '우수', color: '#2e7d32' };
  if (percentage.value >= 70) return { text: '양호', color: '#1565c0' };
  if (percentage.value >= 50) return { text: '보통', color: '#e65100' };
  return { text: '노력 필요', color: '#c62828' };
});
</script>

<template>
  <div class="results">
    <h2 class="title">시험 결과</h2>

    <div class="score-circle" :style="{ borderColor: grade.color }">
      <div class="score-number" :style="{ color: grade.color }">{{ percentage }}%</div>
      <div class="score-label">{{ totalScore }} / {{ totalPossible }}</div>
      <div class="grade" :style="{ color: grade.color }">{{ grade.text }}</div>
    </div>

    <div class="stats">
      <div class="stat-row">
        <span>소요 시간</span>
        <span>{{ timeDisplay }}</span>
      </div>
      <div class="stat-row">
        <span>읽기 정답</span>
        <span>{{ result.correctReadings }} / {{ result.totalQuestions }}</span>
      </div>
      <div class="stat-row">
        <span>뜻 정답</span>
        <span>{{ result.correctMeanings }} / {{ result.totalQuestions }}</span>
      </div>
      <div class="stat-row" v-if="result.reviewWordScore.total > 0">
        <span>새 단어</span>
        <span>{{ result.newWordScore.correct }} / {{ result.newWordScore.total }}</span>
      </div>
      <div class="stat-row" v-if="result.reviewWordScore.total > 0">
        <span>복습 단어</span>
        <span>{{ result.reviewWordScore.correct }} / {{ result.reviewWordScore.total }}</span>
      </div>
    </div>

    <h3 class="detail-title">상세 결과</h3>
    <div class="detail-list">
      <div
        v-for="(d, i) in result.details"
        :key="i"
        class="detail-item"
      >
        <div class="detail-kanji">{{ d.word.kanji }}</div>
        <div class="detail-answers">
          <div :class="d.readingCorrect ? 'correct' : 'wrong'">
            읽기: {{ d.selectedReading }}
            <span v-if="!d.readingCorrect" class="answer"> → {{ d.word.reading }}</span>
          </div>
          <div :class="d.meaningCorrect ? 'correct' : 'wrong'">
            뜻: {{ d.selectedMeaning }}
            <span v-if="!d.meaningCorrect" class="answer"> → {{ d.word.meaning }}</span>
          </div>
        </div>
      </div>
    </div>

    <button class="restart-btn" @click="emit('restart')">다시 시작</button>
  </div>
</template>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 500px;
}
.title { color: #1a237e; margin: 0; }
.score-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 6px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}
.score-number { font-size: 2.5rem; font-weight: bold; }
.score-label { font-size: 0.85rem; color: #888; }
.grade { font-size: 1rem; font-weight: 600; }
.stats {
  width: 100%;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1rem 1.5rem;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}
.stat-row:last-child { border-bottom: none; }
.detail-title {
  align-self: flex-start;
  color: #333;
  margin: 0;
}
.detail-list { width: 100%; display: flex; flex-direction: column; gap: 0.5rem; }
.detail-item {
  display: flex;
  gap: 1rem;
  padding: 0.8rem;
  background: #fafafa;
  border-radius: 8px;
  align-items: center;
}
.detail-kanji {
  font-size: 1.4rem;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
  color: #1a237e;
}
.detail-answers { font-size: 0.9rem; }
.correct { color: #2e7d32; }
.wrong { color: #c62828; }
.answer { font-weight: 600; }
.restart-btn {
  padding: 0.9rem 3rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: #1a237e;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 1rem;
}
.restart-btn:hover { background: #283593; }
</style>

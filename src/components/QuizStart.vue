<script setup lang="ts">
defineProps<{
  latestWeek: number;
  totalWeeks: number;
}>();

const emit = defineEmits<{ start: [] }>();
</script>

<template>
  <div class="start-screen">
    <h1 class="title">日本語 単語テスト</h1>
    <p class="subtitle">일본어 단어 시험</p>

    <div class="info-card">
      <div class="info-row">
        <span class="label">시험 범위</span>
        <span class="value">Week {{ latestWeek }}</span>
      </div>
      <div class="info-row">
        <span class="label">총 문제</span>
        <span class="value">30문제</span>
      </div>
      <div class="info-row" v-if="totalWeeks > 1">
        <span class="label">구성</span>
        <span class="value">새 단어 20 + 복습 10</span>
      </div>
      <div class="info-row" v-else>
        <span class="label">구성</span>
        <span class="value">새 단어 30</span>
      </div>
      <div class="info-row">
        <span class="label">제한 시간</span>
        <span class="value">30분</span>
      </div>
      <div class="info-row">
        <span class="label">형식</span>
        <span class="value">4지선다 (읽기 + 뜻)</span>
      </div>
    </div>

    <p class="instruction">
      한자를 보고 <strong>읽는 방법(히라가나)</strong>과 <strong>뜻(한국어)</strong>을 선택하세요.
    </p>

    <button class="start-btn" @click="emit('start')">
      시험 시작
    </button>
  </div>
</template>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
}
.title {
  font-size: 2rem;
  color: #1a237e;
  margin: 0;
}
.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: -0.5rem 0 0;
}
.info-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}
.info-row:last-child { border-bottom: none; }
.label { color: #888; }
.value { font-weight: 600; color: #333; }
.instruction {
  text-align: center;
  color: #555;
  line-height: 1.6;
  max-width: 400px;
}
.start-btn {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: #1a237e;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.start-btn:hover { background: #283593; }
.start-btn:active { background: #0d1452; }
</style>

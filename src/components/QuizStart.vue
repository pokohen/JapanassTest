<script setup lang="ts">
defineProps<{
  totalWordCount: number;
}>();

const emit = defineEmits<{ start: []; study: [] }>();
</script>

<template>
  <div class="start-screen">
    <h1 class="title">日本語 単語テスト</h1>
    <p class="subtitle">일본어 단어 시험</p>

    <div class="info-card">
      <div class="info-row">
        <span class="label">단어 풀</span>
        <span class="value">{{ totalWordCount }}개</span>
      </div>
      <div class="info-row">
        <span class="label">총 문제</span>
        <span class="value">100문제</span>
      </div>
      <div class="info-row">
        <span class="label">구성</span>
        <span class="value">단어 80 · 활용 8 · 조사 5 · 문법 5 · 독해 2</span>
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
      문제 풀기
    </button>

    <button class="study-btn" @click="emit('study')">
      📚 기초 문법 공부하기
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
  width: 100%;
}
.title {
  font-size: 2rem;
  color: #222;
  margin: 0;
}
.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: -0.5rem 0 0;
}
.info-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.25rem;
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
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  background: #222;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  max-width: 400px;
}
.start-btn:active { background: #000; }
.study-btn {
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
  max-width: 400px;
}
.study-btn:hover { border-color: #222; background: #f5f5f5; }
.study-btn:active { transform: scale(0.98); }
</style>

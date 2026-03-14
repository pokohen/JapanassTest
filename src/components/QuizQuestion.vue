<script setup lang="ts">
import { ref, watch } from 'vue';
import type { QuizQuestion } from '../types/word';

const props = defineProps<{ question: QuizQuestion }>();
const emit = defineEmits<{ answer: [reading: string, meaning: string] }>();

const selectedReading = ref<string | null>(null);
const selectedMeaning = ref<string | null>(null);

watch(
  () => props.question,
  () => {
    selectedReading.value = null;
    selectedMeaning.value = null;
  },
);

function submit() {
  if (selectedReading.value && selectedMeaning.value) {
    emit('answer', selectedReading.value, selectedMeaning.value);
  }
}
</script>

<template>
  <div class="question-container">
    <div class="kanji-display">
      <span class="badge" :class="question.isFromNewWords ? 'new' : 'review'">
        {{ question.isFromNewWords ? '새 단어' : '복습' }}
      </span>
      <div class="kanji">{{ question.word.kanji }}</div>
    </div>

    <div class="section">
      <h3 class="section-title">読み方 (읽는 방법)</h3>
      <div class="choices">
        <button
          v-for="choice in question.readingChoices"
          :key="choice"
          class="choice-btn"
          :class="{ selected: selectedReading === choice }"
          @click="selectedReading = choice"
        >
          {{ choice }}
        </button>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">意味 (뜻)</h3>
      <div class="choices">
        <button
          v-for="choice in question.meaningChoices"
          :key="choice"
          class="choice-btn"
          :class="{ selected: selectedMeaning === choice }"
          @click="selectedMeaning = choice"
        >
          {{ choice }}
        </button>
      </div>
    </div>

    <button
      class="next-btn"
      :disabled="!selectedReading || !selectedMeaning"
      @click="submit"
    >
      다음
    </button>
  </div>
</template>

<style scoped>
.question-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
}
.kanji-display {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  position: relative;
}
.badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.badge.new { background: #e3f2fd; color: #1565c0; }
.badge.review { background: #fff3e0; color: #e65100; }
.kanji {
  font-size: 3rem;
  font-weight: bold;
  color: #1a237e;
  font-family: 'Noto Sans JP', 'Hiragino Sans', serif;
}
.section-title {
  font-size: 0.95rem;
  color: #555;
  margin: 0 0 0.5rem;
}
.choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.choice-btn {
  padding: 0.8rem;
  font-size: 1.1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.choice-btn:hover {
  border-color: #90caf9;
  background: #f5f9ff;
}
.choice-btn.selected {
  border-color: #1a237e;
  background: #e8eaf6;
  font-weight: 600;
}
.next-btn {
  padding: 0.9rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: #1a237e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.next-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
.next-btn:not(:disabled):hover { background: #283593; }
</style>

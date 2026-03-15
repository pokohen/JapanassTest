<script setup lang="ts">
import { ref, watch, computed } from 'vue';
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

const exampleParts = computed(() => {
  const { example, kanji } = props.question.word;
  if (!example) return null;
  const idx = example.indexOf(kanji);
  if (idx === -1) return { before: example, word: '', after: '' };
  return {
    before: example.slice(0, idx),
    word: kanji,
    after: example.slice(idx + kanji.length),
  };
});

function submit() {
  if (selectedReading.value && selectedMeaning.value) {
    emit('answer', selectedReading.value, selectedMeaning.value);
  }
}
</script>

<template>
  <div class="question-container">
    <div class="question-paper">
      <div class="paper-header">
        <span class="badge" :class="question.isFromNewWords ? 'new' : 'review'">
          {{ question.isFromNewWords ? '新出' : '復習' }}
        </span>
        <span class="mondai-label">問題</span>
      </div>

      <div class="mondai-box">
        <p v-if="exampleParts" class="example-sentence">
          {{ exampleParts.before }}<span class="underline-word">{{ exampleParts.word }}</span>{{ exampleParts.after }}
        </p>
        <p v-else class="example-sentence standalone">
          {{ question.word.kanji }}
        </p>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">
        <span class="section-number">1</span>
        <span class="underline-word">{{ question.word.kanji }}</span> の読み方は？
      </h3>
      <div class="choices">
        <button
          v-for="(choice, i) in question.readingChoices"
          :key="choice"
          class="choice-btn"
          :class="{ selected: selectedReading === choice }"
          @click="selectedReading = choice"
        >
          <span class="choice-number">{{ i + 1 }}</span>
          {{ choice }}
        </button>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">
        <span class="section-number">2</span>
        <span class="underline-word">{{ question.word.kanji }}</span> の意味は？
      </h3>
      <div class="choices">
        <button
          v-for="(choice, i) in question.meaningChoices"
          :key="choice"
          class="choice-btn"
          :class="{ selected: selectedMeaning === choice }"
          @click="selectedMeaning = choice"
        >
          <span class="choice-number">{{ i + 1 }}</span>
          {{ choice }}
        </button>
      </div>
    </div>

    <button
      class="next-btn"
      :disabled="!selectedReading || !selectedMeaning"
      @click="submit"
    >
      次へ
    </button>
  </div>
</template>

<style scoped>
.question-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 520px;
}

/* 시험지 스타일 */
.question-paper {
  background: #fff;
  border: 2px solid #222;
  border-radius: 2px;
  padding: 1.25rem 1.5rem;
}
.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid #ccc;
}
.mondai-label {
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.15em;
}
.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.badge.new { background: #222; color: #fff; }
.badge.review { background: #fff; color: #222; border: 1px solid #222; }

.mondai-box {
  text-align: center;
  padding: 1rem 0;
}
.example-sentence {
  font-size: 1.35rem;
  color: #111;
  line-height: 2;
  font-family: 'Noto Sans JP', 'Hiragino Sans', serif;
  margin: 0;
}
.example-sentence.standalone {
  font-size: 2.5rem;
  font-weight: 700;
}

.underline-word {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  font-weight: 700;
}

/* 선택지 영역 */
.section-title {
  font-size: 0.9rem;
  color: #333;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border: 1.5px solid #333;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}
.choices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.choice-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.8rem;
  font-size: 1.05rem;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.12s;
  font-family: inherit;
  text-align: left;
}
.choice-btn:hover {
  border-color: #888;
  background: #f9f9f9;
}
.choice-btn.selected {
  border-color: #222;
  background: #f0f0f0;
  font-weight: 600;
}
.choice-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border: 1.5px solid #999;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}
.choice-btn.selected .choice-number {
  background: #222;
  color: #fff;
  border-color: #222;
}

.next-btn {
  padding: 0.85rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  background: #222;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: background 0.2s;
}
.next-btn:disabled {
  background: #bbb;
  cursor: not-allowed;
}
.next-btn:not(:disabled):hover { background: #444; }
</style>

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
    window.scrollTo({ top: 0 });
  },
);

const exampleParts = computed(() => {
  const { example, kanji } = props.question.word;
  if (!example) return null;

  // 1) 정확히 일치하면 바로 사용
  const exactIdx = example.indexOf(kanji);
  if (exactIdx !== -1) {
    return {
      before: example.slice(0, exactIdx),
      word: kanji,
      after: example.slice(exactIdx + kanji.length),
    };
  }

  // 2) 활용형 대응: kanji의 앞부분(어근)으로 매칭 후 활용 부분까지 포함
  //    例: 洗う → 洗って, 教える → 教えて, 足りる → 足りない
  const particles = 'をがはにでともへのよねか。、';
  for (let len = kanji.length - 1; len >= 1; len--) {
    const stem = kanji.slice(0, len);
    const stemIdx = example.indexOf(stem);
    if (stemIdx === -1) continue;

    // 어근 위치에서 활용 부분 끝까지 확장
    let end = stemIdx + stem.length;
    while (end < example.length && !particles.includes(example[end])) {
      // 다음 한자가 나오면 (원래 단어에 없는 한자) 중단
      if (isKanji(example[end]) && !kanji.includes(example[end])) break;
      end++;
    }
    return {
      before: example.slice(0, stemIdx),
      word: example.slice(stemIdx, end),
      after: example.slice(end),
    };
  }

  // 3) 매칭 실패 시 밑줄 없이 예문만 표시
  return { before: example, word: '', after: '' };
});

function isKanji(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}

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
        <span class="underline-word text-large">{{ question.word.kanji }}</span> の読み方は？
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
        <span class="underline-word text-large">{{ question.word.kanji }}</span> の意味は？
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
      다음 문제
    </button>
  </div>
</template>

<style scoped>
.question-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

/* 시험지 스타일 */
.question-paper {
  background: #fff;
  border: 2px solid #222;
  border-radius: 2px;
  padding: 1.25rem 1rem;
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
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.15em;
}
.badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.badge.new { background: #222; color: #fff; }
.badge.review { background: #fff; color: #222; border: 1px solid #222; }

.mondai-box {
  text-align: center;
  padding: 1.5rem 0.5rem;
}
.example-sentence {
  font-size: 1.6rem;
  color: #111;
  line-height: 2;
  font-family: 'Noto Sans JP', 'Hiragino Sans', serif;
  margin: 0;
  word-break: keep-all;
  overflow-wrap: break-word;
}
.example-sentence.standalone {
  font-size: 3rem;
  font-weight: 700;
}

.underline-word {
  text-decoration: underline;
  text-decoration-thickness: 2.5px;
  text-underline-offset: 5px;
  font-weight: 700;
}

/* 선택지 영역 */
.section-title {
  font-size: 1rem;
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
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid #333;
  border-radius: 50%;
  font-size: 0.8rem;
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
  padding: 1rem;
  font-size: 1.15rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.12s;
  font-family: inherit;
  text-align: left;
  min-height: 3.2rem;
}
.choice-btn:active {
  background: #f0f0f0;
  transform: scale(0.98);
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
  width: 1.4rem;
  height: 1.4rem;
  border: 1.5px solid #999;
  border-radius: 50%;
  font-size: 0.75rem;
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
  padding: 1.1rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  background: #222;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: background 0.2s;
}
.next-btn:disabled {
  background: #bbb;
  cursor: not-allowed;
}
.next-btn:not(:disabled):active { background: #000; }
.text-large {
  font-size: 1.3rem;
}

/* 모바일 세로 화면에서 선택지 1열 */
@media (max-width: 400px) {
  .choices {
    grid-template-columns: 1fr;
  }
  .example-sentence {
    font-size: 1.4rem;
  }
  .example-sentence.standalone {
    font-size: 2.5rem;
  }
}
</style>

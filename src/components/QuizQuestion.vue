<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { QuizQuestion } from '../types/word';
import { formLabel } from '../utils/conjugation';

const props = defineProps<{ question: QuizQuestion }>();
const emit = defineEmits<{
  answer: [payload: { reading?: string; meaning?: string; selected?: string }]
}>();

const selectedReading = ref<string | null>(null);
const selectedMeaning = ref<string | null>(null);
const selectedConjugation = ref<string | null>(null);

const conjugationLabel = computed(() =>
  props.question.type === 'conjugation'
    ? formLabel(props.question.item, props.question.form)
    : '',
);

watch(
  () => props.question,
  () => {
    selectedReading.value = null;
    selectedMeaning.value = null;
    selectedConjugation.value = null;
    window.scrollTo({ top: 0 });
  },
);

const exampleParts = computed(() => {
  if (props.question.type !== 'word') return null;
  const { example, kanji } = props.question.word;
  if (!example) return null;

  const exactIdx = example.indexOf(kanji);
  if (exactIdx !== -1) {
    return {
      before: example.slice(0, exactIdx),
      word: kanji,
      after: example.slice(exactIdx + kanji.length),
    };
  }

  const particles = 'をがはにでともへのよねか。、';
  for (let len = kanji.length - 1; len >= 1; len--) {
    const stem = kanji.slice(0, len);
    const stemIdx = example.indexOf(stem);
    if (stemIdx === -1) continue;

    let end = stemIdx + stem.length;
    while (end < example.length && !particles.includes(example[end])) {
      if (isKanji(example[end]) && !kanji.includes(example[end])) break;
      end++;
    }
    return {
      before: example.slice(0, stemIdx),
      word: example.slice(stemIdx, end),
      after: example.slice(end),
    };
  }

  return { before: example, word: '', after: '' };
});

function isKanji(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}

function submit() {
  if (props.question.type === 'word') {
    if (selectedReading.value && selectedMeaning.value) {
      emit('answer', {
        reading: selectedReading.value,
        meaning: selectedMeaning.value,
      });
    }
  } else {
    if (selectedConjugation.value) {
      emit('answer', { selected: selectedConjugation.value });
    }
  }
}

const canSubmit = computed(() => {
  if (props.question.type === 'word') {
    return !!selectedReading.value && !!selectedMeaning.value;
  }
  return !!selectedConjugation.value;
});
</script>

<template>
  <div class="question-container">
    <!-- 단어 문제 -->
    <template v-if="question.type === 'word'">
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
    </template>

    <!-- 활용 문제 -->
    <template v-else>
      <div class="question-paper">
        <div class="paper-header">
          <span class="badge conjugation">活用</span>
          <span class="mondai-label">問題</span>
        </div>

        <div class="mondai-box">
          <p class="example-sentence standalone">{{ question.item.base }}</p>
          <p class="conj-sub">
            {{ question.item.reading }} · {{ question.item.meaning }}
          </p>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          <span class="section-number">?</span>
          「<span class="underline-word text-large">{{ question.item.base }}</span>」 の <b>{{ conjugationLabel }}</b>은?
        </h3>
        <div class="choices">
          <button
            v-for="(choice, i) in question.choices"
            :key="choice"
            class="choice-btn"
            :class="{ selected: selectedConjugation === choice }"
            @click="selectedConjugation = choice"
          >
            <span class="choice-number">{{ i + 1 }}</span>
            {{ choice }}
          </button>
        </div>
      </div>
    </template>

    <button
      class="next-btn"
      :disabled="!canSubmit"
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
.badge.conjugation { background: #1a237e; color: #fff; }
.conj-sub {
  margin: 0.6rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

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
.choices-single {
  grid-template-columns: 1fr;
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

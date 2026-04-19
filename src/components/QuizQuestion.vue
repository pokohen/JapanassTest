<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { QuizQuestion, ConjugationItem, ConjForm } from '../types/word';
import { formLabel } from '../utils/conjugation';
import { rubyForItemForm, getReadingsForForm, toRubySegments } from '../utils/furigana';
import FuriganaText from './FuriganaText.vue';

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

function baseRuby(item: ConjugationItem) {
  return rubyForItemForm(item, undefined, item.base);
}
function choiceRuby(item: ConjugationItem, form: ConjForm, text: string) {
  return rubyForItemForm(item, form, text);
}
function sentenceRuby(item: ConjugationItem, sentence: string) {
  const readings = getReadingsForForm(item, undefined);
  return toRubySegments(sentence, readings);
}

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
          <span class="underline-word text-large">{{ question.word.kanji }}</span>의 읽는 방법은?
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
          <span class="underline-word text-large">{{ question.word.kanji }}</span>의 뜻은?
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

        <!-- 컨텍스트(예문 빈칸) 모드 -->
        <div v-if="question.context" class="mondai-box context-box">
          <p class="context-sentence">
            <template
              v-for="(seg, i) in sentenceRuby(question.item, question.context.sentence.split('___')[0])"
              :key="`a${i}`"
            >
              <ruby v-if="seg.rt">{{ seg.text }}<rt>{{ seg.rt }}</rt></ruby>
              <template v-else>{{ seg.text }}</template>
            </template>
            <span class="blank">___</span>
            <template
              v-for="(seg, i) in sentenceRuby(question.item, question.context.sentence.split('___')[1] ?? '')"
              :key="`b${i}`"
            >
              <ruby v-if="seg.rt">{{ seg.text }}<rt>{{ seg.rt }}</rt></ruby>
              <template v-else>{{ seg.text }}</template>
            </template>
          </p>
          <p class="context-translation">{{ question.context.translation }}</p>
          <p class="conj-sub">
            기본형:
            <FuriganaText :segments="baseRuby(question.item)" class="base-inline" />
            · {{ question.item.meaning }}
          </p>
        </div>

        <!-- 기본(dictionary → form) 모드 -->
        <div v-else class="mondai-box">
          <p class="example-sentence standalone">
            <FuriganaText :segments="baseRuby(question.item)" />
          </p>
          <p class="conj-sub">
            {{ question.item.reading }} · {{ question.item.meaning }}
          </p>
        </div>
      </div>

      <div class="section">
        <h3 v-if="question.context" class="section-title">
          <span class="section-number">?</span>
          빈칸에 들어갈 <b>{{ conjugationLabel }}</b>은?
        </h3>
        <h3 v-else class="section-title">
          <span class="section-number">?</span>
          「<FuriganaText :segments="baseRuby(question.item)" class="inline-ruby" />」의 <b>{{ conjugationLabel }}</b>은?
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
            <FuriganaText :segments="choiceRuby(question.item, question.form, choice)" />
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
.context-box {
  padding: 1.2rem 0.75rem;
  text-align: left;
}
.context-sentence {
  font-size: 1.4rem;
  line-height: 2.2;
  color: #111;
  font-family: 'Noto Sans JP', 'Hiragino Sans', serif;
  margin: 0 0 0.8rem;
  word-break: keep-all;
  overflow-wrap: break-word;
}
.context-sentence ruby rt {
  font-size: 0.5em;
  color: #666;
  font-weight: 400;
}
.blank {
  display: inline-block;
  min-width: 3.5rem;
  border-bottom: 2.5px solid #1a237e;
  margin: 0 0.25rem;
  color: #1a237e;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.1em;
}
.context-translation {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  padding: 0.5rem 0.7rem;
  background: #f7f8fa;
  border-radius: 6px;
  border-left: 3px solid #bbb;
}
.base-inline { font-weight: 600; color: #333; }
.inline-ruby { display: inline; }
@media (max-width: 400px) {
  .context-sentence { font-size: 1.2rem; line-height: 2.1; }
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

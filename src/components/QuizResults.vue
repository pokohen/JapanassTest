<script setup lang="ts">
import { computed } from 'vue';
import type { QuizResult, ConjugationItem, ConjForm } from '../types/word';
import { formLabelFull } from '../utils/conjugation';
import { rubyForItemForm, getReadingsForForm, toRubySegments } from '../utils/furigana';
import FuriganaText from './FuriganaText.vue';

function baseRuby(item: ConjugationItem) {
  return rubyForItemForm(item, undefined, item.base);
}
function formRuby(item: ConjugationItem, form: ConjForm, text: string) {
  return rubyForItemForm(item, form, text);
}
function sentenceSegs(item: ConjugationItem, sentence: string) {
  const readings = getReadingsForForm(item, undefined);
  return toRubySegments(sentence, readings);
}

const props = defineProps<{ result: QuizResult }>();
const emit = defineEmits<{ restart: [] }>();

const totalScore = computed(
  () =>
    props.result.correctReadings +
    props.result.correctMeanings +
    props.result.conjugationScore.correct +
    props.result.particleScore.correct,
);
const totalPossible = computed(
  () =>
    props.result.totalQuestions * 2 +
    props.result.conjugationScore.total +
    props.result.particleScore.total,
);
const percentage = computed(() => Math.round((totalScore.value / totalPossible.value) * 100));

const timeDisplay = computed(() => {
  const min = Math.floor(props.result.timeElapsed / 60);
  const sec = props.result.timeElapsed % 60;
  return `${min}분 ${sec}초`;
});

const grade = computed(() => {
  if (percentage.value >= 100) return { text: '완벽', color: '#2e7d32' };
  if (percentage.value >= 90) return { text: '우수', color: '#388e3c' };
  if (percentage.value >= 70) return { text: '양호', color: '#1976d2' };
  if (percentage.value >= 50) return { text: '보통', color: '#f57c00' };
  return { text: '노력 필요', color: '#d32f2f' };
});

function parseRuby(text: string): string {
  return text.replace(/\{([^|]+)\|([^}]+)\}/g, '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>');
}
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
      <div class="stat-row" v-if="result.conjugationScore.total > 0">
        <span>활용</span>
        <span>{{ result.conjugationScore.correct }} / {{ result.conjugationScore.total }}</span>
      </div>
      <div class="stat-row" v-if="result.particleScore.total > 0">
        <span>조사</span>
        <span>{{ result.particleScore.correct }} / {{ result.particleScore.total }}</span>
      </div>
    </div>

    <h3 class="detail-title">상세 결과</h3>
    <div class="detail-list">
      <template v-for="(d, i) in result.details" :key="i">
        <div v-if="d.type === 'word'" class="detail-item">
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
            <div v-if="d.word.example_reading" class="example" v-html="'例: ' + parseRuby(d.word.example_reading)" />
            <div v-else-if="d.word.example" class="example">
              例: {{ d.word.example }}
            </div>
          </div>
        </div>
        <div v-else-if="d.type === 'particle'" class="detail-item">
          <div class="detail-kanji particle">助詞</div>
          <div class="detail-answers">
            <div class="conj-base">
              <span class="particle-answer">{{ d.answer }}</span>
              <span class="conj-form">· {{ d.item.name }} · {{ d.item.meaning }}</span>
            </div>
            <div class="context-line">
              예문: {{ d.example.sentence.split('___')[0] }}<span class="answer-inline">{{ d.answer }}</span>{{ d.example.sentence.split('___')[1] ?? '' }}
            </div>
            <div class="context-translation-inline">{{ d.example.translation }}</div>
            <div :class="d.correct ? 'correct' : 'wrong'">
              답: {{ d.selected }}
              <span v-if="!d.correct" class="answer"> → {{ d.answer }}</span>
            </div>
          </div>
        </div>
        <div v-else class="detail-item">
          <div class="detail-kanji conjugation">活用</div>
          <div class="detail-answers">
            <div class="conj-base">
              <FuriganaText :segments="baseRuby(d.item)" />
              <span class="conj-form">· {{ formLabelFull(d.item, d.form) }}</span>
            </div>
            <div v-if="d.context" class="context-line">
              예문:
              <template
                v-for="(seg, si) in sentenceSegs(d.item, d.context.sentence.split('___')[0])"
                :key="`s1${si}`"
              >
                <ruby v-if="seg.rt">{{ seg.text }}<rt>{{ seg.rt }}</rt></ruby>
                <template v-else>{{ seg.text }}</template>
              </template>
              <span class="answer-inline">
                <FuriganaText :segments="formRuby(d.item, d.form, d.answer)" />
              </span>
              <template
                v-for="(seg, si) in sentenceSegs(d.item, d.context.sentence.split('___')[1] ?? '')"
                :key="`s2${si}`"
              >
                <ruby v-if="seg.rt">{{ seg.text }}<rt>{{ seg.rt }}</rt></ruby>
                <template v-else>{{ seg.text }}</template>
              </template>
            </div>
            <div :class="d.correct ? 'correct' : 'wrong'">
              답:
              <FuriganaText :segments="formRuby(d.item, d.form, d.selected)" />
              <span v-if="!d.correct" class="answer">
                →
                <FuriganaText :segments="formRuby(d.item, d.form, d.answer)" />
              </span>
            </div>
          </div>
        </div>
      </template>
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
.detail-kanji rt {
  font-size: 0.55rem;
  color: #666;
}
.detail-kanji.conjugation {
  font-size: 0.85rem;
  color: #fff;
  background: #1a237e;
  border-radius: 4px;
  padding: 0.3rem 0;
}
.detail-kanji.particle {
  font-size: 0.85rem;
  color: #fff;
  background: #6a1b9a;
  border-radius: 4px;
  padding: 0.3rem 0;
}
.particle-answer {
  font-size: 1.2rem;
  font-weight: 700;
  color: #6a1b9a;
  font-family: 'Noto Sans JP', 'Hiragino Sans', serif;
}
.context-translation-inline {
  font-size: 0.82rem;
  color: #666;
  margin: 0.2rem 0 0.3rem;
  padding: 0 0.55rem;
}
.conj-base {
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 0.2rem;
}
.conj-form {
  font-weight: 400;
  color: #666;
  font-size: 0.85rem;
}
.context-line {
  margin: 0.3rem 0;
  padding: 0.4rem 0.55rem;
  font-size: 0.9rem;
  color: #333;
  background: #f0f4f8;
  border-radius: 5px;
  line-height: 1.9;
  word-break: keep-all;
  overflow-wrap: break-word;
}
.context-line :deep(rt) { font-size: 0.55em; color: #666; }
.answer-inline {
  display: inline-block;
  padding: 0 0.3rem;
  font-weight: 700;
  color: #1a237e;
  border-bottom: 2px solid #1a237e;
  margin: 0 0.1rem;
}
.detail-answers { font-size: 0.9rem; }
.example {
  margin-top: 0.3rem;
  color: #555;
  font-size: 1.05rem;
  line-height: 2;
}
.example :deep(rt) {
  font-size: 0.6rem;
  color: #888;
}
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

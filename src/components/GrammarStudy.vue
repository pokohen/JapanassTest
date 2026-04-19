<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

type Tab = 'godan' | 'ichidan' | 'irregular' | 'iadj' | 'naadj';

const emit = defineEmits<{ back: [] }>();
const activeTab = ref<Tab>('godan');
const showTopBtn = ref(false);

function onScroll() {
  showTopBtn.value = window.scrollY > 300;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function selectTab(key: Tab) {
  activeTab.value = key;
  window.scrollTo({ top: 0, behavior: 'auto' });
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));

interface SummaryRow { form: string; rule: string; result: string }
const godanSummary: SummaryRow[] = [
  { form: 'ます형', rule: 'い단 + ます', result: '書きます' },
  { form: 'て형', rule: '어미별 규칙', result: '書いて' },
  { form: 'た형', rule: 'て형의 て/で → た/だ', result: '書いた' },
  { form: 'ない형', rule: 'あ단 + ない', result: '書かない' },
  { form: '가능형', rule: 'え단 + る', result: '書ける' },
  { form: '의지형', rule: 'お단 + う', result: '書こう' },
];
const ichidanSummary: SummaryRow[] = [
  { form: 'ます형', rule: 'る 떼고 + ます', result: '食べます' },
  { form: 'て형', rule: 'る 떼고 + て', result: '食べて' },
  { form: 'た형', rule: 'る 떼고 + た', result: '食べた' },
  { form: 'ない형', rule: 'る 떼고 + ない', result: '食べない' },
  { form: '가능형', rule: 'る 떼고 + られる', result: '食べられる' },
  { form: '의지형', rule: 'る 떼고 + よう', result: '食べよう' },
];
const iadjSummary: SummaryRow[] = [
  { form: '과거', rule: 'い → かった', result: '高かった' },
  { form: '부정', rule: 'い → くない', result: '高くない' },
  { form: '부사', rule: 'い → く', result: '高く' },
  { form: '연결 (て형)', rule: 'い → くて', result: '高くて' },
];
const naadjSummary: SummaryRow[] = [
  { form: '명사 꾸미기', rule: '+ な + 명사', result: 'きれいな花' },
  { form: '정중형', rule: '+ です', result: 'きれいです' },
  { form: '과거', rule: '+ でした', result: 'きれいでした' },
  { form: '부정', rule: '+ じゃない', result: 'きれいじゃない' },
  { form: '부사', rule: '+ に', result: 'きれいに' },
  { form: '연결 (て형)', rule: '+ で', result: 'きれいで' },
];

const tabs: { key: Tab; label: string; desc: string }[] = [
  { key: 'godan', label: '1형식 동사', desc: '가장 많은 동사! 끝 글자를 바꿔서 변신해요' },
  { key: 'ichidan', label: '2형식 동사', desc: '가장 쉬운 동사! 끝 る만 뚝 떼면 돼요' },
  { key: 'irregular', label: '3형식 동사', desc: 'する / 来る 딱 2개뿐! 통째로 외워요' },
  { key: 'iadj', label: 'い형용사', desc: '끝이 い로 끝나는 꾸밈말이에요' },
  { key: 'naadj', label: 'な형용사', desc: '명사를 꾸밀 때 な를 붙이는 꾸밈말이에요' },
];

const godanRules = [
  {
    form: 'ます형 — 존댓말',
    rule: '끝 글자를 「이」 소리로 바꾸고 + ます',
    desc: '친구에게 "먹어"라고 하던 걸 선생님께 "먹습니다"라고 공손하게 말할 때 써요.',
    examples: [
      { base: '書く (쓰다)', result: '書きます', hint: 'く(쿠) → き(키)' },
      { base: '飲む (마시다)', result: '飲みます', hint: 'む(무) → み(미)' },
      { base: '話す (말하다)', result: '話します', hint: 'す(스) → し(시)' },
      { base: '買う (사다)', result: '買います', hint: 'う(우) → い(이)' },
    ],
  },
  {
    form: 'て형 — "~하고"',
    rule: '끝 글자가 무엇인지 보고 바꾸기',
    desc: '"밥 먹고 학교 가요"처럼 문장을 이어 붙일 때 써요. 끝 글자에 따라 방법이 달라져요.',
    examples: [
      { base: '끝이 う, つ, る', result: 'って', hint: '예: 買う → 買って' },
      { base: '끝이 ぬ, ぶ, む', result: 'んで', hint: '예: 飲む → 飲んで' },
      { base: '끝이 く', result: 'いて', hint: '예: 書く → 書いて' },
      { base: '끝이 ぐ', result: 'いで', hint: '예: 泳ぐ → 泳いで' },
      { base: '끝이 す', result: 'して', hint: '예: 話す → 話して' },
      { base: '行く (예외)', result: '行って', hint: '*딱 이 하나만 예외!' },
    ],
  },
  {
    form: 'た형 — 과거형 "~했다"',
    rule: 'て형에서 て→た, で→だ로 바꾸기',
    desc: '"어제 밥을 먹었다"처럼 이미 끝난 일을 말할 때 써요. て형을 알면 아주 쉬워요!',
    examples: [
      { base: '書いて', result: '書いた', hint: '마지막 글자 하나만 바꿔요' },
      { base: '飲んで', result: '飲んだ', hint: 'で → だ' },
      { base: '買って', result: '買った', hint: 'て → た' },
      { base: '行って', result: '行った', hint: 'て → た' },
    ],
  },
  {
    form: 'ない형 — 부정형 "안 ~해요"',
    rule: '끝 글자를 「아」 소리로 바꾸고 + ない',
    desc: '"안 먹어요", "안 가요"처럼 아니라고 말할 때 써요. 주의! う로 끝나는 동사는 あ가 아니라 わ로 바뀌어요.',
    examples: [
      { base: '書く', result: '書かない', hint: 'く(쿠) → か(카)' },
      { base: '飲む', result: '飲まない', hint: 'む(무) → ま(마)' },
      { base: '買う', result: '買わない', hint: 'う → わ (わ로! 주의!)' },
      { base: '話す', result: '話さない', hint: 'す(스) → さ(사)' },
    ],
  },
  {
    form: '가능형 — "~할 수 있어요"',
    rule: '끝 글자를 「에」 소리로 바꾸고 + る',
    desc: '"나는 일본어를 할 수 있어요"처럼 할 줄 안다고 말할 때 써요.',
    examples: [
      { base: '書く', result: '書ける', hint: 'く(쿠) → け(케) + る' },
      { base: '飲む', result: '飲める', hint: 'む(무) → め(메) + る' },
      { base: '話す', result: '話せる', hint: 'す(스) → せ(세) + る' },
      { base: '買う', result: '買える', hint: 'う(우) → え(에) + る' },
    ],
  },
  {
    form: '의지형 — "~하자"',
    rule: '끝 글자를 「오」 소리로 바꾸고 + う',
    desc: '"같이 먹자!", "놀러 가자!"처럼 친구에게 함께 하자고 할 때 써요.',
    examples: [
      { base: '書く', result: '書こう', hint: 'く(쿠) → こ(코) + う' },
      { base: '飲む', result: '飲もう', hint: 'む(무) → も(모) + う' },
      { base: '行く', result: '行こう', hint: '"가자!"' },
      { base: '話す', result: '話そう', hint: 'す(스) → そ(소) + う' },
    ],
  },
];

const ichidanRules = [
  {
    form: 'ます형 — 존댓말',
    rule: '끝 る 떼고 + ます',
    desc: '공손하게 "~합니다"라고 말할 때 써요. る만 쏙 빼면 돼요!',
    examples: [
      { base: '食べる (먹다)', result: '食べます', hint: 'る를 빼고 ます를 붙여요' },
      { base: '見る (보다)', result: '見ます', hint: 'る 탈락' },
      { base: '起きる (일어나다)', result: '起きます', hint: 'る 탈락' },
    ],
  },
  {
    form: 'て형 — "~하고"',
    rule: '끝 る 떼고 + て',
    desc: '문장을 이어 붙일 때 써요. 1형식보다 훨씬 쉬워요!',
    examples: [
      { base: '食べる', result: '食べて', hint: 'る 대신 て' },
      { base: '見る', result: '見て', hint: 'る 대신 て' },
      { base: '寝る (자다)', result: '寝て', hint: 'る 대신 て' },
    ],
  },
  {
    form: 'た형 — 과거형 "~했다"',
    rule: '끝 る 떼고 + た',
    desc: '지난 일을 말할 때 써요.',
    examples: [
      { base: '食べる', result: '食べた', hint: 'る 대신 た' },
      { base: '見る', result: '見た', hint: 'る 대신 た' },
      { base: '教える (가르치다)', result: '教えた', hint: 'る 대신 た' },
    ],
  },
  {
    form: 'ない형 — 부정형 "안 ~해요"',
    rule: '끝 る 떼고 + ない',
    desc: '"안 먹어요"처럼 부정할 때 써요.',
    examples: [
      { base: '食べる', result: '食べない', hint: 'る 대신 ない' },
      { base: '見る', result: '見ない', hint: 'る 대신 ない' },
      { base: '起きる', result: '起きない', hint: 'る 대신 ない' },
    ],
  },
  {
    form: '가능형 — "~할 수 있어요"',
    rule: '끝 る 떼고 + られる',
    desc: '할 줄 안다고 말할 때 써요. (일상 회화에선 짧게 れる만 붙이기도 해요)',
    examples: [
      { base: '食べる', result: '食べられる', hint: 'る 대신 られる' },
      { base: '見る', result: '見られる', hint: 'る 대신 られる' },
      { base: '覚える (외우다)', result: '覚えられる', hint: 'る 대신 られる' },
    ],
  },
  {
    form: '의지형 — "~하자"',
    rule: '끝 る 떼고 + よう',
    desc: '함께 하자고 권할 때 써요.',
    examples: [
      { base: '食べる', result: '食べよう', hint: '"먹자!"' },
      { base: '見る', result: '見よう', hint: '"보자!"' },
      { base: '寝る', result: '寝よう', hint: '"자자!"' },
    ],
  },
];

const irregularRules = [
  {
    base: 'する (하다)',
    forms: [
      { form: 'ます형 (존댓말)', result: 'します' },
      { form: 'て형 (~하고)', result: 'して' },
      { form: 'た형 (~했다)', result: 'した' },
      { form: 'ない형 (안~해요)', result: 'しない' },
      { form: '가능형 (할 수 있다)', result: 'できる' },
      { form: '의지형 (~하자)', result: 'しよう' },
    ],
  },
  {
    base: '来る (오다)',
    forms: [
      { form: 'ます형 (존댓말)', result: '来ます (きます)' },
      { form: 'て형 (~하고)', result: '来て (きて)' },
      { form: 'た형 (~했다)', result: '来た (きた)' },
      { form: 'ない형 (안~해요)', result: '来ない (こない)' },
      { form: '가능형 (올 수 있다)', result: '来られる (こられる)' },
      { form: '의지형 (~하자)', result: '来よう (こよう)' },
    ],
  },
];

const iadjRules = [
  {
    form: '과거형 "~였어"',
    rule: '끝 い 떼고 + かった',
    desc: '"비쌌어", "추웠어"처럼 지난 느낌을 말할 때 써요.',
    examples: [
      { base: '高い (비싸다)', result: '高かった', hint: 'い 대신 かった' },
      { base: '寒い (춥다)', result: '寒かった', hint: 'い 대신 かった' },
      { base: 'いい (좋다)', result: 'よかった', hint: '*이 단어만 특별! い → よ로 변해요' },
    ],
  },
  {
    form: '부정형 "안 ~해"',
    rule: '끝 い 떼고 + くない',
    desc: '"안 비싸", "안 즐거워"처럼 아니라고 말할 때 써요.',
    examples: [
      { base: '高い', result: '高くない', hint: 'い 대신 くない' },
      { base: '楽しい (즐겁다)', result: '楽しくない', hint: 'い 대신 くない' },
      { base: 'いい', result: 'よくない', hint: '*い → よ 예외' },
    ],
  },
  {
    form: '부사형 "~하게"',
    rule: '끝 い 떼고 + く',
    desc: '"빨리 달리다"처럼 동작을 꾸밀 때 써요. 우리말의 "~게/히"와 비슷해요.',
    examples: [
      { base: '早い (빠르다)', result: '早く', hint: '早く 走る = 빨리 달리다' },
      { base: '大きい (크다)', result: '大きく', hint: 'い 대신 く' },
      { base: 'いい', result: 'よく', hint: '*い → よ 예외' },
    ],
  },
  {
    form: 'て형 "~하고"',
    rule: '끝 い 떼고 + くて',
    desc: '형용사 두 개를 이어서 말할 때 써요. "비싸고 맛있다"처럼요.',
    examples: [
      { base: '高い', result: '高くて', hint: '高くておいしい = 비싸고 맛있어' },
      { base: '忙しい (바쁘다)', result: '忙しくて', hint: 'い 대신 くて' },
      { base: 'いい', result: 'よくて', hint: '*い → よ 예외' },
    ],
  },
];

const naAdjRules = [
  {
    form: '명사 꾸미기 "예쁜 꽃"',
    rule: '+ な + 명사',
    desc: 'な형용사의 이름이 여기서 왔어요! 뒤에 꾸밀 사물이 오면 꼭 な를 붙여요.',
    examples: [
      { base: 'きれい (예쁘다) + 花(꽃)', result: 'きれいな花', hint: '예쁜 꽃' },
      { base: '元気 (건강하다) + 子(아이)', result: '元気な子', hint: '건강한 아이' },
      { base: '静か (조용하다) + 町(동네)', result: '静かな町', hint: '조용한 동네' },
      { base: '有名 (유명하다) + 人(사람)', result: '有名な人', hint: '유명한 사람' },
    ],
  },
  {
    form: '정중형 "~해요"',
    rule: '+ です (존댓말) / + だ (반말)',
    desc: '뒤에 です만 붙이면 끝! い형용사와 다르게 활용이 없어요. 마치 명사처럼 움직여요.',
    examples: [
      { base: 'きれい', result: 'きれいです', hint: '예뻐요' },
      { base: '好き (좋아하다)', result: '好きです', hint: '좋아해요' },
      { base: '元気', result: '元気だ', hint: '건강해 (반말)' },
      { base: '便利 (편리하다)', result: '便利です', hint: '편리해요' },
    ],
  },
  {
    form: '과거형 "~였어요"',
    rule: '+ でした (존댓말) / + だった (반말)',
    desc: '지난 일을 말할 때 써요. 명사 과거형이랑 똑같은 방식이에요!',
    examples: [
      { base: 'きれい', result: 'きれいでした', hint: '예뻤어요' },
      { base: '静か', result: '静かだった', hint: '조용했어 (반말)' },
      { base: '好き', result: '好きでした', hint: '좋아했어요' },
      { base: '元気', result: '元気でした', hint: '건강했어요' },
    ],
  },
  {
    form: '부정형 "~이 아니에요"',
    rule: '+ じゃない (반말) / + じゃないです (존댓말)',
    desc: '아니라고 말할 때 써요. 더 정중하게는 ではありません을 써요.',
    examples: [
      { base: 'きれい', result: 'きれいじゃない', hint: '안 예뻐 (반말)' },
      { base: '静か', result: '静かじゃないです', hint: '조용하지 않아요' },
      { base: '好き', result: '好きじゃない', hint: '안 좋아해' },
      { base: '元気', result: '元気ではありません', hint: '건강하지 않습니다 (더 정중)' },
    ],
  },
  {
    form: '부사형 "~하게"',
    rule: '+ に',
    desc: '"어떻게?"를 말할 때 써요. い형용사의 く와 짝꿍이에요! (い형용사 → く, な형용사 → に)',
    examples: [
      { base: 'きれい', result: 'きれいに', hint: 'きれいに 書く = 예쁘게 쓰다' },
      { base: '静か', result: '静かに', hint: '静かに 話す = 조용히 말하다' },
      { base: '元気', result: '元気に', hint: '元気に 遊ぶ = 활기차게 놀다' },
      { base: '上手 (잘하다)', result: '上手に', hint: '上手に 歌う = 노래를 잘 부르다' },
    ],
  },
  {
    form: 'て형 "~하고"',
    rule: '+ で',
    desc: '두 가지를 이어서 말할 때 써요. い형용사는 くて, な형용사는 で를 써요.',
    examples: [
      { base: 'きれい', result: 'きれいで', hint: 'きれいで 優しい = 예쁘고 상냥해' },
      { base: '静か', result: '静かで', hint: '静かで 広い = 조용하고 넓어' },
      { base: '有名', result: '有名で', hint: '有名で 人気 = 유명하고 인기가 많아' },
      { base: '元気', result: '元気で', hint: '元気で 明るい = 건강하고 밝아' },
    ],
  },
];
</script>

<template>
  <div class="study-screen">
    <header class="study-header">
      <button class="back-btn" @click="emit('back')" aria-label="뒤로가기">
        <span aria-hidden="true">←</span> 뒤로
      </button>
      <h1 class="study-title">기초 문법 공부</h1>
    </header>

    <div class="intro-card">
      <p class="intro-text">
        일본어 동사는 <strong>세 반(1·2·3형식)</strong>으로 나뉘어요!
      </p>
      <ul class="intro-list">
        <li><strong>1형식</strong> — 친구가 제일 많아요. 끝 글자를 다른 글자로 <em>변신</em>시켜요.</li>
        <li><strong>2형식</strong> — 규칙이 제일 쉬워요. 끝 <code>る</code>만 쏙 빼면 끝!</li>
        <li><strong>3형식</strong> — <code>する</code>, <code>来る</code> 딱 2명뿐! 통째로 외워요.</li>
      </ul>
      <p class="intro-text">
        꾸밈말(형용사)은 <strong>い형용사</strong>와 <strong>な형용사</strong> 두 종류로 나뉘어요. 규칙이 완전히 다르니 꼭 구별해야 해요!
      </p>
      <p class="intro-tip">
        <span aria-hidden="true">👉</span> 동사·형용사를 쓸 때 제일 먼저 할 일은 <strong>"이 단어는 어느 종류지?"</strong>를 알아내는 거예요.
      </p>
    </div>

    <div class="tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <p class="tab-desc">
      {{ tabs.find((t) => t.key === activeTab)?.desc }}
    </p>

    <!-- 1형식 -->
    <section v-if="activeTab === 'godan'" class="content">
      <div class="note">
        <strong><span aria-hidden="true">🔍</span> 1형식은 어떻게 알아봐요?</strong>
        <ul class="note-list">
          <li>끝 글자가 <strong>く, ぐ, す, つ, ぬ, ぶ, む, う</strong>면 무조건 1형식!</li>
          <li>끝이 <code>る</code>여도, 그 앞 글자가 <strong>あ·う·お</strong> 소리면 1형식이에요.<br />예: <code>作(つく)る</code>, <code>帰(かえ)る</code>, <code>分(わ)かる</code></li>
        </ul>
        <p class="note-extra">
          <span aria-hidden="true">💡</span> 한 줄 요약: "대부분의 일본어 동사는 1형식"이에요.
          변신할 때 끝 글자가 <strong>あ·い·う·え·お</strong> 다섯 자리(단)를 왔다 갔다 해서 옛날엔 "5단 동사"라고도 불렸어요.
        </p>
      </div>

      <div class="summary-card">
        <div class="summary-title">한눈에 보기 — <span class="summary-example">書(か)く</span> (쓰다)</div>
        <div class="summary-grid summary-grid-3">
          <div class="summary-cell head">형태</div>
          <div class="summary-cell head">규칙</div>
          <div class="summary-cell head">예</div>
          <template v-for="row in godanSummary" :key="row.form">
            <div class="summary-cell">{{ row.form }}</div>
            <div class="summary-cell rule">{{ row.rule }}</div>
            <div class="summary-cell result">{{ row.result }}</div>
          </template>
        </div>
      </div>

      <h2 class="section-head"><span aria-hidden="true">📝</span> 형태별 자세히 보기</h2>
      <article v-for="rule in godanRules" :key="rule.form" class="rule-card">
        <h3 class="rule-title">{{ rule.form }}</h3>
        <div class="rule-formula">{{ rule.rule }}</div>
        <p class="rule-desc">{{ rule.desc }}</p>
        <div class="examples">
          <div v-for="(ex, i) in rule.examples" :key="i" class="example-row">
            <span class="ex-base">{{ ex.base }}</span>
            <span class="ex-arrow">→</span>
            <span class="ex-result">{{ ex.result }}</span>
            <span class="ex-hint">{{ ex.hint }}</span>
          </div>
        </div>
      </article>
    </section>

    <!-- 2형식 -->
    <section v-if="activeTab === 'ichidan'" class="content">
      <div class="note">
        <strong><span aria-hidden="true">🔍</span> 2형식은 어떻게 알아봐요?</strong>
        <ul class="note-list">
          <li>끝이 <strong>い + る</strong> 또는 <strong>え + る</strong>로 끝나면 2형식일 가능성이 커요.</li>
          <li>예: <code>食(た)べる</code>, <code>見(み)る</code>, <code>起(お)きる</code>, <code>寝(ね)る</code></li>
        </ul>
        <p class="note-extra">
          <span aria-hidden="true">💡</span> 2형식은 <strong>"る만 뚝 떼고 알맞은 꼬리 붙이기"</strong>가 전부예요. 정말 쉬워요!
        </p>
        <p class="warn">
          <span aria-hidden="true">⚠️</span> 함정 주의! 모양은 2형식 같은데 실제론 <strong>1형식</strong>인 동사들이 있어요.
          <br /><code>帰(かえ)る</code>(돌아가다), <code>走(はし)る</code>(달리다), <code>入(はい)る</code>(들어가다).
          <br />이건 그냥 외워야 해요!
        </p>
      </div>

      <div class="summary-card">
        <div class="summary-title">한눈에 보기 — <span class="summary-example">食(た)べる</span> (먹다)</div>
        <div class="summary-grid summary-grid-3">
          <div class="summary-cell head">형태</div>
          <div class="summary-cell head">규칙</div>
          <div class="summary-cell head">예</div>
          <template v-for="row in ichidanSummary" :key="row.form">
            <div class="summary-cell">{{ row.form }}</div>
            <div class="summary-cell rule">{{ row.rule }}</div>
            <div class="summary-cell result">{{ row.result }}</div>
          </template>
        </div>
      </div>

      <h2 class="section-head"><span aria-hidden="true">📝</span> 형태별 자세히 보기</h2>
      <article v-for="rule in ichidanRules" :key="rule.form" class="rule-card">
        <h3 class="rule-title">{{ rule.form }}</h3>
        <div class="rule-formula">{{ rule.rule }}</div>
        <p class="rule-desc">{{ rule.desc }}</p>
        <div class="examples">
          <div v-for="(ex, i) in rule.examples" :key="i" class="example-row">
            <span class="ex-base">{{ ex.base }}</span>
            <span class="ex-arrow">→</span>
            <span class="ex-result">{{ ex.result }}</span>
            <span class="ex-hint">{{ ex.hint }}</span>
          </div>
        </div>
      </article>
    </section>

    <!-- 3형식 -->
    <section v-if="activeTab === 'irregular'" class="content">
      <div class="note">
        <strong><span aria-hidden="true">🔍</span> 3형식은 아주 단순해요!</strong>
        <ul class="note-list">
          <li>전 세계에 <strong><code>する</code>(하다)</strong>와 <strong><code>来(く)る</code>(오다)</strong> 딱 2개뿐!</li>
          <li>규칙이 없으니까 그냥 <strong>통째로 외우면 끝</strong>이에요.</li>
        </ul>
        <p class="warn">
          <span aria-hidden="true">⚠️</span> 특히 <code>来る</code>는 모양에 따라 읽는 소리가 <strong>き / く / こ</strong>로 바뀌어요.
          눈으로만 보지 말고 소리 내어 읽어보세요!
        </p>
      </div>

      <h2 class="section-head"><span aria-hidden="true">📝</span> 전체 활용표</h2>
      <article v-for="verb in irregularRules" :key="verb.base" class="rule-card irreg-card">
        <h3 class="rule-title">{{ verb.base }}</h3>
        <div class="rule-formula">규칙 없음 — 통째로 외우기</div>
        <div class="irreg-grid">
          <div v-for="f in verb.forms" :key="f.form" class="irreg-row">
            <span class="irreg-form">{{ f.form }}</span>
            <span class="irreg-result">{{ f.result }}</span>
          </div>
        </div>
      </article>
    </section>

    <!-- い형용사 -->
    <section v-if="activeTab === 'iadj'" class="content">
      <div class="note">
        <strong><span aria-hidden="true">🔍</span> い형용사가 뭐예요?</strong>
        <ul class="note-list">
          <li>사물의 성질이나 상태를 꾸며주는 말이에요. 우리말의 "예쁘다, 크다"랑 똑같아요!</li>
          <li>이름처럼 끝이 <strong><code>い</code></strong>로 끝나요. 예: <code>高い</code>(비싸다), <code>寒い</code>(춥다), <code>楽しい</code>(즐겁다)</li>
        </ul>
        <p class="note-extra">
          <span aria-hidden="true">💡</span> 변신 방법은 간단해요. <strong>끝의 <code>い</code>를 떼고</strong>, 대신 새 꼬리를 붙이면 끝!
        </p>
        <p class="warn">
          <span aria-hidden="true">⚠️</span> 딱 하나 <strong><code>いい</code>(좋다)</strong>만 특별해요.
          이 친구는 변신할 때 어간이 <strong><code>よ</code></strong>로 바뀌어요. (예: いい → よかった)
        </p>
      </div>

      <div class="summary-card">
        <div class="summary-title">한눈에 보기 — <span class="summary-example">高(たか)い</span> (비싸다)</div>
        <div class="summary-grid summary-grid-3">
          <div class="summary-cell head">형태</div>
          <div class="summary-cell head">규칙</div>
          <div class="summary-cell head">예</div>
          <template v-for="row in iadjSummary" :key="row.form">
            <div class="summary-cell">{{ row.form }}</div>
            <div class="summary-cell rule">{{ row.rule }}</div>
            <div class="summary-cell result">{{ row.result }}</div>
          </template>
        </div>
      </div>

      <h2 class="section-head"><span aria-hidden="true">📝</span> 형태별 자세히 보기</h2>
      <article v-for="rule in iadjRules" :key="rule.form" class="rule-card">
        <h3 class="rule-title">{{ rule.form }}</h3>
        <div class="rule-formula">{{ rule.rule }}</div>
        <p class="rule-desc">{{ rule.desc }}</p>
        <div class="examples">
          <div v-for="(ex, i) in rule.examples" :key="i" class="example-row">
            <span class="ex-base">{{ ex.base }}</span>
            <span class="ex-arrow">→</span>
            <span class="ex-result">{{ ex.result }}</span>
            <span class="ex-hint">{{ ex.hint }}</span>
          </div>
        </div>
      </article>
    </section>

    <!-- な형용사 -->
    <section v-if="activeTab === 'naadj'" class="content">
      <div class="note">
        <strong><span aria-hidden="true">🔍</span> な형용사가 뭐예요?</strong>
        <ul class="note-list">
          <li>い형용사랑 똑같이 사물의 성질을 꾸며주는 말이에요. 하지만 규칙이 완전히 달라요!</li>
          <li>사전에 나올 땐 끝에 な가 없어요. 예: <code>きれい</code>(예쁘다), <code>好(す)き</code>(좋아하다), <code>元気(げんき)</code>(건강하다), <code>静(しず)か</code>(조용하다)</li>
          <li>뒤에 <strong>명사(사물 이름)가 올 때만</strong> な를 붙여요. 그래서 "な형용사"라고 불러요.</li>
        </ul>
        <p class="note-extra">
          <span aria-hidden="true">💡</span> 핵심 비밀: な형용사는 <strong>명사처럼 움직여요</strong>!
          <br />그래서 활용도 명사처럼 뒤에 <code>です / でした / じゃない</code>를 붙이면 돼요.
        </p>
        <div class="compare-card">
          <div class="compare-title">い형용사 vs な형용사 한눈에</div>
          <div class="compare-grid">
            <div class="compare-cell head">형태</div>
            <div class="compare-cell head">い형용사</div>
            <div class="compare-cell head">な형용사</div>
            <div class="compare-cell">명사 꾸미기</div>
            <div class="compare-cell">高<strong>い</strong>本</div>
            <div class="compare-cell">きれい<strong>な</strong>花</div>
            <div class="compare-cell">존댓말</div>
            <div class="compare-cell">高い<strong>です</strong></div>
            <div class="compare-cell">きれい<strong>です</strong></div>
            <div class="compare-cell">과거</div>
            <div class="compare-cell">高<strong>かった</strong></div>
            <div class="compare-cell">きれい<strong>でした</strong></div>
            <div class="compare-cell">부정</div>
            <div class="compare-cell">高<strong>くない</strong></div>
            <div class="compare-cell">きれい<strong>じゃない</strong></div>
            <div class="compare-cell">부사 (~하게)</div>
            <div class="compare-cell">高<strong>く</strong></div>
            <div class="compare-cell">きれい<strong>に</strong></div>
            <div class="compare-cell">연결 (~하고)</div>
            <div class="compare-cell">高<strong>くて</strong></div>
            <div class="compare-cell">きれい<strong>で</strong></div>
          </div>
        </div>
        <p class="warn">
          <span aria-hidden="true">⚠️</span> 헷갈리기 쉬운 친구들!
          <br /><code>きれい</code>(예쁘다), <code>嫌(きら)い</code>(싫어하다)는 끝이 い처럼 보이지만 <strong>な형용사</strong>예요!
          <br /><code>同(おな)じ</code>(같다)는 특이하게 명사를 꾸밀 때 な를 <strong>안 붙여요</strong>. (同じ人 <span aria-hidden="true">⭕</span> / 同じな人 <span aria-hidden="true">❌</span>)
        </p>
      </div>

      <div class="summary-card">
        <div class="summary-title">한눈에 보기 — <span class="summary-example">きれい</span> (예쁘다)</div>
        <div class="summary-grid summary-grid-3">
          <div class="summary-cell head">형태</div>
          <div class="summary-cell head">규칙</div>
          <div class="summary-cell head">예</div>
          <template v-for="row in naadjSummary" :key="row.form">
            <div class="summary-cell">{{ row.form }}</div>
            <div class="summary-cell rule">{{ row.rule }}</div>
            <div class="summary-cell result">{{ row.result }}</div>
          </template>
        </div>
      </div>

      <h2 class="section-head"><span aria-hidden="true">📝</span> 형태별 자세히 보기</h2>
      <article v-for="rule in naAdjRules" :key="rule.form" class="rule-card">
        <h3 class="rule-title">{{ rule.form }}</h3>
        <div class="rule-formula">{{ rule.rule }}</div>
        <p class="rule-desc">{{ rule.desc }}</p>
        <div class="examples">
          <div v-for="(ex, i) in rule.examples" :key="i" class="example-row">
            <span class="ex-base">{{ ex.base }}</span>
            <span class="ex-arrow">→</span>
            <span class="ex-result">{{ ex.result }}</span>
            <span class="ex-hint">{{ ex.hint }}</span>
          </div>
        </div>
      </article>
    </section>

    <button class="back-bottom-btn" @click="emit('back')">
      시험으로 돌아가기
    </button>

    <button
      v-show="showTopBtn"
      class="to-top-btn"
      @click="scrollToTop"
      aria-label="맨 위로"
    >
      <span aria-hidden="true">↑</span>
    </button>
  </div>
</template>

<style scoped>
.study-screen {
  --header-h: 3.25rem;
  --tabs-h: 3.25rem;
  --sticky-h: calc(var(--header-h) + var(--tabs-h));
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0.25rem 2rem;
  width: 100%;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
.study-screen button { -webkit-tap-highlight-color: transparent; }
@media (max-width: 360px) {
  .study-screen { padding: 0.75rem 0.1rem 2rem; }
}
.study-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: sticky;
  top: 0;
  background: #fafbfc;
  padding: 0.5rem 0;
  z-index: 10;
  min-height: var(--header-h);
}
.back-btn {
  padding: 0.5rem 0.9rem;
  font-size: 0.9rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
}
.back-btn:active { background: #f0f0f0; }
.study-title {
  font-size: 1.2rem;
  margin: 0;
  color: #222;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 360px) {
  .study-title { font-size: 1.05rem; }
  .back-btn { padding: 0.45rem 0.7rem; font-size: 0.85rem; }
}

.intro-card {
  background: #fff8e1;
  border-left: 4px solid #f9a825;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.intro-text {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
}
.intro-list {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.88rem;
  color: #333;
  line-height: 1.5;
}
.intro-list code {
  background: #fff;
  border: 1px solid #e0c36b;
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
}
.intro-tip {
  margin: 0.2rem 0 0;
  font-size: 0.88rem;
  color: #5d4200;
  line-height: 1.5;
  background: #fff3c1;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.3rem;
  position: sticky;
  top: var(--header-h);
  background: #fafbfc;
  z-index: 9;
  padding: 0.25rem 0;
  min-height: var(--tabs-h);
}
.tab-btn {
  padding: 0.55rem 0.1rem;
  font-size: 0.7rem;
  font-weight: 700;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  transition: all 0.15s;
  line-height: 1.2;
  word-break: keep-all;
  min-width: 0;
}
@media (min-width: 400px) {
  .tab-btn { font-size: 0.8rem; padding: 0.7rem 0.3rem; }
}
@media (max-width: 360px) {
  .tabs { gap: 0.2rem; }
  .tab-btn { font-size: 0.65rem; padding: 0.5rem 0.05rem; }
}
.tab-btn.active {
  border-color: #222;
  background: #222;
  color: #fff;
}
.tab-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  font-weight: 500;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.note {
  background: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.55;
  color: #1a3a5c;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.note-list {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.note-list code,
.note-extra code,
.warn code {
  background: #fff;
  border: 1px solid #b8d4ea;
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
}
.note-extra {
  margin: 0;
  padding: 0.5rem 0.7rem;
  background: #fff;
  border-radius: 6px;
  color: #1a3a5c;
}
.warn {
  margin: 0;
  padding: 0.5rem 0.7rem;
  background: #fff3e0;
  border-radius: 6px;
  color: #6a3b0a;
  line-height: 1.5;
}
.warn code {
  background: #fff;
  border-color: #ecb27c;
}

.compare-card {
  background: #fff;
  border: 1px solid #b8d4ea;
  border-radius: 8px;
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.compare-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3a5c;
  text-align: center;
}
.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr 1.1fr;
  gap: 1px;
  background: #cfe2f3;
  border-radius: 6px;
  overflow: hidden;
}
.compare-cell {
  background: #fff;
  padding: 0.45rem 0.3rem;
  font-size: 0.85rem;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.1rem;
  line-height: 1.3;
  min-width: 0;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
@media (max-width: 360px) {
  .compare-cell { font-size: 0.78rem; padding: 0.4rem 0.2rem; }
  .compare-cell.head { font-size: 0.78rem; }
}
.compare-cell.head {
  background: #e3f2fd;
  font-weight: 700;
  color: #1a3a5c;
  font-size: 0.86rem;
}
.compare-cell strong {
  color: #d84315;
  font-weight: 700;
}
.summary-card {
  background: #fff;
  border: 2px solid #222;
  border-radius: 10px;
  padding: 0.8rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  scroll-margin-top: calc(var(--sticky-h) + 1rem);
}
.summary-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  text-align: center;
}
.summary-example {
  display: inline-block;
  background: #222;
  color: #fff;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
  margin: 0 0.15rem;
}
.summary-grid {
  display: grid;
  gap: 1px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}
.summary-grid-3 {
  grid-template-columns: 0.9fr 1.3fr 1.1fr;
}
.summary-cell {
  background: #fff;
  padding: 0.5rem 0.35rem;
  font-size: 0.85rem;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.2rem;
  line-height: 1.35;
  min-width: 0;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
.summary-cell.head {
  background: #222;
  color: #fff;
  font-weight: 700;
  font-size: 0.82rem;
}
.summary-cell.rule {
  color: #1a3a5c;
  font-size: 0.82rem;
}
.summary-cell.result {
  color: #1976d2;
  font-weight: 700;
  font-size: 0.95rem;
}
@media (max-width: 360px) {
  .summary-cell { font-size: 0.78rem; padding: 0.4rem 0.25rem; }
  .summary-cell.head { font-size: 0.76rem; }
  .summary-cell.rule { font-size: 0.75rem; }
  .summary-cell.result { font-size: 0.88rem; }
}

.section-head {
  margin: 0.8rem 0 0;
  padding: 0.5rem 0.25rem 0.4rem;
  font-size: 1rem;
  font-weight: 700;
  color: #444;
  border-top: 2px dashed #d0d0d0;
  scroll-margin-top: calc(var(--sticky-h) + 1rem);
}

.rule-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 0.9rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  scroll-margin-top: calc(var(--sticky-h) + 1rem);
}
@media (max-width: 360px) {
  .rule-card { padding: 0.75rem 0.65rem; }
}
.rule-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #222;
}
.rule-formula {
  display: inline-block;
  align-self: flex-start;
  padding: 0.4rem 0.75rem;
  background: #222;
  color: #fff;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}
.rule-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #444;
  line-height: 1.55;
}
.examples {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: #f7f8fa;
  padding: 0.7rem;
  border-radius: 6px;
}
.example-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
}
.ex-base { color: #444; font-size: 0.92rem; min-width: 0; }
.ex-arrow { color: #999; font-weight: 700; }
.ex-result {
  color: #1976d2;
  font-weight: 700;
  font-size: 1rem;
}
.ex-hint {
  grid-column: 1 / -1;
  font-size: 0.82rem;
  color: #555;
  padding-left: 0.25rem;
}

.irreg-card { gap: 0.8rem; }
.irreg-grid {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: #f7f8fa;
  padding: 0.8rem;
  border-radius: 6px;
}
.irreg-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px dashed #ddd;
}
.irreg-row:last-child { border-bottom: none; }
.irreg-form { color: #666; font-size: 0.88rem; }
.irreg-result {
  color: #1976d2;
  font-weight: 700;
  font-size: 0.95rem;
}

.back-bottom-btn {
  margin-top: 1rem;
  padding: 0.9rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
.back-bottom-btn:active { background: #000; }

.to-top-btn {
  position: fixed;
  right: calc(1rem + env(safe-area-inset-right));
  bottom: calc(1.25rem + env(safe-area-inset-bottom));
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: #222;
  color: #fff;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.to-top-btn:hover { background: #000; }
.to-top-btn:active { transform: scale(0.92); }
</style>

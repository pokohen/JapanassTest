import type { ConjugationItem } from '../types/word';

const items: ConjugationItem[] = [
  // ===== 5단 동사 (godan) =====
  {
    base: '書く', reading: 'かく', meaning: '쓰다', type: 'godan',
    examples: [
      { form: 'masu', sentence: '私は毎日日記を___。', translation: '저는 매일 일기를 씁니다.' },
      { form: 'ta', sentence: '昨日、手紙を___。', translation: '어제 편지를 썼다.' },
    ],
  },
  {
    base: '聞く', reading: 'きく', meaning: '듣다', type: 'godan',
    examples: [
      { form: 'te', sentence: '音楽を___、勉強する。', translation: '음악을 듣고 공부한다.' },
    ],
  },
  {
    base: '話す', reading: 'はなす', meaning: '말하다', type: 'godan',
    examples: [
      { form: 'nai', sentence: '彼は何も___。', translation: '그는 아무 말도 하지 않는다.' },
      { form: 'masu', sentence: '先生と日本語で___。', translation: '선생님과 일본어로 이야기합니다.' },
    ],
  },
  {
    base: '読む', reading: 'よむ', meaning: '읽다', type: 'godan',
    examples: [
      { form: 'masu', sentence: '毎朝、新聞を___。', translation: '매일 아침 신문을 읽습니다.' },
      { form: 'te', sentence: '本を___、感想を書く。', translation: '책을 읽고 감상을 쓴다.' },
    ],
  },
  { base: '飲む', reading: 'のむ', meaning: '마시다', type: 'godan',
    examples: [
      { form: 'te', sentence: 'コーヒーを___、仕事をする。', translation: '커피를 마시고 일을 한다.' },
    ],
  },
  {
    base: '買う', reading: 'かう', meaning: '사다', type: 'godan',
    examples: [
      { form: 'ta', sentence: '昨日、新しい本を___。', translation: '어제 새 책을 샀다.' },
      { form: 'nai', sentence: 'お金がないから、___。', translation: '돈이 없어서 사지 않는다.' },
    ],
  },
  { base: '会う', reading: 'あう', meaning: '만나다', type: 'godan' },
  {
    base: '待つ', reading: 'まつ', meaning: '기다리다', type: 'godan',
    examples: [
      { form: 'te', sentence: 'ちょっと___ください。', translation: '잠깐 기다려 주세요.' },
    ],
  },
  { base: '持つ', reading: 'もつ', meaning: '들다, 가지다', type: 'godan' },
  { base: '泳ぐ', reading: 'およぐ', meaning: '헤엄치다', type: 'godan' },
  { base: '急ぐ', reading: 'いそぐ', meaning: '서두르다', type: 'godan' },
  {
    base: '遊ぶ', reading: 'あそぶ', meaning: '놀다', type: 'godan',
    examples: [
      { form: 'volitional', sentence: '今日は公園で___！', translation: '오늘은 공원에서 놀자!' },
    ],
  },
  { base: '呼ぶ', reading: 'よぶ', meaning: '부르다', type: 'godan' },
  { base: '死ぬ', reading: 'しぬ', meaning: '죽다', type: 'godan' },
  {
    base: '作る', reading: 'つくる', meaning: '만들다', type: 'godan',
    examples: [
      { form: 'ta', sentence: '母が夕ご飯を___。', translation: '어머니가 저녁밥을 만들었다.' },
    ],
  },
  { base: '帰る', reading: 'かえる', meaning: '돌아가다', type: 'godan' },
  { base: '走る', reading: 'はしる', meaning: '달리다', type: 'godan' },
  { base: '分かる', reading: 'わかる', meaning: '알다', type: 'godan' },
  {
    base: '行く', reading: 'いく', meaning: '가다 (예외)', type: 'godan',
    examples: [
      { form: 'volitional', sentence: '一緒に海へ___！', translation: '같이 바다에 가자!' },
      { form: 'ta', sentence: '去年、日本へ___。', translation: '작년에 일본에 갔다.' },
    ],
  },

  // ===== 1단 동사 (ichidan) =====
  {
    base: '食べる', reading: 'たべる', meaning: '먹다', type: 'ichidan',
    examples: [
      { form: 'masu', sentence: '毎朝パンを___。', translation: '매일 아침 빵을 먹습니다.' },
      { form: 'ta', sentence: '昨日ラーメンを___。', translation: '어제 라면을 먹었다.' },
      { form: 'nai', sentence: '朝ご飯を___。', translation: '아침을 먹지 않는다.' },
    ],
  },
  {
    base: '見る', reading: 'みる', meaning: '보다', type: 'ichidan',
    examples: [
      { form: 'te', sentence: '映画を___、話そう。', translation: '영화를 보고 이야기하자.' },
      { form: 'ta', sentence: '昨日テレビを___。', translation: '어제 TV를 봤다.' },
    ],
  },
  {
    base: '起きる', reading: 'おきる', meaning: '일어나다', type: 'ichidan',
    examples: [
      { form: 'potential', sentence: '明日の朝、早く___。', translation: '내일 아침 일찍 일어날 수 있다.' },
      { form: 'masu', sentence: '毎日6時に___。', translation: '매일 6시에 일어납니다.' },
    ],
  },
  {
    base: '寝る', reading: 'ねる', meaning: '자다', type: 'ichidan',
    examples: [
      { form: 'nai', sentence: '夜、なかなか___。', translation: '밤에 좀처럼 자지 못한다.' },
    ],
  },
  { base: '教える', reading: 'おしえる', meaning: '가르치다', type: 'ichidan' },
  { base: '開ける', reading: 'あける', meaning: '열다', type: 'ichidan' },
  { base: '閉める', reading: 'しめる', meaning: '닫다', type: 'ichidan' },
  { base: '着る', reading: 'きる', meaning: '입다', type: 'ichidan' },
  { base: '借りる', reading: 'かりる', meaning: '빌리다', type: 'ichidan' },
  {
    base: '覚える', reading: 'おぼえる', meaning: '외우다', type: 'ichidan',
    examples: [
      { form: 'nai', sentence: '単語が___。', translation: '단어가 외워지지 않는다.' },
    ],
  },

  // ===== 불규칙 동사 (irregular) =====
  {
    base: 'する', reading: 'する', meaning: '하다', type: 'irregular',
    examples: [
      { form: 'masu', sentence: '毎日宿題を___。', translation: '매일 숙제를 합니다.' },
      { form: 'ta', sentence: '昨日テニスを___。', translation: '어제 테니스를 했다.' },
    ],
  },
  {
    base: '来る', reading: 'くる', meaning: '오다', type: 'irregular',
    examples: [
      { form: 'masu', sentence: '友達が駅に___。', translation: '친구가 역에 옵니다.' },
      { form: 'nai', sentence: '雨の日は誰も___。', translation: '비 오는 날은 아무도 안 온다.' },
    ],
  },

  // ===== い형용사 =====
  {
    base: '高い', reading: 'たかい', meaning: '높다/비싸다', type: 'i-adj',
    examples: [
      { form: 'past', sentence: 'この本はとても___。', translation: '이 책은 매우 비쌌다.' },
      { form: 'negative', sentence: 'この店は___。', translation: '이 가게는 비싸지 않다.' },
    ],
  },
  { base: '安い', reading: 'やすい', meaning: '싸다', type: 'i-adj' },
  { base: '大きい', reading: 'おおきい', meaning: '크다', type: 'i-adj' },
  { base: '小さい', reading: 'ちいさい', meaning: '작다', type: 'i-adj' },
  {
    base: '新しい', reading: 'あたらしい', meaning: '새롭다', type: 'i-adj',
    examples: [
      { form: 'negative', sentence: 'この車は___。', translation: '이 차는 새롭지 않다.' },
    ],
  },
  { base: '古い', reading: 'ふるい', meaning: '낡다', type: 'i-adj' },
  {
    base: '楽しい', reading: 'たのしい', meaning: '즐겁다', type: 'i-adj',
    examples: [
      { form: 'past', sentence: '昨日のパーティーは___。', translation: '어제 파티는 즐거웠다.' },
    ],
  },
  {
    base: '寒い', reading: 'さむい', meaning: '춥다', type: 'i-adj',
    examples: [
      { form: 'past', sentence: '昨日はとても___。', translation: '어제는 매우 추웠다.' },
      { form: 'te', sentence: '今日は___、雪が降っている。', translation: '오늘은 춥고 눈이 내리고 있다.' },
    ],
  },
  { base: '暑い', reading: 'あつい', meaning: '덥다', type: 'i-adj' },
  {
    base: '忙しい', reading: 'いそがしい', meaning: '바쁘다', type: 'i-adj',
    examples: [
      { form: 'te', sentence: '今週は___、大変だ。', translation: '이번 주는 바빠서 힘들다.' },
    ],
  },
  { base: 'いい', reading: 'いい', meaning: '좋다 (예외)', type: 'i-adj' },

  // ===== な형용사 =====
  {
    base: 'きれい', reading: 'きれい', meaning: '예쁘다/깨끗하다', type: 'na-adj',
    examples: [
      { form: 'na-noun', sentence: 'あそこに___花がある。', translation: '저기에 예쁜 꽃이 있다.' },
      { form: 'past', sentence: 'その夜景は___。', translation: '그 야경은 예뻤습니다.' },
    ],
  },
  {
    base: '好き', reading: 'すき', meaning: '좋아하다', type: 'na-adj',
    examples: [
      { form: 'polite', sentence: '私は寿司が___。', translation: '저는 초밥을 좋아합니다.' },
      { form: 'na-noun', sentence: 'これは私の___食べ物です。', translation: '이것은 제가 좋아하는 음식입니다.' },
    ],
  },
  { base: '嫌い', reading: 'きらい', meaning: '싫어하다', type: 'na-adj' },
  {
    base: '元気', reading: 'げんき', meaning: '건강하다', type: 'na-adj',
    examples: [
      { form: 'polite', sentence: 'おばあさんはお___。', translation: '할머니는 건강하십니다.' },
      { form: 'adverb', sentence: '子供たちが___遊んでいる。', translation: '아이들이 활기차게 놀고 있다.' },
    ],
  },
  {
    base: '静か', reading: 'しずか', meaning: '조용하다', type: 'na-adj',
    examples: [
      { form: 'na-noun', sentence: '___な町に住みたい。', translation: '조용한 동네에 살고 싶다.' },
      { form: 'adverb', sentence: '図書館では___話してください。', translation: '도서관에서는 조용히 이야기해 주세요.' },
    ],
  },
  {
    base: '有名', reading: 'ゆうめい', meaning: '유명하다', type: 'na-adj',
    examples: [
      { form: 'na-noun', sentence: '彼は___な歌手だ。', translation: '그는 유명한 가수다.' },
    ],
  },
  {
    base: '便利', reading: 'べんり', meaning: '편리하다', type: 'na-adj',
    examples: [
      { form: 'polite', sentence: 'このアプリはとても___。', translation: '이 앱은 매우 편리합니다.' },
    ],
  },
  {
    base: '親切', reading: 'しんせつ', meaning: '친절하다', type: 'na-adj',
    examples: [
      { form: 'na-noun', sentence: '彼は___な人だ。', translation: '그는 친절한 사람이다.' },
    ],
  },
  { base: '簡単', reading: 'かんたん', meaning: '간단하다', type: 'na-adj' },
  { base: '上手', reading: 'じょうず', meaning: '잘하다', type: 'na-adj',
    examples: [
      { form: 'adverb', sentence: '姉は___歌を歌う。', translation: '언니는 노래를 잘 부른다.' },
    ],
  },
];

export default items;

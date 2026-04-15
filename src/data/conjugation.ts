import type { ConjugationItem } from '../types/word';

const items: ConjugationItem[] = [
  // ===== 5단 동사 (godan) =====
  { base: '書く', reading: 'かく', meaning: '쓰다', type: 'godan' },
  { base: '聞く', reading: 'きく', meaning: '듣다', type: 'godan' },
  { base: '話す', reading: 'はなす', meaning: '말하다', type: 'godan' },
  { base: '読む', reading: 'よむ', meaning: '읽다', type: 'godan' },
  { base: '飲む', reading: 'のむ', meaning: '마시다', type: 'godan' },
  { base: '買う', reading: 'かう', meaning: '사다', type: 'godan' },
  { base: '会う', reading: 'あう', meaning: '만나다', type: 'godan' },
  { base: '待つ', reading: 'まつ', meaning: '기다리다', type: 'godan' },
  { base: '持つ', reading: 'もつ', meaning: '들다, 가지다', type: 'godan' },
  { base: '泳ぐ', reading: 'およぐ', meaning: '헤엄치다', type: 'godan' },
  { base: '急ぐ', reading: 'いそぐ', meaning: '서두르다', type: 'godan' },
  { base: '遊ぶ', reading: 'あそぶ', meaning: '놀다', type: 'godan' },
  { base: '呼ぶ', reading: 'よぶ', meaning: '부르다', type: 'godan' },
  { base: '死ぬ', reading: 'しぬ', meaning: '죽다', type: 'godan' },
  { base: '作る', reading: 'つくる', meaning: '만들다', type: 'godan' },
  { base: '帰る', reading: 'かえる', meaning: '돌아가다', type: 'godan' },
  { base: '走る', reading: 'はしる', meaning: '달리다', type: 'godan' },
  { base: '分かる', reading: 'わかる', meaning: '알다', type: 'godan' },
  { base: '行く', reading: 'いく', meaning: '가다 (예외)', type: 'godan' },

  // ===== 1단 동사 (ichidan) =====
  { base: '食べる', reading: 'たべる', meaning: '먹다', type: 'ichidan' },
  { base: '見る', reading: 'みる', meaning: '보다', type: 'ichidan' },
  { base: '起きる', reading: 'おきる', meaning: '일어나다', type: 'ichidan' },
  { base: '寝る', reading: 'ねる', meaning: '자다', type: 'ichidan' },
  { base: '教える', reading: 'おしえる', meaning: '가르치다', type: 'ichidan' },
  { base: '開ける', reading: 'あける', meaning: '열다', type: 'ichidan' },
  { base: '閉める', reading: 'しめる', meaning: '닫다', type: 'ichidan' },
  { base: '着る', reading: 'きる', meaning: '입다', type: 'ichidan' },
  { base: '借りる', reading: 'かりる', meaning: '빌리다', type: 'ichidan' },
  { base: '覚える', reading: 'おぼえる', meaning: '외우다', type: 'ichidan' },

  // ===== 불규칙 동사 (irregular) =====
  { base: 'する', reading: 'する', meaning: '하다', type: 'irregular' },
  { base: '来る', reading: 'くる', meaning: '오다', type: 'irregular' },

  // ===== い형용사 =====
  { base: '高い', reading: 'たかい', meaning: '높다/비싸다', type: 'i-adj' },
  { base: '安い', reading: 'やすい', meaning: '싸다', type: 'i-adj' },
  { base: '大きい', reading: 'おおきい', meaning: '크다', type: 'i-adj' },
  { base: '小さい', reading: 'ちいさい', meaning: '작다', type: 'i-adj' },
  { base: '新しい', reading: 'あたらしい', meaning: '새롭다', type: 'i-adj' },
  { base: '古い', reading: 'ふるい', meaning: '낡다', type: 'i-adj' },
  { base: '楽しい', reading: 'たのしい', meaning: '즐겁다', type: 'i-adj' },
  { base: '寒い', reading: 'さむい', meaning: '춥다', type: 'i-adj' },
  { base: '暑い', reading: 'あつい', meaning: '덥다', type: 'i-adj' },
  { base: '忙しい', reading: 'いそがしい', meaning: '바쁘다', type: 'i-adj' },
  { base: 'いい', reading: 'いい', meaning: '좋다 (예외)', type: 'i-adj' },
];

export default items;

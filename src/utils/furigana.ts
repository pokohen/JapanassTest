import type { ConjugationItem, ConjForm } from '../types/word';

export interface RubySegment {
  text: string;
  rt?: string;
}

function isKanjiChar(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}

/**
 * (base, reading) 쌍에서 각 한자 블록과 그 읽기를 추출.
 * 예: ('書く', 'かく') → [{ kanji: '書', hira: 'か' }]
 * 예: ('大丈夫', 'だいじょうぶ') → [{ kanji: '大丈夫', hira: 'だいじょうぶ' }]
 * 예: ('忙しい', 'いそがしい') → [{ kanji: '忙', hira: 'いそが' }]
 */
export function extractKanjiReadings(
  base: string,
  reading: string,
): Array<{ kanji: string; hira: string }> {
  const result: Array<{ kanji: string; hira: string }> = [];
  let i = 0;
  let j = 0;

  while (i < base.length) {
    if (!isKanjiChar(base[i])) {
      j += 1;
      i += 1;
      continue;
    }
    let end = i;
    while (end < base.length && isKanjiChar(base[end])) end++;
    const kanjiBlock = base.slice(i, end);

    let nextHiraEnd = end;
    while (nextHiraEnd < base.length && !isKanjiChar(base[nextHiraEnd])) nextHiraEnd++;
    const nextHira = base.slice(end, nextHiraEnd);

    if (nextHira.length === 0) {
      result.push({ kanji: kanjiBlock, hira: reading.slice(j) });
      j = reading.length;
    } else {
      const matchIdx = reading.indexOf(nextHira, j);
      if (matchIdx === -1) {
        result.push({ kanji: kanjiBlock, hira: '' });
      } else {
        result.push({ kanji: kanjiBlock, hira: reading.slice(j, matchIdx) });
        j = matchIdx;
      }
    }
    i = end;
  }

  return result;
}

/**
 * 불규칙 동사 来る는 형태에 따라 한자 읽기가 달라짐.
 * 형태별 読み 매핑.
 */
const IRREGULAR_KURU_READINGS: Record<string, string> = {
  base: 'く',
  masu: 'き',
  te: 'き',
  ta: 'き',
  nai: 'こ',
  potential: 'こ',
  volitional: 'こ',
};

/**
 * 아이템과 선택적 form으로부터 한자 읽기 매핑을 얻는다.
 * 불규칙 来る는 form에 따라 다르게 처리.
 */
export function getReadingsForForm(
  item: ConjugationItem,
  form?: ConjForm,
): Array<{ kanji: string; hira: string }> {
  if (item.type === 'irregular' && item.base === '来る') {
    const key = form ?? 'base';
    const hira = IRREGULAR_KURU_READINGS[key] ?? 'く';
    return [{ kanji: '来', hira }];
  }
  return extractKanjiReadings(item.base, item.reading);
}

/**
 * 임의의 문자열을 루비 세그먼트로 쪼갠다.
 * kanji 블록을 만나면 readings 목록에서 찾아 rt를 붙인다.
 */
export function toRubySegments(
  text: string,
  readings: Array<{ kanji: string; hira: string }>,
): RubySegment[] {
  const map = new Map<string, string>();
  for (const r of readings) {
    if (r.hira) map.set(r.kanji, r.hira);
  }

  const segments: RubySegment[] = [];
  let i = 0;
  while (i < text.length) {
    if (!isKanjiChar(text[i])) {
      let end = i;
      while (end < text.length && !isKanjiChar(text[end])) end++;
      segments.push({ text: text.slice(i, end) });
      i = end;
      continue;
    }
    let end = i;
    while (end < text.length && isKanjiChar(text[end])) end++;
    const kanjiBlock = text.slice(i, end);
    segments.push({ text: kanjiBlock, rt: map.get(kanjiBlock) });
    i = end;
  }
  return segments;
}

/**
 * 활용 아이템과 폼, 그리고 표시할 텍스트(활용된 형태)를 받아서 루비 세그먼트로 변환.
 */
export function rubyForItemForm(
  item: ConjugationItem,
  form: ConjForm | undefined,
  text: string,
): RubySegment[] {
  const readings = getReadingsForForm(item, form);
  return toRubySegments(text, readings);
}

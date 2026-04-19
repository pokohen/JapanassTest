import type {
  ConjugationItem,
  ConjForm,
  VerbForm,
  AdjForm,
} from '../types/word';

const uToI: Record<string, string> = {
  'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち',
  'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': 'り',
};
const uToA: Record<string, string> = {
  'う': 'わ', 'く': 'か', 'ぐ': 'が', 'す': 'さ', 'つ': 'た',
  'ぬ': 'な', 'ぶ': 'ば', 'む': 'ま', 'る': 'ら',
};
const uToE: Record<string, string> = {
  'う': 'え', 'く': 'け', 'ぐ': 'げ', 'す': 'せ', 'つ': 'て',
  'ぬ': 'ね', 'ぶ': 'べ', 'む': 'め', 'る': 'れ',
};
const uToO: Record<string, string> = {
  'う': 'お', 'く': 'こ', 'ぐ': 'ご', 'す': 'そ', 'つ': 'と',
  'ぬ': 'の', 'ぶ': 'ぼ', 'む': 'も', 'る': 'ろ',
};

function godanTeSuffix(last: string): string {
  switch (last) {
    case 'う': case 'つ': case 'る': return 'って';
    case 'ぬ': case 'ぶ': case 'む': return 'んで';
    case 'く': return 'いて';
    case 'ぐ': return 'いで';
    case 'す': return 'して';
  }
  return 'て';
}

function teToTa(te: string): string {
  if (te.endsWith('て')) return te.slice(0, -1) + 'た';
  if (te.endsWith('で')) return te.slice(0, -1) + 'だ';
  return te;
}

const irregularVerbs: Record<string, Record<VerbForm, string>> = {
  'する': {
    masu: 'します', te: 'して', ta: 'した',
    nai: 'しない', potential: 'できる', volitional: 'しよう',
  },
  '来る': {
    masu: '来ます', te: '来て', ta: '来た',
    nai: '来ない', potential: '来られる', volitional: '来よう',
  },
};

export function conjugateVerb(item: ConjugationItem, form: VerbForm): string {
  const base = item.base;
  if (item.type === 'irregular' && irregularVerbs[base]) {
    return irregularVerbs[base][form];
  }
  if (base === '行く') {
    if (form === 'te') return '行って';
    if (form === 'ta') return '行った';
  }
  const last = base.slice(-1);
  const stem = base.slice(0, -1);
  if (item.type === 'godan') {
    switch (form) {
      case 'masu': return stem + uToI[last] + 'ます';
      case 'te': return stem + godanTeSuffix(last);
      case 'ta': return teToTa(stem + godanTeSuffix(last));
      case 'nai': return stem + uToA[last] + 'ない';
      case 'potential': return stem + uToE[last] + 'る';
      case 'volitional': return stem + uToO[last] + 'う';
    }
  }
  if (item.type === 'ichidan') {
    switch (form) {
      case 'masu': return stem + 'ます';
      case 'te': return stem + 'て';
      case 'ta': return stem + 'た';
      case 'nai': return stem + 'ない';
      case 'potential': return stem + 'られる';
      case 'volitional': return stem + 'よう';
    }
  }
  return base;
}

export function conjugateAdj(item: ConjugationItem, form: AdjForm): string {
  const base = item.base;
  if (item.type === 'na-adj') {
    switch (form) {
      case 'na-noun': return base + 'な';
      case 'polite': return base + 'です';
      case 'past': return base + 'でした';
      case 'negative': return base + 'じゃない';
      case 'adverb': return base + 'に';
      case 'te': return base + 'で';
    }
    return base;
  }
  if (base === 'いい') {
    switch (form) {
      case 'past': return 'よかった';
      case 'negative': return 'よくない';
      case 'adverb': return 'よく';
      case 'te': return 'よくて';
    }
  }
  const stem = base.slice(0, -1);
  switch (form) {
    case 'past': return stem + 'かった';
    case 'negative': return stem + 'くない';
    case 'adverb': return stem + 'く';
    case 'te': return stem + 'くて';
  }
  return base;
}

export function conjugate(item: ConjugationItem, form: ConjForm): string {
  if (item.type === 'i-adj' || item.type === 'na-adj') {
    return conjugateAdj(item, form as AdjForm);
  }
  return conjugateVerb(item, form as VerbForm);
}

/** 시험 지시문용: 어미를 공개하지 않아 정답이 노출되지 않음 */
export function formLabel(item: ConjugationItem, form: ConjForm): string {
  if (item.type === 'na-adj') {
    switch (form) {
      case 'na-noun': return '명사 수식형';
      case 'polite': return '정중형';
      case 'past': return '과거형';
      case 'negative': return '부정형';
      case 'adverb': return '부사형';
      case 'te': return 'て형 (연결)';
    }
  }
  if (item.type === 'i-adj') {
    switch (form) {
      case 'past': return '과거형';
      case 'negative': return '부정형';
      case 'adverb': return '부사형';
      case 'te': return 'て형 (연결)';
    }
  }
  switch (form) {
    case 'masu': return 'ます형';
    case 'te': return 'て형';
    case 'ta': return 'た형 (과거)';
    case 'nai': return 'ない형 (부정)';
    case 'potential': return '가능형';
    case 'volitional': return '의지형';
  }
  return '';
}

/** 공부·결과 페이지용: 어미까지 표시해 학습에 도움 */
export function formLabelFull(item: ConjugationItem, form: ConjForm): string {
  if (item.type === 'na-adj') {
    switch (form) {
      case 'na-noun': return '명사 수식형 (+な)';
      case 'polite': return '정중형 (~です)';
      case 'past': return '과거형 (~でした)';
      case 'negative': return '부정형 (~じゃない)';
      case 'adverb': return '부사형 (~に)';
      case 'te': return 'て형 (~で)';
    }
  }
  if (item.type === 'i-adj') {
    switch (form) {
      case 'past': return '과거형 (~かった)';
      case 'negative': return '부정형 (~くない)';
      case 'adverb': return '부사형 (~く)';
      case 'te': return 'て형 (~くて)';
    }
  }
  return formLabel(item, form);
}

export function availableForms(item: ConjugationItem): ConjForm[] {
  if (item.type === 'na-adj') {
    return ['na-noun', 'polite', 'past', 'negative', 'adverb', 'te'];
  }
  if (item.type === 'i-adj') return ['past', 'negative', 'adverb', 'te'];
  return ['masu', 'te', 'ta', 'nai', 'potential', 'volitional'];
}

export function generateDistractors(
  item: ConjugationItem,
  correct: string,
): string[] {
  const candidates = new Set<string>();
  const base = item.base;
  const stem = base.slice(0, -1);

  if (item.type === 'na-adj') {
    const iMixStem = base.endsWith('い') ? base.slice(0, -1) : base;
    [
      base + 'な',
      base + 'です',
      base + 'でした',
      base + 'だった',
      base + 'じゃない',
      base + 'ではない',
      base + 'に',
      base + 'で',
      // i-adj 규칙 잘못 적용
      iMixStem + 'かった',
      iMixStem + 'くない',
      iMixStem + 'く',
      iMixStem + 'くて',
      // 명사 수식 잘못 적용
      base + 'の',
    ].forEach((c) => candidates.add(c));
  } else if (item.type === 'i-adj') {
    const iStem = base === 'いい' ? 'よ' : stem;
    [
      iStem + 'かった',
      iStem + 'くない',
      iStem + 'く',
      iStem + 'くて',
      base + 'だった',
      base + 'じゃない',
      base + 'です',
      base + 'でした',
      stem + 'った',
      stem + 'くた',
      stem + 'いかった',
      stem + 'かた',
    ].forEach((c) => candidates.add(c));
  } else {
    const last = base.slice(-1);
    const iRow = uToI[last] ?? '';
    const aRow = uToA[last] ?? '';
    const eRow = uToE[last] ?? '';
    const oRow = uToO[last] ?? '';
    // godan-style forms
    if (iRow) candidates.add(stem + iRow + 'ます');
    if (last) candidates.add(stem + godanTeSuffix(last));
    if (last) candidates.add(teToTa(stem + godanTeSuffix(last)));
    if (aRow) candidates.add(stem + aRow + 'ない');
    if (eRow) candidates.add(stem + eRow + 'る');
    if (oRow) candidates.add(stem + oRow + 'う');
    // ichidan-style forms (drop last char)
    candidates.add(stem + 'ます');
    candidates.add(stem + 'て');
    candidates.add(stem + 'た');
    candidates.add(stem + 'ない');
    candidates.add(stem + 'られる');
    candidates.add(stem + 'よう');
    // alternate te/ta suffixes (mixing wrong godan rules)
    ['って', 'んで', 'いて', 'いで', 'して'].forEach((suf) => {
      candidates.add(stem + suf);
      candidates.add(teToTa(stem + suf));
    });
  }

  candidates.delete(correct);
  const arr = Array.from(candidates).filter((c) => c && c !== base);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

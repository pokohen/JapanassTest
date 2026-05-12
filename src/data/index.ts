import type {
  Word,
  ConjugationItem,
  ParticleItem,
  GrammarItem,
  ReadingPassage,
} from "../types/word";
import week1 from "./1week";
import week2 from "./2week";
import week3 from "./3week";
import week4 from "./4week";
import week5 from "./5week";
import week6 from "./6week";
import conjugationItems from "./conjugation";
import particleItems from "./particles";
import grammarItems from "./grammar";
import readingPassages from "./reading";
// 새로운 주차를 추가할 때 아래에 import를 추가하세요

const weekMap: Record<number, Word[]> = {
  1: week1,
  2: week2,
  3: week3,
  4: week4,
  5: week5,
  6: week6,
};

export function getLatestWeekNumber(): number {
  return Math.max(...Object.keys(weekMap).map(Number));
}

export function getNewWords(): Word[] {
  const words = weekMap[getLatestWeekNumber()] ?? [];
  const seen = new Set<string>();
  return words.filter((w) => {
    const key = `${w.kanji}|${w.reading}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getReviewWords(): Word[] {
  const latest = getLatestWeekNumber();
  const newWordKeys = new Set(
    (weekMap[latest] ?? []).map((w) => `${w.kanji}|${w.reading}`),
  );
  const seen = new Set<string>();
  const result: Word[] = [];
  for (const [weekNum, words] of Object.entries(weekMap)) {
    if (Number(weekNum) >= latest) continue;
    for (const w of words) {
      const key = `${w.kanji}|${w.reading}`;
      if (newWordKeys.has(key) || seen.has(key)) continue;
      seen.add(key);
      result.push(w);
    }
  }
  return result;
}

export function getTotalWeekCount(): number {
  return Object.keys(weekMap).length;
}

export function getConjugationItems(): ConjugationItem[] {
  return conjugationItems;
}

export function getParticleItems(): ParticleItem[] {
  return particleItems;
}

export function getGrammarItems(): GrammarItem[] {
  return grammarItems;
}

export function getReadingPassages(): ReadingPassage[] {
  return readingPassages;
}

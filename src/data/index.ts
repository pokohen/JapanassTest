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
};

export function getLatestWeekNumber(): number {
  return Math.max(...Object.keys(weekMap).map(Number));
}

export function getNewWords(): Word[] {
  return weekMap[getLatestWeekNumber()] ?? [];
}

export function getReviewWords(): Word[] {
  const latest = getLatestWeekNumber();
  return Object.entries(weekMap)
    .filter(([weekNum]) => Number(weekNum) < latest)
    .flatMap(([, words]) => words);
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

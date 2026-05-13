import type {
  Word,
  ConjugationItem,
  ParticleItem,
  GrammarItem,
  ReadingPassage,
} from "../types/word";
import words from "./words";
import conjugationItems from "./conjugation";
import particleItems from "./particles";
import grammarItems from "./grammar";
import readingPassages from "./reading";

export function getWords(): Word[] {
  const seen = new Set<string>();
  return words.filter((w) => {
    const key = `${w.kanji}|${w.reading}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getTotalWordCount(): number {
  return getWords().length;
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

import type { Word } from '../types/word';
import { shuffle } from './shuffle';

export function generateReadingChoices(
  correctWord: Word,
  allWords: Word[],
  choiceCount = 4,
): string[] {
  const others = allWords
    .filter((w) => w.reading !== correctWord.reading)
    .map((w) => w.reading);
  const uniqueOthers = [...new Set(others)];
  const wrongChoices = shuffle(uniqueOthers).slice(0, choiceCount - 1);
  return shuffle([correctWord.reading, ...wrongChoices]);
}

export function generateMeaningChoices(
  correctWord: Word,
  allWords: Word[],
  choiceCount = 4,
): string[] {
  const others = allWords
    .filter((w) => w.meaning !== correctWord.meaning)
    .map((w) => w.meaning);
  const uniqueOthers = [...new Set(others)];
  const wrongChoices = shuffle(uniqueOthers).slice(0, choiceCount - 1);
  return shuffle([correctWord.meaning, ...wrongChoices]);
}

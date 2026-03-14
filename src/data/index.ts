import type { Word } from '../types/word';
import week1 from './1week';
// 새로운 주차를 추가할 때 아래에 import를 추가하세요
// import week2 from './2week';

const weekMap: Record<number, Word[]> = {
  1: week1,
  // 2: week2,
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

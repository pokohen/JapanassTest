# 日本語 単語テスト (일본어 단어 시험)

한자를 보고 **읽는 방법(히라가나)**과 **뜻(한국어)**을 맞추는 4지선다 시험 사이트입니다.

## 기술 스택

- **Vite 5** + **Vue 3** + **TypeScript**
- SFC `<script setup>` 방식
- 별도 라이브러리 없이 순수 Vue Composable로 상태 관리

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 시험 규칙

| 항목 | 내용 |
|------|------|
| 총 문제 수 | 30문제 |
| 제한 시간 | 30분 |
| 출제 형식 | 4지선다 (읽기 + 뜻, 문제당 2개 선택) |
| 새 단어 | 최신 주차에서 **20문제** |
| 복습 단어 | 이전 주차에서 **10문제** |
| 복습 없을 때 | 새 단어에서 **30문제** |

## 프로젝트 구조

```
src/
├── types/
│   └── word.ts              # Word, QuizQuestion, QuizResult 타입
├── data/
│   ├── index.ts             # 주차 데이터 레지스트리 & 새 단어/복습 분리
│   └── 1week.ts             # 1주차 단어 (예시)
├── composables/
│   ├── useQuiz.ts           # 퀴즈 상태 관리, 문제 선정, 채점
│   └── useTimer.ts          # 30분 카운트다운 타이머
├── components/
│   ├── QuizStart.vue        # 시작 화면 (시험 정보)
│   ├── QuizQuestion.vue     # 문제 화면 (한자 → 읽기/뜻 선택)
│   ├── QuizProgress.vue     # 진행률 바
│   ├── QuizResults.vue      # 결과 화면 (점수 + 오답 상세)
│   └── TimerDisplay.vue     # 타이머 (경고 색상 변화)
├── utils/
│   ├── shuffle.ts           # Fisher-Yates 셔플
│   └── choiceGenerator.ts   # 4지선다 보기 생성
├── styles/
│   └── main.css             # 글로벌 스타일
├── App.vue
└── main.ts
```

## 새 주차 추가 방법

### 1단계: 단어 파일 생성

`src/data/2week.ts` (파일명 형식: `{숫자}week.ts`)

```typescript
import type { Word } from '../types/word';

const words: Word[] = [
  { kanji: '学校', reading: 'がっこう', meaning: '학교' },
  { kanji: '先生', reading: 'せんせい', meaning: '선생님' },
  // ... 최소 25개 이상 권장
];

export default words;
```

### 2단계: 레지스트리에 등록

`src/data/index.ts`를 열고:

```typescript
import week1 from './1week';
import week2 from './2week';  // 추가

const weekMap: Record<number, Word[]> = {
  1: week1,
  2: week2,  // 추가
};
```

이렇게 하면 자동으로:
- **2week**이 새 단어(20문제)로 출제
- **1week**이 복습 단어(10문제)로 출제

## 단어 데이터 형식

```typescript
interface Word {
  kanji: string;    // 한자 표기 (시험에 표시됨)
  reading: string;  // 히라가나 읽기 (정답)
  meaning: string;  // 한국어 뜻 (정답)
}
```

## 시험 흐름

```
시작 화면 → 문제 풀기 (30문제) → 결과 화면
              ↓ 30분 초과 시
           자동 제출 → 결과 화면
```

1. **시작 화면**: 시험 범위, 문제 수, 구성 정보 확인 후 시작
2. **문제 화면**: 한자가 크게 표시되고, 읽기 4개 + 뜻 4개 중 각 1개 선택
3. **결과 화면**: 총점, 읽기/뜻 정답률, 새 단어/복습 점수, 문제별 상세 결과

## 문서

- [백엔드 확장 계획](docs/BACKEND_PLAN.md) — 사용자 인증, 성적 저장, 랭킹 등 백엔드 추가 시 참고

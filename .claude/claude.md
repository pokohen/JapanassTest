# 프로젝트 룰

## 단어 데이터 추가/수정 룰

단어 데이터는 `src/data/words.ts` 단일 파일로 관리한다. 추가·수정 시 반드시 따를 것.

### 1. 중복 단어 금지 (kanji + reading 기준)

새 단어를 추가하기 전에 `src/data/words.ts`를 확인해서, `kanji`와 `reading`이 모두 동일한 단어가 이미 존재하면 추가하지 않는다.

- 비교 키: `${kanji}|${reading}` (예: `仕事|しごと`)
- `meaning`이 살짝 달라도(예: "일" vs "일, 직업") 같은 단어로 간주.
- `kanji`만 같고 `reading`이 다르면 별개 단어 (예: `開く|あく` vs `開く|ひらく`는 둘 다 허용).
- `reading`만 같고 `kanji`가 다르면 별개 단어 (예: `空く|あく` vs `開く|あく`도 둘 다 허용).

### 2. 중복 발견 시 처리

사용자가 추가하려는 단어가 이미 있으면:
1. 사용자에게 "X(읽기)는 이미 words.ts에 있습니다. 추가하지 않겠습니다"라고 알린다.
2. 만약 사용자가 의미·예문을 개선한 버전이라면, 기존 entry를 덮어쓸지 사용자에게 묻는다.

### 3. 추가 전 체크 절차

단어 추가 작업을 시작할 때:
1. 추가하려는 단어 리스트의 `kanji`+`reading` 키를 먼저 모은다.
2. `src/data/words.ts`의 기존 단어들을 스캔해서 중복 키를 식별한다.
3. 중복은 제외하고 나머지만 추가한다.
4. 작업 후 다음 명령으로 재검증:
   ```bash
   grep "kanji:" src/data/words.ts | sort | uniq -d
   ```
   결과가 비어있어야 함 (intentional 케이스 제외).

### 4. 의도된 중복 화이트리스트

다음 케이스는 의도적으로 같은 kanji 허용 (다른 reading):
- `開く(あく)` ↔ `開く(ひらく)` — 서로 다른 동사

이 외에 같은 `kanji`가 여러 entry에 등장하면 반드시 사용자 확인 필요.

### 5. 데이터 구조 및 예문 작성

각 단어는 다음 형식으로 작성:
```ts
{
  kanji: "...",
  reading: "...",
  meaning: "...",      // 한국어
  example: "...",       // N4 수준 일본어 예문
  example_reading: "{한자|읽기}로 후리가나 표기",
}
```

- 예문은 **N4 수준**으로 자연스럽게.
- `example_reading`에서 한자에는 `{한자|읽기}` 형식으로 후리가나를 모두 달 것.

### 6. 관련 코드

- 데이터 로딩: `src/data/index.ts` — `getWords()`가 중복 방어 후 반환.
- 선택지 생성: `src/utils/choiceGenerator.ts` — 같은 kanji의 다른 reading/meaning은 distractor에서 제외.
- 퀴즈 로직: `src/composables/useQuiz.ts` — `getWords()`에서 80개 랜덤 픽 (단일 모드).

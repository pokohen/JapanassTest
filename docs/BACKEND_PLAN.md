# 백엔드 확장 계획

현재 프로젝트는 프론트엔드만으로 동작하지만, 아래 기능이 필요할 경우 백엔드를 추가할 수 있습니다.

## 추천 백엔드 스택

- **Firebase** (Auth + Firestore) 또는 **Supabase** — 별도 서버 운영 없이 빠르게 구축 가능
- **Express + SQLite/PostgreSQL** — 자체 서버가 필요한 경우

## 백엔드가 필요한 기능

### 1. 사용자 인증
- Google/카카오 소셜 로그인
- 개인별 시험 이력 관리

### 2. 성적 저장
- 시험 결과를 DB에 저장 (날짜, 점수, 소요 시간, 오답 목록)
- 주차별 성적 추이 그래프

### 3. 오답 노트 / 스페이스드 리피티션
- 자주 틀리는 단어에 가중치를 부여
- 복습 단어 선정 시 틀린 횟수 기반으로 우선 출제

### 4. 관리자 기능
- 웹 UI로 주차별 단어 등록/수정 (코드 배포 없이)
- 단어 CSV 업로드

### 5. 랭킹 / 리더보드
- 주차별 최고 점수 랭킹
- 전체 누적 랭킹

### 6. 분석 대시보드
- 전체 사용자 기준 오답률 높은 단어 통계
- 평균 점수, 평균 소요 시간

### 7. 발음 오디오
- 단어별 TTS 오디오 파일 제공 (Google TTS API 등 활용)

## API 엔드포인트 설계 (예시)

```
POST   /api/auth/login          — 로그인
GET    /api/words/:weekNumber    — 주차별 단어 조회
POST   /api/quiz/submit          — 시험 결과 제출
GET    /api/quiz/history         — 내 시험 이력
GET    /api/ranking/:weekNumber  — 주차별 랭킹
POST   /api/admin/words          — 단어 등록 (관리자)
```

## 현재 프론트엔드에서 백엔드 연동 시 변경 포인트

- `src/data/index.ts` — API에서 단어 데이터를 fetch하도록 변경
- `src/composables/useQuiz.ts` — 시험 완료 시 결과를 API로 POST
- 새로운 composable: `useAuth.ts`, `useHistory.ts` 추가

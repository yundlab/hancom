# 🎫 Culture Log — 문화생활 관람 기록장

영화·콘서트·페스티벌·연극/뮤지컬·스포츠 관람 기록을 남기고, 통계와 캘린더로 돌아보는 React 미니 프로젝트입니다.

## 주요 기능

- **기록 목록** — 카테고리 / 연도 / 월 필터, 최신순·별점순 정렬
- **상세 보기** — 포스터, 별점, 결제 정보, 한줄평/감상, 수정·삭제
- **기록 추가 / 수정** — 포스터 이미지 업로드(파일 → 미리보기), 관람 전 기록은 D-day 표시
- **통계** — 관람수 / 평균 별점 / 총 지출 × 카테고리·연도·월 기준 막대그래프
- **캘린더** — 월간 달력에 관람한 날짜별 포스터 썸네일
- **인트로** — 첫 진입 시 티켓 로고가 그려지는 스플래시 애니메이션
- **저장** — `localStorage`에 저장되어 새로고침해도 기록 유지

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run lint     # oxlint 검사
```

## 기술 스택

- **React 19** + **Vite** — SPA / 빠른 개발 서버
- **React Router** — 페이지 라우팅
- **Pretendard** (npm 번들) — 한글 폰트, 오프라인 동작
- **oxlint** — 린트
- 디자인 토큰(`src/index.css`의 `:root`)으로 색·여백·타이포를 한 곳에서 관리

## 폴더 구조

```
src/
├─ App.jsx              # 라우팅 + 기록 상태(추가/수정/삭제) + localStorage 저장
├─ main.jsx             # 진입점
├─ data/records.js      # 목 데이터 + 카테고리/결제수단 + D-day 유틸
├─ components/          # Splash, RecordCard, RecordForm, Poster, StarRating,
│                       #   CategoryBadge, FilterBar, BarChart
└─ pages/               # Home, Detail, New, Edit, Stats, Calendar
```

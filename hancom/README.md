# hancom — HTML 프론트엔드 학습 기록

**한컴 AI를 활용한 프론트엔드 개발자** 과정의 실습 코드 및 학습 자료 저장소입니다.

- GitHub: https://github.com/yundlab/hancom
- Blog: https://yundlab.tistory.com/

---

## 폴더 구조

```
hancom/
├── 01_vscode/      # VSCode 개발환경 설정
└── 02_html/        # HTML 강의 실습 파일 (03 ~ 34번)
```

---

## 01_vscode — 개발환경

| 파일 | 내용 |
|---|---|
| `01_README.md` | VSCode 공식 다운로드 링크 |
| `02_README.md` | 웹 개발 필수 확장 프로그램 목록 |

**주요 확장 프로그램**
- **Live Server** — 저장 시 브라우저 자동 새로고침
- **Prettier** — 코드 자동 정렬
- **ESLint** — JS 오류 실시간 감지
- **Auto Rename Tag** — HTML 태그 쌍 자동 수정
- **GitLens** — Git 히스토리 시각화

---

## 02_html — HTML 실습

> HTML · CSS · JS 세 가지가 모여 웹 페이지를 구성합니다.
> HTML(뼈대) → CSS(꾸미기) → JS(동작)

### 강의 흐름

| 번호 | 주요 내용 |
|---|---|
| 03 | 첫 HTML 페이지 — `h1~h3`, `a` 태그, DOCTYPE 선언 |
| 04 ~ 06 | 텍스트 태그 — `p`, `strong`, `em`, `br`, `hr` 등 |
| 07 ~ 09 | 링크 · 이미지 — `a href`, `img src`, `target="_blank"` |
| 10 | 목록 · 시맨틱 — `ul/ol/li`, `header`, `main`, `footer` |
| 11 | **실습: 자기소개 웹사이트** — 배운 태그 총 활용 |
| 12 ~ 15 | 테이블 — `table`, `thead`, `tbody`, `th`, `td` |
| 16 ~ 19 | 폼 기초 — `form`, `input`, `label`, `button` |
| 20 ~ 23 | 폼 심화 — `select`, `textarea`, `checkbox`, `radio` |
| 24 ~ 27 | 멀티미디어 — `img`, `audio`, `video`, `iframe` |
| 28 | 과제: 실습 코드 GitHub 업로드 + 블로그 글 작성 |
| 29 ~ 31 | 시맨틱 태그 심화 — `section`, `article`, `nav`, `aside` |
| 32 | 개발자도구(F12) 사용법 |
| 33 | 회원가입 폼 페이지 — `aria-label`, `fieldset`, `method="post"` |
| 34 | **미니 프로젝트: 이력서 웹사이트** |

---

### 주요 README

| 파일 | 내용 |
|---|---|
| `11_README.md` | 자기소개 웹사이트 실습 + GitHub·블로그 과제 안내 |
| `28_README.md` | 실습 코드 GitHub 업로드 + 블로그 글 작성 과제 |
| `32_README.md` | 개발자도구(F12) 꿀팁 정리 |
| `33_README.md` | Claude Code 설치 방법 (Windows) |
| `깃허브_README.md` | GitHub 저장소 링크 |
| `블로그_README.md` | 블로그 링크 |

---

### 미니 프로젝트 — 이력서 웹사이트 (`34_index.html`)

지금까지 배운 HTML 태그를 모두 활용해 만든 개인 이력서 페이지입니다.

**포함 내용**
- 자기소개 및 프로필 이미지
- 연락처 (전화, 이메일, GitHub, 블로그)
- 교육 / 자격증 / 기술스택 (테이블)
- 경력 사항
- 자기소개서
- 포트폴리오 (todam, travel-tick) — 동영상 포함

**사용 태그**
`header` `nav` `main` `section` `article` `footer`
`h1~h5` `p` `ul` `ol` `dl` `table` `form` `input` `video` `img` `a` `strong` `mark` `small` `hr`

---

## 학습 도구

| 도구 | 용도 |
|---|---|
| VSCode + Live Server | 코드 작성 및 실시간 미리보기 |
| 개발자도구 (F12) | HTML 구조 확인, 에러 디버깅, 디자인 미리보기 |
| Claude Code | AI 코드 어시스턴트 |
| GitHub | 코드 버전 관리 및 백업 |

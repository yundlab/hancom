# Chatbot

Groq API와 LLaMA 모델을 사용한 챗봇 웹 애플리케이션입니다.

## 기술 스택

- **Backend**: Node.js, Express
- **AI**: Groq API (llama-3.1-8b-instant)
- **Deploy**: Vercel

## 로컬 실행

```bash
# 패키지 설치
npm install

# .env 파일 생성
echo "GROQ_API_KEY=your_api_key_here" > .env

# 서버 실행
node index.js
```

http://localhost:3000 에서 확인

## 환경변수

| 변수명 | 설명 |
|--------|------|
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com)에서 발급 |

## 배포 (Vercel)

```bash
vercel deploy
```

Vercel 환경변수에 `GROQ_API_KEY` 설정 필요

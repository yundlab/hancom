import { useEffect, useState } from 'react'

// 사이트에 처음 들어올 때 잠깐 뜨는 인트로 화면.
// - 티켓 아이콘이 선을 그리듯 그려지고
// - "Culture Log" 글자가 한 글자씩 크게 나타났다가
// - 전체가 페이드아웃되며 사라진다.
function Splash({ onFinish }) {
  const [leaving, setLeaving] = useState(false) // 페이드아웃 시작 여부
  const text = 'Culture Log'

  useEffect(() => {
    // 3초 뒤 페이드아웃 시작 → 0.6초 후 완전히 제거
    const fadeTimer = setTimeout(() => setLeaving(true), 3000)
    const doneTimer = setTimeout(() => onFinish(), 3600)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onFinish])

  return (
    <div className={`splash ${leaving ? 'splash--leaving' : ''}`}>
      {/* 티켓 아이콘.
          - fill 용 path: 헤더 로고와 동일한 전체 모양(오른쪽 채움 + 왼쪽 프레임)
          - line 용 path: 바깥 실루엣만 → 그려질 때 좌우 선 두께가 균일하다 */}
      <svg className="splash-ticket" viewBox="0 0 24 24" aria-hidden="true">
        <path
          className="splash-ticket-fill"
          d="M4 5h16a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5V7a2 2 0 0 1 2-2zm11 1H4a1 1 0 0 0-1 1v1.76a3.5 3.5 0 0 1 0 6.48V17a1 1 0 0 0 1 1h11V6z"
        />
        <path
          className="splash-ticket-line"
          pathLength="1"
          d="M4 5h16a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5V7a2 2 0 0 1 2-2z"
        />
      </svg>

      {/* 글자를 한 글자씩 순서대로 등장시킨다 (공백도 폭 유지) */}
      <h1 className="splash-title" aria-label={text}>
        {text.split('').map((ch, i) => (
          <span
            key={i}
            className="splash-char"
            style={{ animationDelay: `${1.1 + i * 0.09}s` }}
          >
            {ch}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default Splash

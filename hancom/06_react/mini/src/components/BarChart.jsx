// 가로 막대그래프 (재사용 컴포넌트)
// items: [{ label, value, color }] 형태의 배열
// format: 값을 어떻게 표시할지 정하는 함수 (예: 금액이면 ₩ 붙이기)
// fixedMax: 별점처럼 최댓값을 5로 고정하고 싶을 때 (없으면 자동)
function BarChart({ items, format, fixedMax }) {
  // 막대 너비 계산용 최댓값 (0으로 나누기 방지)
  const max = fixedMax || Math.max(1, ...items.map((it) => it.value))

  return (
    <div className="bar-chart">
      {items.map((it) => (
        <div key={it.label} className="bar-row">
          <span className="bar-label">{it.label}</span>
          <div className="bar-track">
            {/* 값이 0이면 막대를 아예 그리지 않는다 (빈 트랙) */}
            {it.value > 0 && (
              <div
                className="bar-fill"
                style={{
                  width: `${(it.value / max) * 100}%`,
                  backgroundColor: it.color || 'var(--accent)',
                }}
              />
            )}
          </div>
          <span className="bar-count">
            {format ? format(it.value) : it.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default BarChart

import { CATEGORIES, CATEGORY_LIST } from '../data/records.js'

// 그룹(연도/월)마다 카테고리 구성을 색으로 쌓아 보여주는 누적 막대그래프.
// groups: [{ label, total, segments: [{ category, value }] }]
// format: 값 표시 함수 (예: 금액이면 ₩ 붙이기)
function StackedBarChart({ groups, format }) {
  const fmt = (v) => (format ? format(v) : v)
  // 막대 너비 기준이 되는 최댓값 (0으로 나누기 방지)
  const max = Math.max(1, ...groups.map((g) => g.total))

  return (
    <div className="bar-chart">
      {groups.map((g) => (
        <div key={g.label} className="bar-row">
          <span className="bar-label">{g.label}</span>
          <div className="bar-track stacked">
            {g.segments.map((s) =>
              s.value > 0 ? (
                <div
                  key={s.category}
                  className="bar-seg"
                  style={{
                    width: `${(s.value / max) * 100}%`,
                    backgroundColor: CATEGORIES[s.category].color,
                  }}
                  title={`${s.category}: ${fmt(s.value)}`}
                />
              ) : null
            )}
          </div>
          <span className="bar-count">{fmt(g.total)}</span>
        </div>
      ))}

      {/* 카테고리 색상 범례 */}
      <div className="chart-legend">
        {CATEGORY_LIST.map((c) => (
          <span key={c} className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: CATEGORIES[c].color }}
            />
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

export default StackedBarChart

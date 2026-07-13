import { useState } from 'react'
import { CATEGORIES, CATEGORY_LIST } from '../data/records.js'
import { pad, yearOf, monthOf, formatWon } from '../data/utils.js'
import BarChart from '../components/BarChart.jsx'
import StackedBarChart from '../components/StackedBarChart.jsx'

// 지표(metric) 정의: 카드 3개가 이걸 고른다
const METRICS = {
  count: { label: '총 관람' },
  rating: { label: '평균 별점' },
  spend: { label: '총 지출' },
}

// 그룹(레코드 배열)에 대해 지표 값을 계산
function calc(metric, list) {
  if (metric === 'count') return list.length
  if (metric === 'spend') return list.reduce((s, r) => s + r.price, 0)
  // rating: 별점 매긴 것(0 제외)만 평균
  const rated = list.filter((r) => r.rating > 0)
  if (rated.length === 0) return 0
  return Number(
    (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
  )
}

// 통계 페이지: 지표(관람수/별점/지출) × 기준(카테고리/연도/월)
function Stats({ records }) {
  const [metric, setMetric] = useState('count') // count | rating | spend
  const [dim, setDim] = useState('category') // category | year | month
  const [split, setSplit] = useState(false) // 연도/월을 카테고리로 나눠 볼지

  // 데이터에 존재하는 연도 목록 (오름차순)
  const years = [...new Set(records.map((r) => yearOf(r.date)))].sort()
  // 월별 볼 때 선택한 연도 (기본: 가장 최근 연도)
  const [monthYear, setMonthYear] = useState(years[years.length - 1])

  // --- 요약 카드 값 ---
  const totalCount = records.length
  const avgRating = calc('rating', records)
  const totalSpend = calc('spend', records)

  // --- 선택된 기준(dim)에 따라 그룹 만들기 ---
  let groups = []
  if (dim === 'category') {
    groups = CATEGORY_LIST.map((c) => ({
      label: `${CATEGORIES[c].emoji} ${c}`,
      list: records.filter((r) => r.category === c),
      color: CATEGORIES[c].color,
    }))
  } else if (dim === 'year') {
    groups = years.map((y) => ({
      label: `${y}년`,
      list: records.filter((r) => yearOf(r.date) === y),
    }))
  } else {
    // month: 선택한 연도의 1~12월 (항상 12칸이라 길어지지 않음)
    groups = Array.from({ length: 12 }, (_, i) => {
      const m = pad(i + 1)
      return {
        label: `${i + 1}월`,
        list: records.filter(
          (r) => yearOf(r.date) === monthYear && monthOf(r.date) === m
        ),
      }
    })
  }

  // --- 그룹 → 차트 데이터 ---
  const items = groups.map((g) => ({
    label: g.label,
    value: calc(metric, g.list),
    color: g.color, // 카테고리면 색, 아니면 undefined(기본 노랑)
  }))

  // 카테고리로 나누기: 연도별/월별에서만, 그리고 합산 가능한 지표(관람수/지출)에서만
  // (평균 별점은 쌓을 수 없으므로 제외)
  const canSplit = (dim === 'year' || dim === 'month') && metric !== 'rating'
  const useSplit = split && canSplit

  // 각 그룹을 카테고리별 세그먼트로 쪼갠다
  const stackedGroups = groups.map((g) => ({
    label: g.label,
    total: calc(metric, g.list),
    segments: CATEGORY_LIST.map((c) => ({
      category: c,
      value: calc(metric, g.list.filter((r) => r.category === c)),
    })),
  }))

  // 지표별 표시 형식
  const format =
    metric === 'spend'
      ? formatWon
      : metric === 'rating'
        ? (v) => `⭐ ${v}`
        : (v) => `${v}회`

  const dimLabel =
    dim === 'category'
      ? '카테고리별'
      : dim === 'year'
        ? '연도별'
        : `${monthYear}년 월별`

  return (
    <div className="stats">
      {/* 요약 카드 = 지표 선택 (누르면 아래 차트가 바뀜) */}
      <div className="stat-cards three">
        <button
          className={metric === 'count' ? 'stat-card active' : 'stat-card'}
          onClick={() => setMetric('count')}
        >
          <span className="stat-num">{totalCount}</span>
          <span className="stat-label">총 관람</span>
        </button>
        <button
          className={metric === 'rating' ? 'stat-card active' : 'stat-card'}
          onClick={() => setMetric('rating')}
        >
          <span className="stat-num">⭐ {avgRating}</span>
          <span className="stat-label">평균 별점</span>
        </button>
        <button
          className={metric === 'spend' ? 'stat-card active' : 'stat-card'}
          onClick={() => setMetric('spend')}
        >
          <span className="stat-num">{formatWon(totalSpend)}</span>
          <span className="stat-label">총 지출</span>
        </button>
      </div>

      {/* 기준 선택 탭 */}
      <div className="dim-tabs">
        {[
          ['category', '카테고리별'],
          ['year', '연도별'],
          ['month', '월별'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={dim === key ? 'dim-tab active' : 'dim-tab'}
            onClick={() => setDim(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <div className="chart-box">
        <div className="chart-head">
          <h3 className="chart-title">
            {METRICS[metric].label} · {dimLabel}
            {useSplit && ' · 카테고리별'}
          </h3>
          <div className="chart-controls">
            {/* 연도별/월별에서 카테고리로 나눠 보기 */}
            {canSplit && (
              <label className="split-toggle">
                <input
                  type="checkbox"
                  checked={split}
                  onChange={(e) => setSplit(e.target.checked)}
                />
                카테고리로 나누기
              </label>
            )}
            {/* 월별일 때만 연도 선택 */}
            {dim === 'month' && (
              <div className="year-pills">
                {years.map((y) => (
                  <button
                    key={y}
                    className={monthYear === y ? 'year-pill active' : 'year-pill'}
                    onClick={() => setMonthYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {useSplit ? (
          <StackedBarChart groups={stackedGroups} format={format} />
        ) : (
          <BarChart
            items={items}
            format={format}
            fixedMax={metric === 'rating' ? 5 : undefined}
          />
        )}
      </div>
    </div>
  )
}

export default Stats

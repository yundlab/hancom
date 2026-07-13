import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Poster from '../components/Poster.jsx'
import { HOLIDAYS } from '../data/holidays.js'
import { pad } from '../data/utils.js'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 오늘 날짜 'YYYY-MM-DD'
const now = new Date()
const TODAY = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

// 달력 페이지: 한 달을 그리드로 보여준다.
// - 관람한 날짜: 포스터 썸네일
// - 예매 오픈 예정일: 🔔 공연명 뱃지
function Calendar({ records, openings = [] }) {
  const navigate = useNavigate()

  // 보고 있는 연/월 (기본값: 2026년 7월 - 데이터가 많은 달)
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(7) // 1~12

  // 이 달의 1일이 무슨 요일인지 (0=일)
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  // 이 달의 마지막 날짜 (28~31)
  const lastDate = new Date(year, month, 0).getDate()

  // 그리드 칸 만들기: 앞쪽 빈 칸 + 실제 날짜들
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null) // 1일 앞 빈 칸
  for (let d = 1; d <= lastDate; d++) cells.push(d)

  // 특정 날짜(d)에 해당하는 기록들 찾기
  const recordsOn = (d) => {
    const dateStr = `${year}-${pad(month)}-${pad(d)}`
    return records.filter((r) => r.date === dateStr)
  }

  // 특정 날짜(d)에 예매 오픈 예정인 것들 찾기
  const openingsOn = (d) => {
    const dateStr = `${year}-${pad(month)}-${pad(d)}`
    return openings.filter((o) => o.openDate === dateStr)
  }

  // 이전 달 / 다음 달 이동
  const prevMonth = () => {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
  }
  const nextMonth = () => {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="calendar">
      {/* 달 이동 헤더 */}
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>
          ‹
        </button>
        <h2>
          {year}년 {month}월
        </h2>
        <button className="cal-nav" onClick={nextMonth}>
          ›
        </button>
      </div>

      {/* 요일 줄 (일=빨강, 토=파랑) */}
      <div className="cal-weekdays">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={
              i === 0
                ? 'cal-weekday sun'
                : i === 6
                  ? 'cal-weekday sat'
                  : 'cal-weekday'
            }
          >
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="cal-grid">
        {cells.map((d, i) => {
          // 빈 칸
          if (d === null) {
            return <div key={`empty-${i}`} className="cal-cell empty" />
          }

          const dayRecords = recordsOn(d)
          const first = dayRecords[0] // 대표로 보여줄 첫 기록
          const dayOpenings = openingsOn(d) // 그날 예매 오픈 예정

          // 날짜별 색상 판단
          const dateStr = `${year}-${pad(month)}-${pad(d)}`
          const weekday = new Date(year, month - 1, d).getDay() // 0=일
          const isToday = dateStr === TODAY
          const isHoliday = HOLIDAYS.has(dateStr)

          // 오늘(노랑) > 일요일·공휴일(빨강) > 토요일(파랑) 순서로 우선
          let dayClass = 'cal-day'
          if (isToday) dayClass += ' today'
          else if (weekday === 0 || isHoliday) dayClass += ' sun'
          else if (weekday === 6) dayClass += ' sat'

          const hasContent = dayRecords.length > 0 || dayOpenings.length > 0
          const cellClass =
            (hasContent ? 'cal-cell has' : 'cal-cell') +
            (isToday ? ' today' : '')

          // 클릭: 기록이 있으면 상세로, 없고 예매만 있으면 예매 페이지로
          const handleClick = () => {
            if (first) navigate(`/record/${first.id}`)
            else if (dayOpenings.length > 0) navigate('/openings')
          }

          return (
            <div key={d} className={cellClass} onClick={handleClick}>
              <span className={dayClass}>{d}</span>

              {/* 그날 기록이 있으면 포스터 썸네일 표시 */}
              {first && (
                <div className="cal-poster">
                  <Poster record={first} className="poster-cal" />
                  {/* 같은 날 기록이 여러 개면 +N 표시 */}
                  {dayRecords.length > 1 && (
                    <span className="cal-more">+{dayRecords.length - 1}</span>
                  )}
                </div>
              )}

              {/* 예매 오픈 예정이면 종 아이콘과 공연명을 함께 표시 */}
              {dayOpenings.length > 0 && (
                <button
                  type="button"
                  className="cal-open"
                  title={dayOpenings.map((o) => `예매오픈: ${o.title}`).join('\n')}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/openings')
                  }}
                >
                  <span aria-hidden="true">🔔</span>
                  <span className="cal-open-title">{dayOpenings[0].title}</span>
                  {dayOpenings.length > 1 && (
                    <span className="cal-open-more">외 {dayOpenings.length - 1}건</span>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="cal-hint">
        📌 포스터를 누르면 상세로 · 🔔 공연명은 예매 오픈 예정일
      </p>
    </div>
  )
}

export default Calendar

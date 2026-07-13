// 여러 곳에서 공용으로 쓰는 작은 헬퍼 모음 (날짜·숫자 포맷)

// 숫자를 2자리 문자열로 (7 -> "07")
export const pad = (n) => String(n).padStart(2, '0')

// 'YYYY-MM-DD'에서 연/월 부분만 추출
export const yearOf = (dateStr) => dateStr.slice(0, 4)
export const monthOf = (dateStr) => dateStr.slice(5, 7)

// 금액을 '₩1,234' 형태로
export const formatWon = (n) => `₩${n.toLocaleString()}`

// 'YYYY-MM-DD'까지 오늘(자정 기준)로부터 남은 일수. 음수면 이미 지난 날.
export function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = dateStr.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

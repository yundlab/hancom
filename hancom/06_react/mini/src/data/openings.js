import { daysUntil } from './utils.js'

// 예매 오픈 알리미 목 데이터
// 아직 예매하지 않은, '보고 싶은' 공연의 예매 오픈 일정.
// 필드: category 카테고리 / title 제목 / openDate 예매오픈일 / openTime 오픈시각
//       bookingSite 예매처 / place 예정 장소 / memo 메모 / poster 이모지
export const OPEN_SCHEDULES = [
  {
    id: 1,
    category: '콘서트',
    title: "아이유 콘서트 'The Golden Hour'",
    openDate: '2026-07-20',
    openTime: '20:00',
    bookingSite: '멜론티켓',
    place: 'KSPO DOME',
    memo: '팬클럽 선예매 먼저!',
    poster: '🎤',
  },
  {
    id: 2,
    category: '연극/뮤지컬',
    title: '뮤지컬 위키드 내한',
    openDate: '2026-07-25',
    openTime: '14:00',
    bookingSite: '인터파크',
    place: '블루스퀘어 신한카드홀',
    memo: '얼리버드 20% 할인',
    poster: '🎭',
  },
  {
    id: 3,
    category: '콘서트',
    title: '콜드플레이 내한 2차',
    openDate: '2026-08-01',
    openTime: '12:00',
    bookingSite: '예스24',
    place: '고척 스카이돔',
    memo: '1차 매진 추가 회차',
    poster: '🎤',
  },
  {
    id: 4,
    category: '스포츠',
    title: 'KBO 포스트시즌 플레이오프',
    openDate: '2026-08-10',
    openTime: '11:00',
    bookingSite: '티켓링크',
    place: '잠실야구장',
    memo: '',
    poster: '⚾',
  },
  {
    id: 5,
    category: '페스티벌',
    title: '그랜드 민트 페스티벌',
    openDate: '2026-08-18',
    openTime: '14:00',
    bookingSite: '인터파크',
    place: '올림픽공원',
    memo: '얼리버드 티켓 노리기',
    poster: '🎪',
  },
]

// 예매 오픈까지 남은 일수 (오늘 기준, 음수면 이미 지남)
export const openDDay = (item) => daysUntil(item.openDate)

// 예매 오픈 뱃지 라벨: 미래 'D-7' / 당일 '오늘 오픈!' / 지난 '오픈됨'
export function openDDayLabel(item) {
  const d = openDDay(item)
  if (d > 0) return `D-${d}`
  if (d === 0) return '오늘 오픈!'
  return '오픈됨'
}

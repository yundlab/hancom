import { daysUntil } from './utils.js'

// 카테고리 메타 정보 (이모지 + 색상)
// 여러 컴포넌트에서 공통으로 사용한다.
export const CATEGORIES = {
  '영화':       { emoji: '🎬', color: '#3b82f6' },
  '콘서트':     { emoji: '🎤', color: '#ec4899' },
  '페스티벌':   { emoji: '🎪', color: '#f59e0b' },
  '연극/뮤지컬': { emoji: '🎭', color: '#8b5cf6' },
  '스포츠':     { emoji: '⚽', color: '#10b981' },
}

// 카테고리 이름 목록 (필터 탭 등에서 사용)
export const CATEGORY_LIST = Object.keys(CATEGORIES)

// 결제수단 목록 (폼 선택용)
export const PAY_METHODS = ['신용카드', '카카오페이', '네이버페이', '무통장입금', '현장결제']

// 예매처 목록 (폼 선택용)
export const BOOKING_SITES = [
  '인터파크',
  '예스24',
  '티켓링크',
  '멜론티켓',
  'CGV',
  '메가박스',
  '롯데시네마',
  '현장구매',
]

// 예매처별 홈페이지 URL (상세에서 링크로 연결). 현장구매/기타는 링크 없음.
const BOOKING_SITE_URLS = {
  '인터파크': 'https://tickets.interpark.com',
  '예스24': 'https://ticket.yes24.com',
  '티켓링크': 'https://www.ticketlink.co.kr',
  '멜론티켓': 'https://ticket.melon.com',
  CGV: 'https://www.cgv.co.kr',
  '메가박스': 'https://www.megabox.co.kr',
  '롯데시네마': 'https://www.lottecinema.co.kr',
}

// 예매처 이름 → URL (없으면 null)
export function bookingSiteUrl(site) {
  return BOOKING_SITE_URLS[site] || null
}

// 관람 기록 폼의 빈 초기값. RecordForm과 New(예매완료 프리필)에서 공용으로 쓴다.
// 필드를 추가할 땐 여기 한 곳만 고치면 된다.
export function emptyRecord() {
  return {
    category: '영화',
    title: '',
    bookedDate: '', // 결제일
    payMethod: '신용카드', // 결제수단
    bookingSite: '인터파크', // 예매처
    bookingNo: '', // 예매번호
    price: '',
    date: '', // 관람일
    time: '',
    place: '',
    seat: '',
    rating: 0, // 0 = 아직 관람 전(미평가)
    reviewTitle: '', // 감상 제목 (카드에 표시)
    reviewBody: '', // 감상 내용
    image: '', // 포스터/현장 사진 (data URL)
  }
}

// 초기 관람 기록 목 데이터
// 필드:
//   category 카테고리 / title 제목
//   bookedDate 결제일 / payMethod 결제수단 / price 금액
//   date 관람일 / time 관람시간 / place 장소 / seat 좌석
//   rating 별점(0이면 아직 관람 전=미평가) / reviewTitle 감상제목 / reviewBody 감상내용
//   poster 이모지 / image 사진
export const RECORDS = [
  {
    id: 1,
    category: '영화',
    title: '듄: 파트2',
    bookedDate: '2026-03-10',
    payMethod: '신용카드',
    bookingSite: '메가박스', // 예매처
    bookingNo: 'MEG12340000', // 예매번호
    price: 22000,
    date: '2026-03-15',
    time: '19:40',
    place: '메가박스 코엑스',
    seat: 'IMAX관 H열 12번',
    rating: 5,
    reviewTitle: '스크린이 곧 사막',
    reviewBody: '아이맥스로 봐서 압도적이었다. 모래벌레 등장 장면에서 온몸에 소름이 돋았다.',
    poster: '🎬',
    image: '/posters/dune-part2.jpg',
  },
  {
    id: 2,
    category: '콘서트',
    title: '페퍼톤스 클럽투어',
    bookedDate: '2026-06-01',
    payMethod: '카카오페이',
    bookingSite: '멜론티켓', // 예매처
    bookingNo: 'MEL12344099', // 예매번호
    price: 99000,
    date: '2026-07-12',
    time: '18:00',
    place: '무신사 개러지',
    seat: '스탠딩 A구역',
    rating: 5,
    reviewTitle: '여름밤의 청량함',
    reviewBody: '통통 튀는 무대에 라이브가 청량했다. 앵콜까지 완벽한 셋리스트.',
    poster: '🎤',
    image: '/posters/peppertones-club-tour.jpg',
  },
  {
    id: 3,
    category: '연극/뮤지컬',
    title: '뮤지컬 오페라의 유령',
    bookedDate: '2026-03-20',
    payMethod: '신용카드',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12348198', // 예매번호
    price: 150000,
    date: '2026-04-10',
    time: '19:30',
    place: '샤롯데씨어터',
    seat: '1층 R석 5열 12번',
    rating: 5,
    reviewTitle: '샹들리에의 전율',
    reviewBody: '샹들리에 떨어지는 장면에서 소름. 무대 스케일이 어마어마했다.',
    poster: '🎭',
    image: '/posters/phantom-musical.jpg',
  },
  {
    id: 4,
    category: '스포츠',
    title: 'LG 트윈스 vs 두산 베어스',
    bookedDate: '2026-06-05',
    payMethod: '네이버페이',
    bookingSite: '티켓링크', // 예매처
    bookingNo: 'TL12352297', // 예매번호
    price: 18000,
    date: '2026-06-12',
    time: '18:30',
    place: '잠실야구장',
    seat: '3루 내야 블루석 15블록',
    rating: 4,
    reviewTitle: '9회말 짜릿한 역전',
    reviewBody: '직관 첫 승! 9회말 역전에 다 같이 소리 질렀다.',
    poster: '⚾',
    image: '/posters/lg-doosan.jpg',
  },
  {
    id: 5,
    category: '페스티벌',
    title: '펜타포트 락 페스티벌',
    bookedDate: '2025-06-15',
    payMethod: '카카오페이',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12356396', // 예매번호
    price: 154000,
    date: '2025-08-03',
    time: '13:00',
    place: '인천 송도',
    seat: '스탠딩 (지정석 없음)',
    rating: 4,
    reviewTitle: '비 오는 날의 떼창',
    reviewBody: '비 왔지만 떼창하니까 그것마저 낭만이었다.',
    poster: '🎪',
    image: '/posters/pentaport.jpg',
  },
  {
    id: 6,
    category: '영화',
    title: '위키드',
    bookedDate: '2026-01-18',
    payMethod: '현장결제',
    bookingSite: 'CGV', // 예매처
    bookingNo: 'CGV12360495', // 예매번호
    price: 15000,
    date: '2026-01-20',
    time: '14:20',
    place: 'CGV 용산아이파크몰',
    seat: '6관 J열 8번',
    rating: 4,
    reviewTitle: '노래가 계속 맴돈다',
    reviewBody: 'Defying Gravity 장면에서 눈물. OST를 계속 찾아 듣는다.',
    poster: '🎬',
    image: '/posters/wicked.jpg',
  },
  {
    id: 7,
    category: '콘서트',
    title: '콜드플레이 내한공연',
    bookedDate: '2025-07-10',
    payMethod: '신용카드',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12364594', // 예매번호
    price: 143000,
    date: '2025-11-02',
    time: '19:00',
    place: '고척 스카이돔',
    seat: '3층 210구역 12열',
    rating: 5,
    reviewTitle: '인생 버킷리스트 달성',
    reviewBody: 'LED 팔찌 물결이 장관이었다. 평생 못 잊을 밤.',
    poster: '🎤',
    image: '/posters/coldplay-seoul.jpg',
  },
  {
    id: 8,
    category: '연극/뮤지컬',
    title: '연극 라이어',
    bookedDate: '2026-02-25',
    payMethod: '카카오페이',
    bookingSite: '예스24', // 예매처
    bookingNo: 'YES12368693', // 예매번호
    price: 44000,
    date: '2026-03-01',
    time: '16:00',
    place: '대학로 아트원씨어터',
    seat: 'A구역 3열 7번',
    rating: 3,
    reviewTitle: '가볍게 웃기 좋은',
    reviewBody: '배우들 애드리브가 재밌었다. 데이트로 무난한 선택.',
    poster: '🎭',
    image: '/posters/liar-play.jpg',
  },
  {
    id: 9,
    category: '스포츠',
    title: '축구 국가대표 A매치',
    bookedDate: '2025-09-20',
    payMethod: '네이버페이',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12372792', // 예매번호
    price: 30000,
    date: '2025-10-15',
    time: '20:00',
    place: '서울월드컵경기장',
    seat: 'E석 2층 15열',
    rating: 5,
    reviewTitle: '골 넣는 순간 폭발',
    reviewBody: '손흥민 프리킥 골 들어가는 순간 경기장이 터졌다.',
    poster: '⚽',
    image: '/posters/korea-football.jpg',
  },
  {
    id: 10,
    category: '페스티벌',
    title: '서울재즈페스티벌',
    bookedDate: '2025-04-10',
    payMethod: '신용카드',
    bookingSite: '예스24', // 예매처
    bookingNo: 'YES12376891', // 예매번호
    price: 132000,
    date: '2025-05-25',
    time: '15:00',
    place: '올림픽공원',
    seat: '잔디 자유석',
    rating: 4,
    reviewTitle: '잔디밭 위의 힐링',
    reviewBody: '누워서 듣는 재즈, 이게 진짜 힐링이었다.',
    poster: '🎪',
    image: '/posters/seoul-jazz.jpg',
  },
  {
    id: 11,
    category: '영화',
    title: '인사이드 아웃 2',
    bookedDate: '2025-06-19',
    payMethod: '현장결제',
    bookingSite: '롯데시네마', // 예매처
    bookingNo: 'LOT12380990', // 예매번호
    price: 14000,
    date: '2025-06-20',
    time: '11:30',
    place: '롯데시네마 월드타워',
    seat: '4관 F열 10번',
    rating: 4,
    reviewTitle: '어른이 봐도 눈물',
    reviewBody: '불안이 캐릭터가 너무 공감됐다. 감정 수업을 들은 기분.',
    poster: '🎬',
    image: '/posters/inside-out2.jpg',
  },
  {
    id: 12,
    category: '연극/뮤지컬',
    title: '뮤지컬 시카고',
    bookedDate: '2026-02-10',
    payMethod: '신용카드',
    bookingSite: '티켓링크', // 예매처
    bookingNo: 'TL12385089', // 예매번호
    price: 120000,
    date: '2026-02-28',
    time: '19:30',
    place: '디큐브아트센터',
    seat: '2층 B열 22번',
    rating: 4,
    reviewTitle: '화려한 재즈 안무',
    reviewBody: '안무가 세련됐다. All That Jazz 넘버가 최고였다.',
    poster: '🎭',
    image: '/posters/chicago-musical.jpg',
  },
  {
    id: 13,
    category: '영화',
    title: '그대들은 어떻게 살 것인가',
    bookedDate: '2026-07-02',
    payMethod: '카카오페이',
    bookingSite: '메가박스', // 예매처
    bookingNo: 'MEG12389188', // 예매번호
    price: 15000,
    date: '2026-07-04',
    time: '13:10',
    place: '메가박스 성수',
    seat: '1관 G열 5번',
    rating: 5,
    reviewTitle: '지브리 작화에 압도',
    reviewBody: '여운이 길게 남는다. 두 번 보고 싶은 영화.',
    poster: '🎬',
    image: '/posters/boy-and-heron.jpg',
  },
  {
    id: 16,
    category: '페스티벌',
    title: '워터밤 서울',
    bookedDate: '2026-05-20',
    payMethod: '카카오페이',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12393287', // 예매번호
    price: 176000,
    date: '2026-07-05',
    time: '14:00',
    place: '잠실종합운동장',
    seat: '스탠딩 P1구역',
    rating: 4,
    reviewTitle: '물대포 맞으며 떼창',
    reviewBody: '여름엔 역시 워터밤. 시원하게 놀았다.',
    poster: '🎪',
    image: '/posters/waterbomb-seoul.jpg',
  },
  {
    id: 18,
    category: '콘서트',
    title: '데이식스 콘서트 The DECADE',
    bookedDate: '2026-05-01',
    payMethod: '신용카드',
    bookingSite: '예스24', // 예매처
    bookingNo: 'YES12397386', // 예매번호
    price: 121000,
    date: '2026-06-28',
    time: '18:00',
    place: 'KSPO DOME',
    seat: '플로어 스탠딩 C구역',
    rating: 5,
    reviewTitle: '떼창에 목이 나갔다',
    reviewBody: '밴드 사운드가 진짜 좋다. 전곡 떼창했다.',
    poster: '🎤',
    image: '/posters/day6-decade.jpg',
  },
  {
    id: 19,
    category: '연극/뮤지컬',
    title: '뮤지컬 레미제라블',
    bookedDate: '2026-04-25',
    payMethod: '신용카드',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12401485', // 예매번호
    price: 170000,
    date: '2026-05-16',
    time: '19:00',
    place: '블루스퀘어 신한카드홀',
    seat: '1층 VIP석 7열 15번',
    rating: 5,
    reviewTitle: 'One Day More의 전율',
    reviewBody: '3시간이 안 아까웠다. 넘버 하나하나가 명곡.',
    poster: '🎭',
    image: '/posters/les-miserables.jpg',
  },
  {
    id: 20,
    category: '스포츠',
    title: '프로배구 챔피언결정전',
    bookedDate: '2026-03-12',
    payMethod: '네이버페이',
    bookingSite: '티켓링크', // 예매처
    bookingNo: 'TL12405584', // 예매번호
    price: 20000,
    date: '2026-03-20',
    time: '19:00',
    place: '장충체육관',
    seat: '레드석 2층 5열',
    rating: 4,
    reviewTitle: '풀세트 접전의 열기',
    reviewBody: '5세트까지 가는 접전. 직관 열기가 어마어마했다.',
    poster: '🏐',
    image: '/posters/volleyball-final.jpg',
  },

  // ===== 아직 관람 전 (예정) — rating 0, 감상 비어있음, D-day 뱃지 =====
  {
    id: 21,
    category: '콘서트',
    title: '실리카겔 단독공연 POWER ANDRE',
    bookedDate: '2026-06-25',
    payMethod: '카카오페이',
    bookingSite: '멜론티켓', // 예매처
    bookingNo: 'MEL12409683', // 예매번호
    price: 88000,
    date: '2026-07-16',
    time: '19:00',
    place: '무신사 개러지',
    seat: '스탠딩 B구역',
    rating: 0,
    reviewTitle: '',
    reviewBody: '',
    poster: '🎤',
    image: '/posters/silica-gel-power-andre.jpg',
  },
  {
    id: 14,
    category: '연극/뮤지컬',
    title: '뮤지컬 킹키부츠',
    bookedDate: '2026-06-30',
    payMethod: '신용카드',
    bookingSite: '예스24', // 예매처
    bookingNo: 'YES12413782', // 예매번호
    price: 140000,
    date: '2026-07-18',
    time: '19:30',
    place: '충무아트센터',
    seat: '1층 OP석 3열 9번',
    rating: 0,
    reviewTitle: '',
    reviewBody: '',
    poster: '🎭',
    image: '/posters/kinky-boots.jpg',
  },
  {
    id: 15,
    category: '스포츠',
    title: '두산 베어스 vs KIA 타이거즈',
    bookedDate: '2026-07-10',
    payMethod: '네이버페이',
    bookingSite: '인터파크', // 예매처
    bookingNo: 'IP12417881', // 예매번호
    price: 15000,
    date: '2026-07-22',
    time: '18:30',
    place: '잠실야구장',
    seat: '1루 오렌지석 8블록',
    rating: 0,
    reviewTitle: '',
    reviewBody: '',
    poster: '⚾',
    image: '/posters/doosan-kia.jpg',
  },
  {
    id: 17,
    category: '영화',
    title: '컨저링: 라스트 라이츠',
    bookedDate: '2026-07-09',
    payMethod: '카카오페이',
    bookingSite: 'CGV', // 예매처
    bookingNo: 'CGV12421980', // 예매번호
    price: 15000,
    date: '2026-07-27',
    time: '21:50',
    place: 'CGV 왕십리',
    seat: '7관 K열 14번',
    rating: 0,
    reviewTitle: '',
    reviewBody: '',
    poster: '🎬',
    image: '/posters/conjuring-last-rites.jpg',
  },
  {
    id: 22,
    category: '연극/뮤지컬',
    title: '뮤지컬 헤드윅',
    bookedDate: '2026-07-05',
    payMethod: '신용카드',
    bookingSite: '티켓링크', // 예매처
    bookingNo: 'TL12426079', // 예매번호
    price: 160000,
    date: '2026-08-05',
    time: '20:00',
    place: '블루스퀘어 신한카드홀',
    seat: '1층 R석 4열 18번',
    rating: 0,
    reviewTitle: '',
    reviewBody: '',
    poster: '🎭',
    image: '/posters/hedwig-musical.jpg',
  },
]

// ===== 관람 전/후 판단 & D-day 계산 유틸 =====

// 관람일까지 남은 일수 (오늘 기준). 음수면 이미 지난 것.
const getDDay = (record) => daysUntil(record.date)

// 아직 관람 전인가? (관람일이 오늘이거나 미래)
export function isUpcoming(record) {
  return getDDay(record) >= 0
}

// D-day 뱃지에 쓸 라벨: 오늘이면 'D-DAY', 미래면 'D-7', 과거면 null
export function ddayLabel(record) {
  const d = getDDay(record)
  if (d > 0) return `D-${d}`
  if (d === 0) return 'D-DAY'
  return null
}

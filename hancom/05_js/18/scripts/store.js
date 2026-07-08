// ============================================================
//  store.js — 모든 페이지가 함께 쓰는 공용 코드
//  · localStorage 읽기/쓰기
//  · 숫자·환율·색·아바타 도우미
//  페이지끼리는 이 localStorage 로 데이터를 주고받음
// ============================================================

const STORE_KEY = "traveltick";
const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

// ----- 저장소 -----
function loadState() {
  return JSON.parse(localStorage.getItem(STORE_KEY)) || { trips: [] };
}
function saveState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

// 여행 하나 꺼내기 (id 로)
function getTrip(id) {
  return loadState().trips.find((t) => String(t.id) === String(id));
}
// 여행 하나 저장하기 (수정된 객체로 덮어쓰기)
function putTrip(trip) {
  const state = loadState();
  const i = state.trips.findIndex((t) => t.id === trip.id);
  if (i >= 0) state.trips[i] = trip;
  else state.trips.push(trip);
  saveState(state);
}

// 주소창 ?id=... 값 읽기
function param(name) {
  return new URLSearchParams(location.search).get(name);
}

// ----- 숫자·환율 -----
// 돈은 소수점 없이 반올림해서 "12,345"처럼 천단위 콤마로 표기 (엔·원 공통)
const fmtInt = (n) => Math.round(n).toLocaleString();
const fmtLocal = fmtInt;   // 현지통화 표기용 별칭 (뜻만 구분, 포맷은 동일)
const toKrw = (trip, local) => local * (trip.rate || 0);       // 현지금액 → 원화

// ----- 색·아바타 -----
function colorOf(trip, name) {
  const i = trip.members.indexOf(name);
  return COLORS[(i < 0 ? 0 : i) % COLORS.length];
}
function avatar(trip, name, size) {
  const s = size ? `width:${size}px;height:${size}px;font-size:${size / 2.6}px;` : "";
  return `<span class="avatar" style="background:${colorOf(trip, name)};${s}">${name[0]}</span>`;
}

// ----- 여행 상태 (진행중 / 다가오는 / 지난) -----
function tripStatus(trip) {
  const today = new Date().toISOString().slice(0, 10);
  if (trip.endDate && trip.endDate < today) return "past";
  if (trip.startDate && trip.startDate > today) return "upcoming";
  return "ongoing";
}

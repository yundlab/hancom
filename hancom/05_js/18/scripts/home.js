// ============================================================
//  home.js — 🏠 홈 (여행 리스트)
//  진행 중/다가오는 여행과 지난 여행을 카드로 보여줌
// ============================================================

const ongoingList = document.querySelector("#ongoingList");
const pastList = document.querySelector("#pastList");

// 여행 카드 한 장 만들기 → 클릭하면 trip.html 로 이동
function tripCard(trip) {
  const totalLocal = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const totalKrw = toKrw(trip, totalLocal);
  const budget = trip.budget || 0;
  const pct = budget > 0 ? Math.min((totalKrw / budget) * 100, 100) : 0;
  const status = tripStatus(trip);
  const statusTxt = status === "ongoing" ? "여행 중" : status === "upcoming" ? "예정" : "완료";

  const a = document.createElement("a");
  a.className = "trip-card " + status;
  a.href = "trip.html?id=" + trip.id;
  a.innerHTML = `
    <div class="tc-head">
      <span class="tc-status">${statusTxt}</span>
      <span class="tc-remain">남은 예산 ${fmtInt(budget - totalKrw)}원</span>
    </div>
    <h3 class="tc-name">${trip.country || "🧳"} ${trip.name}</h3>
    <p class="tc-date">${trip.startDate || ""} ${trip.endDate ? "~ " + trip.endDate : ""}</p>
    <div class="bar-outer"><div class="bar-inner" style="width:${pct}%"></div></div>
    <div class="tc-foot">
      <span>예산 사용 ${Math.round(budget ? (totalKrw / budget) * 100 : 0)}%</span>
      <span>목표 ${fmtInt(budget)}원</span>
    </div>
    <div class="tc-members">${trip.members.map((m) => avatar(trip, m, 26)).join("")}
      <span class="tc-member-names">${trip.members.join(", ")}</span></div>`;
  return a;
}

function render() {
  const state = loadState();
  ongoingList.innerHTML = "";
  pastList.innerHTML = "";

  const ongoing = state.trips.filter((t) => tripStatus(t) !== "past");
  const past = state.trips.filter((t) => tripStatus(t) === "past");

  // 히어로 통계 (전체 여행 합산)
  const totalSpent = state.trips.reduce(
    (sum, t) => sum + t.expenses.reduce((s, e) => s + e.amount, 0) * (t.rate || 0), 0);
  document.querySelector("#statTrips").textContent = state.trips.length;
  document.querySelector("#statSpent").textContent = fmtInt(totalSpent);
  document.querySelector("#statOngoing").textContent = ongoing.length;

  if (ongoing.length === 0)
    ongoingList.innerHTML = `<p class="empty">진행 중인 여행이 없어요.<br>아래 버튼으로 새 여행을 시작해보세요 ✈️</p>`;
  else ongoing.forEach((t) => ongoingList.appendChild(tripCard(t)));

  if (past.length === 0) pastList.innerHTML = `<p class="empty">아직 지난 여행이 없어요</p>`;
  else past.forEach((t) => pastList.appendChild(tripCard(t)));

  // 네비 REPORT는 진행 중인 여행(없으면 가장 최근 여행)의 정산 페이지로 보냄
  const navReport = document.querySelector("#navReport");
  const target = ongoing[0] || state.trips[state.trips.length - 1];
  if (target) navReport.href = "report.html?id=" + target.id;
}

render();

// 히어로에선 '새 여행' 버튼 숨기고, 콘텐츠로 스크롤하면 등장
const fabEl = document.querySelector(".fab");
function toggleFab() {
  if (window.scrollY > window.innerHeight * 0.5) fabEl.classList.add("show");
  else fabEl.classList.remove("show");
}
window.addEventListener("scroll", toggleFab);
toggleFab();

// ---------- 스크롤 효과 (히어로 패럴랙스 · 데코 두들 · 워드마크 슬라이드 · 네비 배경 · 콘텐츠 등장) ----------
const heroStage = document.querySelector(".hero-stage");
const wordmarkEl = document.querySelector(".wordmark");
const landingNav = document.querySelector(".landing-nav");
const landingEl = document.querySelector(".landing");
const revealEls = document.querySelectorAll(".reveal");
const doodleEls = document.querySelectorAll(".hero-doodle");

function updateScrollFx() {
  // 히어로 구간(0~1)을 스크롤한 비율만큼 캐릭터·태그라인을 위로 밀어 올리고 서서히 사라지게
  const heroH = landingEl.offsetHeight || window.innerHeight;
  const p = Math.min(window.scrollY / heroH, 1);
  heroStage.style.transform = `translateY(${-p * 80}px)`;
  heroStage.style.opacity = 1 - p * 1.2;

  // 데코 두들은 각자 data-depth 값만큼 서로 다른 속도·방향으로 움직이고 돌아감 (패럴랙스)
  doodleEls.forEach((el) => {
    const depth = Number(el.dataset.depth) || 1;
    el.style.transform = `translateY(${-p * 90 * depth}px) rotate(${p * 30 * depth}deg)`;
    el.style.opacity = 1 - p;
  });

  // TRAVELTICK 워드마크는 스크롤할수록 화면 왼쪽 밖으로 슬라이드되며 사라짐
  wordmarkEl.style.transform = `translateX(${-p * 100}vw)`;
  wordmarkEl.style.opacity = 1 - p;

  // 스크롤하면 네비게이션에 배경 생기기
  landingNav.classList.toggle("scrolled", window.scrollY > 40);

  // 콘텐츠 카드들 뷰포트에 들어오면 떠오르듯 등장
  revealEls.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add("in-view");
  });
}
window.addEventListener("scroll", updateScrollFx);
updateScrollFx();

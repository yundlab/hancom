// ============================================================
//  report.js — 💸 최종 결산
//  공동지출을 모아 '최적 송금 루트'와 '인원별 내역'을 계산
// ============================================================

const tripId = param("id");
const trip = getTrip(tripId);
if (!trip) { location.href = "index.html"; }

const $ = (s) => document.querySelector(s);

// 뒤로가기 링크
$("#backLink").href = "trip.html?id=" + trip.id;
$("#backBtn").href = "trip.html?id=" + trip.id;

// 여행 제목 · 국가 · 기간
$("#rtTripName").textContent = `${trip.country || "🧳"} ${trip.name}`;
$("#rtTripPeriod").textContent = (trip.startDate && trip.endDate) ? `${trip.startDate} ~ ${trip.endDate}` : "";

// ---------- 계산 ----------
// 공동 지출은 그 지출에 실제로 참여한 사람끼리만 나눔 (전원이 항상 1/n인 건 아님)
const members = trip.members;
const shared = trip.expenses.filter((e) => e.split === "공동");   // 공동 지출만
const totalShared = shared.reduce((s, e) => s + e.amount, 0);
const n = members.length;
const sharePerAvg = n > 0 ? totalShared / n : 0;                 // 평균 인당 분담금(현지) — 참고용

// 상단 카드
$("#sharedLocal").textContent = fmtLocal(totalShared);
$("#sharedCur").textContent = trip.currency;
$("#sharedKrw").textContent = fmtInt(toKrw(trip, totalShared));
$("#sharePerLocal").textContent = fmtLocal(sharePerAvg);
$("#sharePerCur").textContent = trip.currency;
$("#sharePerKrw").textContent = fmtInt(toKrw(trip, sharePerAvg));
$("#rateNote").textContent = `📌 이번 여행 적용 환율: 1 ${trip.currency} = ${trip.rate}원 (고정 환율)`;

// 사람별 낸 돈(paid) · 실제 부담해야 할 몫(owed) · 잔액(balance)
const paid = {};
const owed = {};
members.forEach((m) => { paid[m] = 0; owed[m] = 0; });
shared.forEach((e) => {
  if (paid[e.payer] !== undefined) paid[e.payer] += e.amount;
  // participants 없는 옛 기록은 전원 참여로 간주 (하위 호환)
  const parts = e.participants && e.participants.length ? e.participants : members;
  const share = e.amount / parts.length;
  parts.forEach((p) => { if (owed[p] !== undefined) owed[p] += share; });
});
const balances = members.map((m) => ({ name: m, paid: paid[m], owed: owed[m], balance: paid[m] - owed[m] }));

renderRoutes();
renderLedger();

// ---------- 최적 송금 루트 (그리디) ----------
function renderRoutes() {
  const box = $("#routes");
  box.innerHTML = "";

  // 복사본으로 계산 (가장 많이 받을 사람 ↔ 가장 많이 줄 사람 반복 매칭)
  const bal = balances.map((b) => ({ name: b.name, amt: b.balance }));
  const transfers = [];
  const EPS = 0.01;
  while (true) {
    const credit = bal.reduce((a, b) => (b.amt > a.amt ? b : a), { amt: -Infinity });
    const debit  = bal.reduce((a, b) => (b.amt < a.amt ? b : a), { amt: Infinity });
    if (credit.amt < EPS || debit.amt > -EPS) break;
    const move = Math.min(credit.amt, -debit.amt);
    transfers.push({ from: debit.name, to: credit.name, amt: move });
    credit.amt -= move;
    debit.amt += move;
  }

  if (transfers.length === 0) {
    box.innerHTML = `<p class="empty">정산할 공동 지출이 없어요 👍</p>`;
    return;
  }
  transfers.forEach((tr) => {
    const row = document.createElement("div");
    row.className = "route";
    row.innerHTML = `
      <div class="route-main">
        <div class="route-person">${avatar(trip, tr.from)}<span class="name">${tr.from}</span></div>
        <div class="route-arrow">
          <span class="route-amount">${trip.currency} ${fmtLocal(tr.amt)}</span>
          <div class="route-line"></div>
          <div class="route-krw">≈ ${fmtInt(toKrw(trip, tr.amt))}원</div>
        </div>
        <div class="route-person">${avatar(trip, tr.to)}<span class="name">${tr.to}</span></div>
      </div>
      <p class="route-desc">${tr.from} → ${tr.to} 에게 송금</p>`;
    box.appendChild(row);
  });
}

// ---------- 인원별 내역 ----------
function renderLedger() {
  const box = $("#ledger");
  box.innerHTML = "";

  balances.forEach((b) => {
    const pct = totalShared > 0 ? Math.round((b.paid / totalShared) * 100) : 0;
    const balKrw = Math.round(toKrw(trip, b.balance));
    const sign = balKrw > 0 ? "plus" : balKrw < 0 ? "minus" : "";
    const signTxt = balKrw > 0 ? `+${fmtInt(balKrw)}원` : balKrw < 0 ? `${fmtInt(balKrw)}원` : "0원";
    const balLocalTxt = b.balance > 0 ? `+${fmtLocal(b.balance)}` : b.balance < 0 ? `${fmtLocal(b.balance)}` : "0";

    const row = document.createElement("div");
    row.className = "ledger-row";
    row.innerHTML = `
      ${avatar(trip, b.name)}
      <div class="ledger-body">
        <div class="ledger-top">
          <span class="ledger-name">${b.name}</span>
          <span class="ledger-bal ${sign}">${balLocalTxt} ${trip.currency}<small>${signTxt}</small></span>
        </div>
        <div class="ledger-bar-outer">
          <div class="ledger-bar-inner" style="width:${pct}%;background:${colorOf(trip, b.name)}"></div>
        </div>
        <div class="ledger-sub">
          <div class="ls-row">
            <span class="ls-label">지출</span>
            <b class="ls-amt">${trip.currency} ${fmtLocal(b.paid)}</b>
            <span class="ls-krw">≈ ${fmtInt(toKrw(trip, b.paid))}원</span>
            <span class="ls-pct">${pct}%</span>
          </div>
          <div class="ls-row">
            <span class="ls-label">분담</span>
            <b class="ls-amt">${trip.currency} ${fmtLocal(b.owed)}</b>
            <span class="ls-krw">≈ ${fmtInt(toKrw(trip, b.owed))}원</span>
          </div>
        </div>
      </div>`;
    box.appendChild(row);
  });
}

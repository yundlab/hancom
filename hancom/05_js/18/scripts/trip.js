// ============================================================
//  trip.js — 🧾 여행 타임라인 (대시보드 + 기록 폼 + 일차별 리스트)
//  주소창 ?id=... 로 어떤 여행인지 알아냄
// ============================================================

const tripId = param("id");
let trip = getTrip(tripId);

// 여행이 없으면 홈으로 (잘못된 주소 방지)
if (!trip) { location.href = "index.html"; }

const $ = (s) => document.querySelector(s);
const list = $("#list");
const payerSel = $("#payer");

// 헤더 · 수정/결산 링크 · 여행 기간
$("#tripTitle").textContent = `${trip.country || "🧳"} ${trip.name}`;
$("#editLink").href = "create.html?id=" + trip.id;
$("#reportBtn").href = "report.html?id=" + trip.id;
$("#tripPeriod").textContent = (trip.startDate && trip.endDate) ? `${trip.startDate} ~ ${trip.endDate}` : "";

// 결제자 목록 채우기
trip.members.forEach((name) => {
  const op = document.createElement("option");
  op.value = name; op.textContent = name;
  payerSel.appendChild(op);
});

// 날짜 기본값 = 여행 시작일(있으면) 아니면 오늘
$("#date").value = trip.startDate || new Date().toISOString().slice(0, 10);

// 현지금액 입력칸 : 통화 단위 표시 + 입력하는 즉시 한화 환산 미리보기
const amountInp = $("#amount");
$("#amountCur").textContent = trip.currency;
amountInp.addEventListener("input", () => {
  const v = Number(amountInp.value);
  $("#amountKrw").textContent = v > 0 ? `≈ ${fmtInt(toKrw(trip, v))}원` : "";
});

// ---------- 공동지출 참여자 선택 (전원이 아니어도 되게 빼고 넣기) ----------
const splitMembersBox = $("#splitMembers");
const splitMemberChips = $("#splitMemberChips");
let splitParticipants = [...trip.members];   // 기본은 전원 참여, 탭해서 빼기

function renderSplitChips() {
  splitMemberChips.innerHTML = "";
  trip.members.forEach((name) => {
    const on = splitParticipants.includes(name);
    const chip = document.createElement("div");
    chip.className = "split-chip " + (on ? "on" : "off");
    chip.innerHTML = `${avatar(trip, name, 22)}<span>${name}</span>`;
    chip.onclick = () => {
      splitParticipants = on ? splitParticipants.filter((m) => m !== name) : [...splitParticipants, name];
      renderSplitChips();
    };
    splitMemberChips.appendChild(chip);
  });
}
renderSplitChips();

document.querySelectorAll('input[name="split"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const isShared = document.querySelector('input[name="split"]:checked').value === "공동";
    splitMembersBox.hidden = !isShared;
    if (isShared) { splitParticipants = [...trip.members]; renderSplitChips(); }
  });
});

// ---------- 그리기 ----------
function render() {
  renderDashboard();
  renderTimeline();
}

function renderDashboard() {
  const totalLocal = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const totalKrw = toKrw(trip, totalLocal);

  $("#totalKrw").textContent = fmtInt(totalKrw);
  $("#totalLocal").textContent = fmtLocal(totalLocal);
  $("#totalCur").textContent = trip.currency;

  const budget = trip.budget || 0;
  const pct = budget > 0 ? Math.min((totalKrw / budget) * 100, 100) : 0;
  const bar = $("#bar");
  bar.style.width = pct + "%";
  $("#budgetUsed").textContent = `예산 ${Math.round(budget ? (totalKrw / budget) * 100 : 0)}% 사용`;
  $("#budgetGoal").textContent = `목표 ${fmtInt(budget)}원`;

  const cheer = $("#cheer");
  if (trip.expenses.length === 0) {
    cheer.textContent = "😊 여행 시작! 첫 지출을 기록해보세요"; bar.style.background = "#5b8def";
  } else if (pct < 70) {
    cheer.textContent = `😊 편안한 페이스예요! 예산 ${fmtInt(budget)}원 중 ${Math.round(pct)}% 사용`;
    bar.style.background = "#10b981";
  } else if (pct < 100) {
    cheer.textContent = "😮 예산의 70%를 넘었어요. 슬슬 아껴볼까요?"; bar.style.background = "#f59e0b";
  } else {
    cheer.textContent = "🚨 예산을 다 썼어요! 지출에 주의하세요"; bar.style.background = "#ef4444";
  }
}

function renderTimeline() {
  list.innerHTML = "";
  if (trip.expenses.length === 0) {
    list.innerHTML = `<p class="empty">아직 기록이 없어요.<br>위에서 첫 지출을 남겨보세요 ✍️</p>`;
    return;
  }
  const dates = [...new Set(trip.expenses.map((e) => e.date))].sort();
  // 일차 번호 = 여행 시작일 기준 실제 날짜 차이 (지출 없는 날도 건너뛰지 않고 계산)
  const baseDate = trip.startDate || dates[0];
  dates.forEach((date) => {
    const dayExp = trip.expenses.filter((e) => e.date === date);
    const daySum = dayExp.reduce((s, e) => s + e.amount, 0);
    const dayNo = Math.round((new Date(date) - new Date(baseDate)) / 86400000) + 1;

    const group = document.createElement("div");
    group.className = "day-group";
    group.innerHTML = `
      <div class="day-head">
        <span class="day-badge">${dayNo}일차</span>
        <span class="day-date">${date}</span>
        <span class="day-total">${trip.currency} ${fmtLocal(daySum)}
          <small>(${dayExp.length}건)</small></span>
      </div>`;
    dayExp.forEach((e) => group.appendChild(makeCard(e)));
    list.appendChild(group);
  });
}

function makeCard(e) {
  const card = document.createElement("article");
  card.className = "card card-clickable";
  // participants 없는 옛 기록은 전원 참여로 간주 (하위 호환)
  const parts = e.split === "공동" ? (e.participants && e.participants.length ? e.participants : trip.members) : [];
  const splitBadge = e.split === "공동"
    ? `<span class="badge shared">공동 ${parts.length}명</span>`
    : `<span class="badge personal">개인</span>`;
  const perLocal = e.split === "공동" ? e.amount / parts.length : 0;
  const splitInfo = e.split === "공동"
    ? `<div class="card-split">1/${parts.length} · ${trip.currency} ${fmtLocal(perLocal)} · ${parts.join(", ")}</div>` : "";
  const memo = e.memo ? `<div class="card-memo">"${e.memo}"</div>` : "";

  card.innerHTML = `
    <div class="card-emoji">${e.cat}</div>
    <div class="card-body">
      <div class="card-top">
        <span class="card-name">${e.name}</span>
        ${splitBadge}
      </div>
      <div class="card-amount">
        <span class="local">${fmtLocal(e.amount)}</span>
        <span class="cur">${trip.currency}</span>
        <span class="krw">≈ ${fmtInt(toKrw(trip, e.amount))}원</span>
      </div>
      <div class="card-meta">💳 결제 ${e.payer}</div>
      ${splitInfo}
      ${memo}
    </div>`;

  const del = document.createElement("button");
  del.className = "card-del";
  del.textContent = "✕";
  del.onclick = (evt) => {
    evt.stopPropagation();                 // 카드 클릭(수정)으로 안 번지게
    trip.expenses = trip.expenses.filter((x) => x.id !== e.id);
    putTrip(trip);
    render();
  };
  card.appendChild(del);
  card.onclick = () => startEdit(e);        // 카드 클릭 → 이 지출 수정 모드로
  return card;
}

// ---------- 지출 추가 · 수정 ----------
const submitBtn = $("#submitBtn");
const cancelBtn = $("#cancelEdit");
let editingId = null;                       // null이면 새로 추가, 값 있으면 그 지출을 수정 중

// 카드를 눌렀을 때 : 폼에 기존 값 채우고 '수정 모드'로 전환
function startEdit(e) {
  editingId = e.id;
  document.querySelector(`input[name="cat"][value="${CSS.escape(e.cat)}"]`).checked = true;
  $("#name").value = e.name;
  amountInp.value = e.amount;
  amountInp.dispatchEvent(new Event("input"));
  $("#date").value = e.date;
  document.querySelector(`input[name="split"][value="${e.split}"]`).checked = true;
  splitMembersBox.hidden = e.split !== "공동";
  splitParticipants = e.split === "공동" ? [...(e.participants && e.participants.length ? e.participants : trip.members)] : [...trip.members];
  renderSplitChips();
  payerSel.value = e.payer;
  $("#memo").value = e.memo || "";

  submitBtn.textContent = "수정 완료 ✓";
  cancelBtn.hidden = false;
  $("#form").scrollIntoView({ behavior: "smooth", block: "start" });
}

// 수정 취소 → 폼 비우고 '추가 모드'로 복귀
function stopEdit() {
  editingId = null;
  $("#form").reset();
  amountInp.dispatchEvent(new Event("input"));
  $("#date").value = trip.startDate || new Date().toISOString().slice(0, 10);
  splitMembersBox.hidden = true;
  splitParticipants = [...trip.members];
  renderSplitChips();
  submitBtn.textContent = "딸깍! 기록 완료 ✓";
  cancelBtn.hidden = true;
}
cancelBtn.addEventListener("click", stopEdit);

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const amount = Number($("#amount").value);
  const date = $("#date").value;
  const split = document.querySelector('input[name="split"]:checked').value;
  if (!name) { alert("가게명을 입력하세요"); return; }
  if (!amount || amount <= 0) { alert("금액을 올바르게 입력하세요"); return; }
  if (!date) { alert("날짜를 선택하세요"); return; }
  if (split === "공동" && splitParticipants.length === 0) { alert("같이 나눌 사람을 1명 이상 선택하세요"); return; }

  const data = {
    cat: document.querySelector('input[name="cat"]:checked').value,
    name, amount, date, split,
    participants: split === "공동" ? [...splitParticipants] : [],
    payer: payerSel.value,
    memo: $("#memo").value.trim(),
  };

  if (editingId) {
    const target = trip.expenses.find((x) => x.id === editingId);
    Object.assign(target, data);
  } else {
    trip.expenses.push({ id: Date.now(), ...data });
  }
  putTrip(trip);
  stopEdit();
  render();
});

render();

// ============================================================
//  create.js — ✍️ 여정 생성
//  나라·이름·기간·통화/환율·예산·멤버를 입력받아 여행 하나 생성
//  → 만들면 trip.html?id=... 로 이동
// ============================================================

// 나라 목록 (선택하면 통화·추천환율 자동 채움)
const COUNTRIES = [
  { flag: "🇯🇵", name: "일본",     cur: "JPY", rate: 9 },
  { flag: "🇹🇭", name: "태국",     cur: "THB", rate: 40 },
  { flag: "🇹🇼", name: "대만",     cur: "TWD", rate: 44 },
  { flag: "🇻🇳", name: "베트남",   cur: "VND", rate: 0.057 },
  { flag: "🇺🇸", name: "미국",     cur: "USD", rate: 1400 },
  { flag: "🇪🇺", name: "유럽",     cur: "EUR", rate: 1500 },
  { flag: "🇭🇰", name: "홍콩",     cur: "HKD", rate: 180 },
  { flag: "🇸🇬", name: "싱가포르", cur: "SGD", rate: 1050 },
];
const QUICK_MEMBERS = ["민호", "은지", "서준", "유리"];

// 요소 잡기
const countryGrid = document.querySelector("#countryGrid");
const nameInp = document.querySelector("#name");
const startInp = document.querySelector("#start");
const endInp = document.querySelector("#end");
const daysLabel = document.querySelector("#days");
const currencyInp = document.querySelector("#currency");
const curLabel = document.querySelector("#curLabel");
const rateInp = document.querySelector("#rate");
const budgetInp = document.querySelector("#budget");
const memberChips = document.querySelector("#memberChips");
const memberInput = document.querySelector("#memberInput");
const quickMembers = document.querySelector("#quickMembers");

// 수정 모드 : 주소창에 ?id=... 가 있으면 기존 여행을 불러와 폼에 채움
const editId = param("id");
const editingTrip = editId ? getTrip(editId) : null;

// 뒤로가기 : id가 있으면(수정 모드 진입 시도였으면) 무조건 그 여행 상세로,
// 여행을 못 찾은 예외 상황에도 홈으로 보내지 않고 우선 그 주소로 시도하게 함
if (editId) document.querySelector("#backLink").href = "trip.html?id=" + editId;

// 상태 (이 페이지에서만 쓰는 임시값)
let country = "🧳";
let members = ["나"];

// --- 나라 타일 그리기 ---
COUNTRIES.forEach((c, i) => {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "country" + (!editingTrip && i === 0 ? " active" : "");
  tile.innerHTML = `<span class="c-flag">${c.flag}</span><span class="c-name">${c.name}</span>`;
  tile.onclick = () => {
    document.querySelectorAll(".country").forEach((t) => t.classList.remove("active"));
    tile.classList.add("active");
    country = c.flag;
    currencyInp.value = c.cur;
    curLabel.textContent = c.cur;
    rateInp.value = c.rate;
  };
  countryGrid.appendChild(tile);
});

if (editingTrip) {
  // ----- 수정 모드 : 기존 여행 값으로 폼 채우기 -----
  document.querySelector("#pageTitle").textContent = "여행 수정하기";
  document.querySelector("#submitBtn").textContent = "💾 수정 완료";

  country = editingTrip.country || "🧳";
  const matchIdx = COUNTRIES.findIndex((c) => c.flag === country);
  document.querySelectorAll(".country").forEach((t, i) => t.classList.toggle("active", i === matchIdx));

  nameInp.value = editingTrip.name;
  startInp.value = editingTrip.startDate || "";
  endInp.value = editingTrip.endDate || "";
  currencyInp.value = editingTrip.currency;
  curLabel.textContent = editingTrip.currency;
  rateInp.value = editingTrip.rate;
  budgetInp.value = editingTrip.budget || "";
  members = [...editingTrip.members];
} else {
  // 첫 나라(일본) 기본 선택값 반영
  country = COUNTRIES[0].flag;
  currencyInp.value = COUNTRIES[0].cur;
  rateInp.value = COUNTRIES[0].rate;
}

// 통화 직접 바꾸면 라벨도 갱신
currencyInp.addEventListener("change", () => { curLabel.textContent = currencyInp.value; });

// --- 실시간 환율 불러오기 (무료 API, 키 필요 없음) ---
const rateFetchBtn = document.querySelector("#rateFetch");
const rateStatus = document.querySelector("#rateStatus");
rateFetchBtn.addEventListener("click", async () => {
  const cur = currencyInp.value;
  if (cur === "KRW") { rateInp.value = 1; rateStatus.textContent = "원화는 환율 1로 고정"; return; }

  rateFetchBtn.disabled = true;
  rateFetchBtn.textContent = "불러오는 중...";
  rateStatus.textContent = "";
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${cur}`);
    const data = await res.json();
    if (data.result !== "success" || !data.rates.KRW) throw new Error("응답 오류");
    rateInp.value = Math.round(data.rates.KRW * 10000) / 10000;   // 소수 4자리까지
    rateStatus.textContent = `✅ 방금 불러온 환율: 1 ${cur} = ${rateInp.value}원`;
  } catch (err) {
    rateStatus.textContent = "⚠️ 불러오기 실패, 직접 입력해주세요";
  } finally {
    rateFetchBtn.disabled = false;
    rateFetchBtn.textContent = "🔄 실시간 환율";
  }
});

// --- 여행 기간 → 며칠인지 계산 ---
function updateDays() {
  if (startInp.value && endInp.value) {
    const s = new Date(startInp.value), e = new Date(endInp.value);
    const days = Math.round((e - s) / 86400000) + 1;
    daysLabel.textContent = days > 0 ? `총 ${days}일 여행` : "종료일이 시작일보다 빨라요";
  } else daysLabel.textContent = "";
}
startInp.addEventListener("change", updateDays);
endInp.addEventListener("change", updateDays);
updateDays();   // 수정 모드에서 기간이 이미 채워져 있으면 바로 계산해서 보여줌

// --- 예산 빠른 선택 칩 ---
document.querySelectorAll(".budget-chips button").forEach((btn) => {
  btn.onclick = () => { budgetInp.value = btn.dataset.v; };
});

// --- 멤버 ---
function renderMembers() {
  memberChips.innerHTML = "";
  members.forEach((name) => {
    const chip = document.createElement("span");
    chip.className = "chip" + (name === "나" ? " me" : "");
    // 색은 등록 순서 기준 (store.avatar 는 trip 객체가 필요하므로 여기선 간단히)
    const color = COLORS[members.indexOf(name) % COLORS.length];
    chip.innerHTML = `<span class="avatar" style="width:24px;height:24px;font-size:11px;background:${color}">${name[0]}</span><span>${name}</span>`;
    if (name !== "나") {
      const x = document.createElement("span");
      x.className = "chip-x";
      x.textContent = "✕";
      x.onclick = () => { members = members.filter((m) => m !== name); renderMembers(); renderQuick(); };
      chip.appendChild(x);
    }
    memberChips.appendChild(chip);
  });
}
function addMember(name) {
  name = name.trim();
  if (!name || members.includes(name)) return;
  members.push(name);
  renderMembers();
  renderQuick();
}
function renderQuick() {
  quickMembers.innerHTML = "빠른 추가: ";
  QUICK_MEMBERS.filter((m) => !members.includes(m)).forEach((m) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "quick-btn";
    b.textContent = "＋ " + m;
    b.onclick = () => addMember(m);
    quickMembers.appendChild(b);
  });
}
document.querySelector("#memberAdd").onclick = () => { addMember(memberInput.value); memberInput.value = ""; };
memberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); addMember(memberInput.value); memberInput.value = ""; }
});
renderMembers();
renderQuick();

// --- 제출 → 여행 생성/수정 후 타임라인으로 이동 ---
document.querySelector("#createForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInp.value.trim();
  const rate = Number(rateInp.value);
  if (!name) { alert("여행 이름을 입력하세요"); return; }
  if (!rate || rate <= 0) { alert("환율을 입력하세요"); return; }

  if (editingTrip) {
    // ----- 수정 저장 : id·expenses는 유지, 나머지 값만 덮어씀 -----
    editingTrip.name = name;
    editingTrip.country = country;
    editingTrip.startDate = startInp.value;
    editingTrip.endDate = endInp.value;
    editingTrip.currency = currencyInp.value;
    editingTrip.rate = rate;
    editingTrip.budget = Number(budgetInp.value) || 0;
    editingTrip.members = members;

    // 멤버가 삭제됐을 수 있으니 기존 지출의 결제자·참여자 참조를 정리
    editingTrip.expenses.forEach((exp) => {
      if (!members.includes(exp.payer)) exp.payer = members[0] || "나";
      if (exp.participants) {
        exp.participants = exp.participants.filter((p) => members.includes(p));
        if (exp.split === "공동" && exp.participants.length === 0) exp.participants = [...members];
      }
    });

    putTrip(editingTrip);
    location.href = "trip.html?id=" + editingTrip.id;
    return;
  }

  const trip = {
    id: Date.now(),
    name,
    country,
    startDate: startInp.value,
    endDate: endInp.value,
    currency: currencyInp.value,
    rate,
    budget: Number(budgetInp.value) || 0,
    members,
    expenses: [],
  };
  putTrip(trip);
  location.href = "trip.html?id=" + trip.id;
});

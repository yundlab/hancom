/* ============================================================
   네온 계산기 — 로직
   - 기본 사칙연산(+ − × ÷), %, ±, 소수점, AC, ⌫
   - 히스토리(버튼 열기), 키보드 입력, 복사, 애니메이션
   ============================================================ */

(() => {
  "use strict";

  // ---------- 상태 ----------
  const state = {
    current: "0",     // 현재 입력 중인 숫자(문자열)
    previous: null,   // 이전 피연산자(숫자)
    operator: null,   // 대기 중인 연산자
    overwrite: true,  // 다음 입력 시 current 덮어쓰기 여부
  };

  // ---------- DOM ----------
  const $result = document.getElementById("result");
  const $expression = document.getElementById("expression");
  const $keys = document.querySelector(".keys");
  const $toast = document.getElementById("toast");

  const $historyPanel = document.getElementById("historyPanel");
  const $historyList = document.getElementById("historyList");
  const $historyEmpty = document.getElementById("historyEmpty");
  const $overlay = document.getElementById("overlay");

  const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  let history = [];

  // ---------- 표시 ----------
  function formatNumber(numStr) {
    if (numStr === "Error") return numStr;
    // 소수점 이하는 그대로 두고 정수부에만 천단위 콤마
    const [intPart, decPart] = String(numStr).split(".");
    const sign = intPart.startsWith("-") ? "-" : "";
    const digits = sign ? intPart.slice(1) : intPart;
    const withComma = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let out = sign + withComma;
    if (decPart !== undefined) out += "." + decPart;
    return out;
  }

  function render() {
    $result.textContent = formatNumber(state.current);
    if (state.operator && state.previous !== null) {
      $expression.textContent =
        `${formatNumber(String(state.previous))} ${OP_SYMBOL[state.operator]}`;
    } else {
      $expression.textContent = "";
    }
  }

  function popResult() {
    $result.classList.remove("pop");
    void $result.offsetWidth; // 리플로우로 애니메이션 리셋
    $result.classList.add("pop");
  }

  // ---------- 입력 처리 ----------
  function inputDigit(d) {
    if (state.overwrite) {
      state.current = d === "." ? "0." : d;
      state.overwrite = false;
      return;
    }
    if (d === ".") {
      if (!state.current.includes(".")) state.current += ".";
      return;
    }
    if (state.current === "0") state.current = d;
    else state.current += d;
  }

  function chooseOperator(op) {
    // 이미 대기 연산자가 있고 새 입력이 있으면 먼저 계산
    if (state.operator && !state.overwrite) {
      compute();
    } else if (state.previous === null) {
      state.previous = parseFloat(state.current);
    }
    state.operator = op;
    state.overwrite = true;
    highlightOperator(op);
  }

  function compute() {
    if (state.operator === null || state.previous === null) return;
    const a = state.previous;
    const b = parseFloat(state.current);
    let res;
    switch (state.operator) {
      case "+": res = a + b; break;
      case "-": res = a - b; break;
      case "*": res = a * b; break;
      case "/":
        if (b === 0) { showError(); return; }
        res = a / b;
        break;
      default: return;
    }
    // 부동소수점 오차 정리
    res = Math.round((res + Number.EPSILON) * 1e10) / 1e10;

    const record = {
      expr: `${formatNumber(String(a))} ${OP_SYMBOL[state.operator]} ${formatNumber(String(b))}`,
      result: formatNumber(String(res)),
    };

    state.current = String(res);
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
    highlightOperator(null);

    addHistory(record);
    popResult();
  }

  function showError() {
    state.current = "Error";
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
    highlightOperator(null);
    render();
    popResult();
    toast("0으로 나눌 수 없어요");
    state.current = "0";
  }

  function negate() {
    if (state.current === "0" || state.current === "Error") return;
    state.current = state.current.startsWith("-")
      ? state.current.slice(1)
      : "-" + state.current;
  }

  function percent() {
    const val = parseFloat(state.current) / 100;
    state.current = String(val);
    state.overwrite = true;
  }

  function backspace() {
    if (state.overwrite || state.current === "Error") return;
    if (state.current.length <= 1 || (state.current.length === 2 && state.current.startsWith("-"))) {
      state.current = "0";
      state.overwrite = true;
    } else {
      state.current = state.current.slice(0, -1);
    }
  }

  function clearAll() {
    state.current = "0";
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
    highlightOperator(null);
  }

  function highlightOperator(op) {
    document.querySelectorAll(".key.op").forEach((btn) => {
      btn.classList.toggle("active", op !== null && btn.dataset.op === op);
    });
  }

  // ---------- 히스토리 ----------
  function addHistory(record) {
    history.unshift(record);
    if (history.length > 50) history.pop();
    renderHistory();
  }

  function renderHistory() {
    $historyList.innerHTML = "";
    $historyEmpty.style.display = history.length ? "none" : "block";
    history.forEach((h) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="h-expr">${h.expr} =</div><div class="h-res">${h.result}</div>`;
      li.addEventListener("click", () => {
        // 기록 결과를 현재 값으로 불러오기
        state.current = h.result.replace(/,/g, "");
        state.previous = null;
        state.operator = null;
        state.overwrite = true;
        highlightOperator(null);
        render();
        popResult();
        closeHistory();
      });
      $historyList.appendChild(li);
    });
  }

  function openHistory() {
    $historyPanel.classList.add("open");
    $historyPanel.setAttribute("aria-hidden", "false");
    $overlay.hidden = false;
  }
  function closeHistory() {
    $historyPanel.classList.remove("open");
    $historyPanel.setAttribute("aria-hidden", "true");
    $overlay.hidden = true;
  }

  // ---------- 복사 ----------
  async function copyResult() {
    const text = $result.textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast("복사됨: " + text);
    } catch {
      // 폴백
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("복사됨: " + text);
    }
  }

  // ---------- 토스트 ----------
  let toastTimer;
  function toast(msg) {
    $toast.textContent = msg;
    $toast.hidden = false;
    requestAnimationFrame(() => $toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      $toast.classList.remove("show");
      setTimeout(() => ($toast.hidden = true), 200);
    }, 1500);
  }

  // ---------- 버튼 클릭 애니메이션 ----------
  function flash(btn) {
    if (!btn) return;
    btn.classList.remove("flash");
    void btn.offsetWidth;
    btn.classList.add("flash");
  }

  // ---------- 이벤트: 키패드 ----------
  $keys.addEventListener("click", (e) => {
    const btn = e.target.closest("button.key");
    if (!btn) return;
    handleKey(btn);
  });

  function handleKey(btn) {
    flash(btn);
    if (btn.dataset.num !== undefined) {
      if (state.current === "Error") clearAll();
      inputDigit(btn.dataset.num);
    } else if (btn.dataset.op !== undefined) {
      if (state.current === "Error") return;
      chooseOperator(btn.dataset.op);
    } else {
      switch (btn.dataset.action) {
        case "dot": inputDigit("."); break;
        case "clear": clearAll(); break;
        case "negate": negate(); break;
        case "percent": percent(); break;
        case "backspace": backspace(); break;
        case "equals": compute(); break;
      }
    }
    render();
  }

  // ---------- 이벤트: 키보드 입력 ----------
  const KEY_MAP = {
    "0": '[data-num="0"]', "1": '[data-num="1"]', "2": '[data-num="2"]',
    "3": '[data-num="3"]', "4": '[data-num="4"]', "5": '[data-num="5"]',
    "6": '[data-num="6"]', "7": '[data-num="7"]', "8": '[data-num="8"]',
    "9": '[data-num="9"]',
    ".": '[data-action="dot"]',
    "+": '[data-op="+"]', "-": '[data-op="-"]',
    "*": '[data-op="*"]', "/": '[data-op="/"]',
    "%": '[data-action="percent"]',
    "Enter": '[data-action="equals"]', "=": '[data-action="equals"]',
    "Backspace": '[data-action="backspace"]',
    "Escape": '[data-action="clear"]',
  };

  document.addEventListener("keydown", (e) => {
    const sel = KEY_MAP[e.key];
    if (!sel) return;
    e.preventDefault();
    const btn = $keys.querySelector(sel);
    if (btn) handleKey(btn);
  });

  // ---------- 이벤트: 상단/패널/복사 ----------
  document.getElementById("themeToggle").addEventListener("click", () => {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
  });

  document.getElementById("historyToggle").addEventListener("click", openHistory);
  document.getElementById("closeHistory").addEventListener("click", closeHistory);
  $overlay.addEventListener("click", closeHistory);
  document.getElementById("clearHistory").addEventListener("click", () => {
    history = [];
    renderHistory();
  });
  document.getElementById("copyBtn").addEventListener("click", copyResult);

  // ---------- 초기 렌더 ----------
  render();
  renderHistory();
})();

(() => {
  "use strict";

  const resultEl = document.getElementById("result");
  const tapeEl = document.getElementById("tape");
  const keypad = document.querySelector(".keypad");

  const TAPE_PLACEHOLDER = "숫자를 눌러 보세요";
  const ERR_DIV_ZERO = "0으로는 못 나눠요";

  // ── 상태 ──────────────────────────────────────────────
  let current = "0";      // 화면에 입력 중인 숫자 (문자열)
  let previous = null;    // 직전 피연산자 (number)
  let operator = null;    // "+", "−", "×", "÷"
  let justEvaluated = false; // 방금 = 눌렀는지
  let isError = false;

  const OPS = {
    "+": (a, b) => a + b,
    "−": (a, b) => a - b,
    "×": (a, b) => a * b,
    "÷": (a, b) => a / b,
  };

  // ── 포맷 ──────────────────────────────────────────────
  const nf = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 12 });

  // 부동소수점 오차 정리
  function clean(n) {
    if (!Number.isFinite(n)) return n;
    return parseFloat(n.toPrecision(12));
  }

  // 표시용 콤마 포맷 (소수부는 콤마 없이 유지)
  function format(str) {
    if (str === "-" || str === "") return "0";
    // 지수 표기 등 정수 파싱 불가한 값은 숫자 포맷터에 위임
    if (/[eE]/.test(str)) {
      const n = Number(str);
      return Number.isFinite(n) ? nf.format(n) : str;
    }
    const neg = str.startsWith("-");
    const body = neg ? str.slice(1) : str;
    const [int, frac] = body.split(".");
    const intFmt = nf.format(BigInt(int || "0"));
    let out = (neg ? "-" : "") + intFmt;
    if (frac !== undefined) out += "." + frac;
    return out;
  }

  function numToInput(n) {
    // number → current 문자열 (콤마 없이)
    const c = clean(n);
    return Number.isFinite(c) ? String(c) : "0";
  }

  // ── 렌더 ──────────────────────────────────────────────
  function render() {
    resultEl.classList.toggle("is-error", isError);
    resultEl.textContent = isError ? current : format(current);

    if (isError) {
      tapeEl.textContent = "AC를 눌러 다시 시작해요";
    } else if (operator && previous !== null) {
      tapeEl.textContent = format(numToInput(previous)) + " " + operator;
    } else {
      tapeEl.textContent = TAPE_PLACEHOLDER;
    }
  }

  // ── 입력 처리 ─────────────────────────────────────────
  function resetAfterError() {
    current = "0";
    previous = null;
    operator = null;
    justEvaluated = false;
    isError = false;
  }

  function inputDigit(d) {
    if (isError) resetAfterError();
    if (justEvaluated) { current = "0"; justEvaluated = false; }
    if (current === "0") current = d;
    else if (current === "-0") current = "-" + d;
    else current += d;
  }

  function inputDot() {
    if (isError) resetAfterError();
    if (justEvaluated) { current = "0"; justEvaluated = false; }
    if (!current.includes(".")) current += ".";
  }

  function chooseOperator(op) {
    if (isError) return;
    if (operator && previous !== null && !justEvaluated) {
      compute();          // 연산자 연쇄: 앞의 것 먼저 계산
      if (isError) return;
    }
    previous = parseFloat(current);
    operator = op;
    justEvaluated = false;
    current = "0";
    // 다음 숫자를 새로 받도록 tape에 미리 표시
    render();
  }

  function compute() {
    if (operator === null || previous === null) return;
    const a = previous;
    const b = parseFloat(current);
    if (operator === "÷" && b === 0) {
      current = ERR_DIV_ZERO;
      isError = true;
      previous = null;
      operator = null;
      return;
    }
    const r = clean(OPS[operator](a, b));
    current = numToInput(r);
    previous = null;
    operator = null;
  }

  function equals() {
    if (isError || operator === null) return;
    const expr = `${format(numToInput(previous))} ${operator} ${format(current)} =`;
    compute();
    justEvaluated = true;
    if (!isError) {
      resultEl.classList.remove("is-error");
      tapeEl.textContent = expr;
      resultEl.textContent = format(current);
      return; // tape는 방금 식을 보여준 상태로 유지
    }
  }

  function del() {
    if (isError) { resetAfterError(); return; }
    if (justEvaluated) { justEvaluated = false; return; }
    if (current.length <= 1 || (current.length === 2 && current.startsWith("-"))) {
      current = "0";
    } else {
      current = current.slice(0, -1);
    }
  }

  function negate() {
    if (isError || current === "0") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
  }

  function percent() {
    if (isError) return;
    current = numToInput(parseFloat(current) / 100);
    justEvaluated = true;
  }

  function clearAll() {
    resetAfterError();
  }

  // ── 액션 디스패치 ─────────────────────────────────────
  function dispatch(action, data) {
    switch (action) {
      case "digit":   inputDigit(data.digit); break;
      case "dot":     inputDot(); break;
      case "op":      chooseOperator(data.op); return; // chooseOperator가 render 호출
      case "equals":  equals(); return;                // equals가 직접 표시
      case "delete":  del(); break;
      case "negate":  negate(); break;
      case "percent": percent(); break;
      case "clear":   clearAll(); break;
      default: return;
    }
    render();
  }

  // ── 마우스/터치 ───────────────────────────────────────
  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button.key");
    if (!btn) return;
    dispatch(btn.dataset.action, { digit: btn.dataset.digit, op: btn.dataset.op });
  });

  // ── 키보드 ────────────────────────────────────────────
  const KEY_MAP = {
    "*": "×", "x": "×", "X": "×",
    "/": "÷",
    "-": "−",
    "+": "+",
  };

  function flashKey(selector) {
    const btn = keypad.querySelector(selector);
    if (!btn) return;
    btn.classList.add("is-pressed");
    setTimeout(() => btn.classList.remove("is-pressed"), 120);
  }

  document.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k >= "0" && k <= "9") {
      dispatch("digit", { digit: k });
      flashKey(`[data-digit="${k}"]`);
    } else if (k === ".") {
      dispatch("dot", {});
      flashKey('[data-action="dot"]');
    } else if (k in KEY_MAP) {
      const op = KEY_MAP[k];
      dispatch("op", { op });
      flashKey(`[data-op="${op}"]`);
    } else if (k === "Enter" || k === "=") {
      e.preventDefault();
      dispatch("equals", {});
      flashKey('[data-action="equals"]');
    } else if (k === "Backspace") {
      dispatch("delete", {});
      flashKey('[data-action="delete"]');
    } else if (k === "Escape") {
      dispatch("clear", {});
      flashKey('[data-action="clear"]');
    } else if (k === "%") {
      dispatch("percent", {});
      flashKey('[data-action="percent"]');
    }
  });

  // ── 초기 렌더 ─────────────────────────────────────────
  render();
})();

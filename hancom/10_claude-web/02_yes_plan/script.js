// ===== 상태 =====
let current = "0";      // 현재 입력 중인 값(문자열)
let previous = null;    // 이전 피연산자(숫자)
let operator = null;    // 선택된 연산자 기호
let justEvaluated = false; // 방금 = 를 눌러 결과가 표시된 상태인지
let hasError = false;   // 오류 상태

// ===== DOM =====
const expressionEl = document.getElementById("expression");
const currentEl = document.getElementById("current");
const buttons = document.querySelector(".buttons");

// ===== 계산 함수 (eval 미사용) =====
function calculate(a, op, b) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b; // 0으로 나누기 → null(오류)
    default:  return b;
  }
}

// 부동소수점 오차 완화 + 보기 좋게 포맷
function format(num) {
  if (num === null || !isFinite(num)) return "오류";
  const rounded = parseFloat(num.toFixed(10));
  return String(rounded);
}

// ===== 화면 갱신 =====
function updateDisplay() {
  currentEl.textContent = current;
  if (operator !== null && previous !== null) {
    expressionEl.textContent = `${format(previous)} ${operator}`;
  } else {
    expressionEl.innerHTML = "&nbsp;";
  }
}

// ===== 초기화 =====
function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
  hasError = false;
  updateDisplay();
}

// ===== 숫자 / 소수점 입력 =====
function inputNumber(char) {
  if (hasError) clearAll();

  // 결과 직후 숫자를 누르면 새 계산 시작
  if (justEvaluated) {
    current = "0";
    previous = null;
    operator = null;
    justEvaluated = false;
  }

  if (char === ".") {
    if (current.includes(".")) return; // 소수점 중복 방지
    current += ".";
  } else if (current === "0") {
    current = char; // 앞자리 0 대체
  } else {
    current += char;
  }
  updateDisplay();
}

// ===== 연산자 입력 =====
function inputOperator(op) {
  if (hasError) return;

  // 이미 대기 중인 연산이 있으면 먼저 계산(연속 계산)
  if (operator !== null && previous !== null && !justEvaluated) {
    const result = calculate(previous, operator, parseFloat(current));
    if (result === null) return showError();
    previous = parseFloat(format(result));
  } else {
    previous = parseFloat(current);
  }

  operator = op;
  justEvaluated = false;
  current = "0";
  highlightOperator(op);
  updateDisplay();
}

// ===== 등호 =====
function evaluate() {
  if (operator === null || previous === null || hasError) return;

  const result = calculate(previous, operator, parseFloat(current));
  if (result === null) return showError();

  const formatted = format(result);
  expressionEl.textContent = `${format(previous)} ${operator} ${current} =`;
  current = formatted;
  previous = null;
  operator = null;
  justEvaluated = true;
  highlightOperator(null);
  currentEl.textContent = current;
}

// ===== 백스페이스 =====
function backspace() {
  if (hasError) return clearAll();
  if (justEvaluated) return; // 결과값은 통째로만 지움(C 사용)
  if (current.length <= 1 || (current.length === 2 && current.startsWith("-"))) {
    current = "0";
  } else {
    current = current.slice(0, -1);
  }
  updateDisplay();
}

// ===== 퍼센트 (현재값 ÷ 100) =====
function percent() {
  if (hasError) return;
  current = format(parseFloat(current) / 100);
  updateDisplay();
}

// ===== 오류 표시 =====
function showError() {
  current = "오류";
  previous = null;
  operator = null;
  hasError = true;
  highlightOperator(null);
  expressionEl.innerHTML = "&nbsp;";
  currentEl.textContent = current;
}

// ===== 연산자 버튼 강조 =====
function highlightOperator(op) {
  document.querySelectorAll(".btn--op").forEach((b) => {
    b.classList.toggle("is-active", op !== null && b.dataset.operator === op);
  });
}

// ===== 이벤트 위임 =====
buttons.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.number !== undefined) {
    inputNumber(btn.dataset.number);
  } else if (btn.dataset.operator !== undefined) {
    const op = btn.dataset.operator;
    if (op === "%") percent();
    else inputOperator(op);
  } else if (btn.dataset.action) {
    if (btn.dataset.action === "clear") clearAll();
    else if (btn.dataset.action === "backspace") backspace();
    else if (btn.dataset.action === "equals") evaluate();
  }
});

// ===== 키보드 입력 지원 =====
document.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/[0-9]/.test(k)) inputNumber(k);
  else if (k === ".") inputNumber(".");
  else if (k === "+") inputOperator("+");
  else if (k === "-") inputOperator("−");
  else if (k === "*") inputOperator("×");
  else if (k === "/") { e.preventDefault(); inputOperator("÷"); }
  else if (k === "%") percent();
  else if (k === "Enter" || k === "=") { e.preventDefault(); evaluate(); }
  else if (k === "Backspace") backspace();
  else if (k === "Escape") clearAll();
});

// 초기 렌더
updateDisplay();

const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

let current = "0";      // 현재 입력 중인 숫자
let previous = null;    // 이전 피연산자
let operator = null;    // 대기 중인 연산자
let resetNext = false;  // 다음 숫자 입력 시 화면 초기화 여부

const opSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function render() {
  currentEl.textContent = formatNumber(current);
  historyEl.textContent =
    previous !== null && operator
      ? `${formatNumber(previous)} ${opSymbols[operator]}`
      : "";
}

function formatNumber(value) {
  if (value === "Error") return value;
  const [intPart, decPart] = String(value).split(".");
  const sign = intPart.startsWith("-") ? "-" : "";
  const digits = intPart.replace("-", "");
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${sign}${grouped}.${decPart}` : `${sign}${grouped}`;
}

function inputNumber(num) {
  if (current === "Error") current = "0";
  if (resetNext) {
    current = num;
    resetNext = false;
  } else {
    current = current === "0" ? num : current + num;
  }
  render();
}

function inputDot() {
  if (resetNext) {
    current = "0.";
    resetNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  render();
}

function chooseOperator(nextOp) {
  if (current === "Error") return;
  if (operator && !resetNext) {
    compute();
  } else {
    previous = current;
  }
  operator = nextOp;
  resetNext = true;
  highlightOp(nextOp);
  render();
}

function compute() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = b === 0 ? "Error" : a / b; break;
  }
  if (result !== "Error") {
    result = Math.round(result * 1e10) / 1e10;
  }
  current = String(result);
  previous = null;
  operator = null;
  resetNext = true;
  highlightOp(null);
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  resetNext = false;
  highlightOp(null);
  render();
}

function toggleSign() {
  if (current === "Error" || current === "0") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  render();
}

function percent() {
  if (current === "Error") return;
  current = String(parseFloat(current) / 100);
  render();
}

function highlightOp(op) {
  document.querySelectorAll(".key-op").forEach((el) => {
    el.classList.toggle("active", op !== null && el.dataset.op === op);
  });
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else {
    switch (btn.dataset.action) {
      case "clear": clearAll(); break;
      case "sign": toggleSign(); break;
      case "percent": percent(); break;
      case "dot": inputDot(); break;
      case "equals": compute(); render(); break;
    }
  }
});

// 키보드 지원
document.addEventListener("keydown", (e) => {
  const k = e.key;
  if (k >= "0" && k <= "9") inputNumber(k);
  else if (k === ".") inputDot();
  else if (["+", "-", "*", "/"].includes(k)) chooseOperator(k);
  else if (k === "Enter" || k === "=") { e.preventDefault(); compute(); render(); }
  else if (k === "Escape") clearAll();
  else if (k === "%") percent();
});

// 테마 전환 (다크 <-> 라이트)
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "light" ? "☀️" : "🌙";
  localStorage.setItem("calc-theme", theme);
}

applyTheme(localStorage.getItem("calc-theme") || "dark");

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
});

render();

const display = document.getElementById('display');
const history = document.getElementById('history');
const btnGrid = document.querySelector('.btn-grid');

let state = {
  display: '0',
  pending: null,
  operator: null,
  shouldReplace: true,
};

// Format number for display (limit decimals)
function formatNumber(num) {
  if (num === '오류') return num;

  const n = parseFloat(num);
  if (isNaN(n)) return '0';

  // Round to 12 decimal places to avoid floating point errors
  const rounded = Math.round(n * 1e12) / 1e12;

  // Return as string, limiting display to ~12 characters
  let str = rounded.toString();
  if (str.length > 12) {
    // For very long strings, use scientific notation or truncate
    if (str.includes('.')) {
      const parts = str.split('.');
      str = parts[0].substring(0, 12);
    }
  }
  return str;
}

// Update display
function updateDisplay() {
  display.textContent = formatNumber(state.display);
}

// Update history
function updateHistory() {
  if (state.operator && state.pending !== null) {
    history.textContent = `${formatNumber(state.pending)} ${state.operator}`;
  } else {
    history.textContent = '';
  }
}

// Input digit
function inputDigit(digit) {
  if (state.display === '오류') {
    state.display = digit;
    state.shouldReplace = true;
    updateDisplay();
    return;
  }

  if (state.shouldReplace) {
    state.display = digit;
    state.shouldReplace = false;
  } else {
    // Prevent display overflow
    if (state.display.length < 12) {
      state.display += digit;
    }
  }
  updateDisplay();
}

// Input decimal point
function inputDot() {
  if (state.display === '오류') {
    state.display = '0.';
    state.shouldReplace = false;
    updateDisplay();
    return;
  }

  if (state.shouldReplace) {
    state.display = '0.';
    state.shouldReplace = false;
  } else if (!state.display.includes('.')) {
    state.display += '.';
  }
  updateDisplay();
}

// Input operator
function inputOperator(op) {
  if (state.display === '오류') {
    state.display = '0';
    state.pending = null;
    state.operator = null;
    state.shouldReplace = true;
    updateDisplay();
    updateHistory();
    return;
  }

  const current = parseFloat(state.display);

  if (state.pending !== null && state.operator && !state.shouldReplace) {
    // Chain operators: calculate intermediate result
    calculate();
  } else {
    state.pending = current;
  }

  state.operator = op;
  state.shouldReplace = true;
  updateHistory();
}

// Calculate result
function calculate() {
  if (state.display === '오류') return;
  if (state.pending === null || state.operator === null) return;

  const a = state.pending;
  const b = parseFloat(state.display);
  let result;

  switch (state.operator) {
    case '+':
      result = a + b;
      break;
    case '−':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      if (b === 0) {
        state.display = '오류';
        state.pending = null;
        state.operator = null;
        state.shouldReplace = true;
        updateDisplay();
        updateHistory();
        return;
      }
      result = a / b;
      break;
    default:
      return;
  }

  state.display = result.toString();
  state.pending = null;
  state.operator = null;
  state.shouldReplace = true;
  updateDisplay();
  updateHistory();
}

// Plus/Minus toggle
function inputPlusMinus() {
  if (state.display === '오류') return;

  const num = parseFloat(state.display);
  state.display = (num * -1).toString();
  state.shouldReplace = true;
  updateDisplay();
}

// Percent
function inputPercent() {
  if (state.display === '오류') return;

  const num = parseFloat(state.display);
  state.display = (num / 100).toString();
  state.shouldReplace = true;
  updateDisplay();
}

// All Clear
function inputAC() {
  state.display = '0';
  state.pending = null;
  state.operator = null;
  state.shouldReplace = true;
  updateDisplay();
  updateHistory();
}

// Event delegation
btnGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  if (btn.hasAttribute('data-digit')) {
    inputDigit(btn.dataset.digit);
  } else if (btn.hasAttribute('data-action')) {
    const action = btn.dataset.action;
    switch (action) {
      case 'dot':
        inputDot();
        break;
      case 'add':
        inputOperator('+');
        break;
      case 'subtract':
        inputOperator('−');
        break;
      case 'multiply':
        inputOperator('×');
        break;
      case 'divide':
        inputOperator('÷');
        break;
      case 'equals':
        calculate();
        break;
      case 'ac':
        inputAC();
        break;
      case 'plusMinus':
        inputPlusMinus();
        break;
      case 'percent':
        inputPercent();
        break;
    }
  }
});

// Initialize display
updateDisplay();
updateHistory();

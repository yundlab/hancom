const multiply = (num1, num2) => num1 * num2;
/*
// 중괄호 없는 버전 — num1 * num2 의 결과를 자동으로 return
const multiply = (num1, num2) => num1 * num2;

// 중괄호 있는 버전 — return 이 없으면 undefined 반환
const multiply = (num1, num2) => {
    num1 * num2;      // ❌ 계산만 하고 버림
};

// 중괄호 쓰려면 return 필요
const multiply = (num1, num2) => {
    return num1 * num2;  // ✅
};
*/

const a = document.querySelector('#a');
const b = document.querySelector('#b');
const out = document.querySelector('#out');

document.querySelector('#calc').addEventListener('click', () => {
    out.textContent = `${a.value} * ${b.value} = ${multiply(Number(a.value), Number(b.value))}`
});

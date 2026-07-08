const btn = document.querySelector('#btn');
const out = document.querySelector('#count');
let num = 0;

btn.addEventListener('click', () => {
    num++;
    out.textContent = `${num}번 눌렀어요`;
});
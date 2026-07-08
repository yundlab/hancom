const num = document.querySelector('#num');
const out = document.querySelector('#out');

document.querySelector('#run').addEventListener('click', () => {
    out.innerHTML = '';
    const count = Number(num.value);
    for (let i = 1; i <= count; i++) {
        const li = document.createElement('li');
        li.textContent = `${i}번째 사과`
        out.appendChild(li);
    }
})

document.querySelector('#down').addEventListener('click', () => {
    out.innerHTML = '';
    let i = Number(num.value);
    while (i > 0) {
        const li = document.createElement('li');
        li.textContent = i;
        out.appendChild(li);
        i--;
    }
})
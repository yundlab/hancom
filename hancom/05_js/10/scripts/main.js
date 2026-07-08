const greet = document.querySelector('#greet');
const name = document.querySelector('#name');

const saved = localStorage.getItem('name');
// getItem 저장된 값 꺼내기

if(saved) {
    greet.textContent = `안녕, ${saved}`
}

document.querySelector('#save').addEventListener('click', () => {
    const myName = name.value;
    if(!myName) {
        return;
    }
// setItem 브라우저 메모장에 저장
    localStorage.setItem('name', myName);
    greet.textContent = `안녕, ${myName}`
})

document.querySelector('#reset').addEventListener('click', () => {
    localStorage.removeItem('name');
    greet.textContent = `안녕하세요!`;
    name.value = '';
})
const nameInput = document.querySelector('#name');
const out = document.querySelector('#out');

document.querySelector('#greet').addEventListener("click", () => {
    let myName = nameInput.value;
    out.textContent = `안녕, ${myName}!`;
})
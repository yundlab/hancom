let person = {
    name: "콩이",
    age: 15, 
    play: "낮잠자기"
}

const out = document.querySelector('#out');

const render = () => {
    out.textContent = `${person.name} (${person.age}) - ${person.play}`;
};

render();

document.querySelector('#up').addEventListener('click', ()=>{
    person.age++;
    render();
})

document.querySelector('#rename').addEventListener('click', ()=>{
    if(person.name === '콩이') {
        person.name = "두부";
        render();    
    } else {
        person.name = "콩이";
        render();
    }
})

document.querySelector('#replay').addEventListener('click', () => {
    person.play = '수영하기';
    render();
})
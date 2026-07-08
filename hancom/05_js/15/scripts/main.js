// 클래스의 용도는 한마디로 같은 구조의 객체를 여러 개 만들어야 할 때, 그 틀을 한 번만 정의해두는 것
class Dog {
    constructor(name) {
        this.name = name;
    }
    bark() {
        return `${this.name}: 멍멍멍~`
    }
}

const out = document.querySelector('#out');

const poppy = new Dog("뽀삐");
const choco = new Dog("초코");

document.querySelector('#bark').addEventListener('click', () => {
  out.textContent = `${poppy.bark()} | ${choco.bark()}`  
})

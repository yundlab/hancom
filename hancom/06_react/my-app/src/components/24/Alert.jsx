const Alert = ({type, text}) => {
    // 중첩 객체 구조
    const map = {
        success : {icon: '✅', color: 'green'},
        error : {icon: '❌', color: 'red'},
        warning : {icon:'⚠️', color: 'orange'}
    }
    const cfg = map[type]
    return (
        <p style={{color:cfg.color}}>{cfg.icon} {text}</p>
    )
}

export default Alert


// 구조 분해 할당 (Destructuring Assignment)

// 객체나 배열에서 값을 꺼내 변수에 담는 문법입니다.

// ---
// 1. 객체 구조 분해

// 기본 방식 (기존)
// const user = { name: '홍길동', age: 25, job: '개발자' };

// const name = user.name;  // '홍길동'
// const age  = user.age;   // 25
// const job  = user.job;   // '개발자'

// 구조 분해 할당 (간결)
// const user = { name: '홍길동', age: 25, job: '개발자' };

// const { name, age, job } = user;

// console.log(name); // '홍길동'
// console.log(age);  // 25
// console.log(job);  // '개발자'

// ▎ 객체는 키 이름과 변수명이 같아야 합니다.

// ---
// 2. 이름 바꾸기 (별칭)

// const user = { name: '홍길동', age: 25 };

// const { name: userName, age: userAge } = user;

// console.log(userName); // '홍길동'
// console.log(userAge);  // 25

// 키이름: 새변수명 형태로 씁니다.

// ---
// 3. 기본값 설정

// const user = { name: '홍길동' };

// const { name, age = 0 } = user;
// // age가 없으면 기본값 0 사용

// console.log(name); // '홍길동'
// console.log(age);  // 0

// ---
// 4. 배열 구조 분해

// 배열은 순서로 꺼냅니다.

// const colors = ['red', 'green', 'blue'];

// const [first, second, third] = colors;

// console.log(first);  // 'red'
// console.log(second); // 'green'
// console.log(third);  // 'blue'

// 중간 건너뛰기:
// const [first, , third] = colors;
// // 빈 칸으로 건너뜀

// console.log(first); // 'red'
// console.log(third); // 'blue'

// ---
// 5. React에서 props 구조 분해 (아까 코드)

// // 구조 분해 없이
// const Alert = (props) => {
//     const type = props.type;
//     const text = props.text;
// }

// // 구조 분해 할당 사용
// const Alert = ({ type, text }) => {
//     // type, text 바로 사용 가능
// }

// 매개변수 자리에서 바로 분해하는 패턴입니다.

// ---
// 6. 중첩 객체 구조 분해

// const user = {
//     name: '홍길동',
//     address: {
//         city: '서울',
//         zip: '12345'
//     }
// };

// const { name, address: { city, zip } } = user;

// console.log(name); // '홍길동'
// console.log(city); // '서울'
// console.log(zip);  // '12345'

// ---
// 7. 함수 반환값에서 바로 분해

// function getUser() {
//     return { name: '홍길동', age: 25 };
// }

// const { name, age } = getUser();

// console.log(name); // '홍길동'

// ---
// 정리

// ┌───────┬──────────────────────┬─────────┐
// │ 종류  │         문법         │  기준   │
// ├───────┼──────────────────────┼─────────┤
// │ 객체  │ const { a, b } = obj │ 키 이름 │
// ├───────┼──────────────────────┼─────────┤
// │ 배열  │ const [a, b] = arr   │ 순서    │
// ├───────┼──────────────────────┼─────────┤
// │ props │ ({ a, b }) => {}     │ 키 이름 │
// └───────┴──────────────────────┴─────────┘

// 핵심은 "꺼내서 변수에 바로 담는다" 는 것, 코드가 훨씬 짧고 읽기 쉬워집니다.
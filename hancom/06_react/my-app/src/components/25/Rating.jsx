const Rating = ({score}) => {
    return (
        <>
            <div>
                {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < score ? '⭐' : '☆'}</span>
                ))}
            </div>
        </>
    )
}


export default Rating

//스프레드 연산자

// 스프레드 연산자 (Spread Operator) ...

// 배열이나 객체를 펼쳐서 개별 요소로 만드는 문법입니다.

// ---
// 1. 기본 개념

// const arr = [1, 2, 3];

// console.log(arr);    // [1, 2, 3]  ← 배열 그대로
// console.log(...arr); // 1 2 3      ← 펼쳐짐

// ---
// 2. 배열에서 사용

// 배열 합치기
// const a = [1, 2, 3];
// const b = [4, 5, 6];

// const merged = [...a, ...b];
// console.log(merged); // [1, 2, 3, 4, 5, 6]

// 배열 복사
// const original = [1, 2, 3];
// const copy = [...original];

// copy.push(4);

// console.log(original); // [1, 2, 3]  ← 원본 안 바뀜
// console.log(copy);     // [1, 2, 3, 4]

// 중간에 요소 추가
// const arr = [1, 2, 3];

// const newArr = [0, ...arr, 4, 5];
// console.log(newArr); // [0, 1, 2, 3, 4, 5]

// ---
// 3. 객체에서 사용

// 객체 합치기
// const user = { name: '홍길동', age: 25 };
// const job  = { job: '개발자', city: '서울' };

// const merged = { ...user, ...job };
// console.log(merged);
// // { name: '홍길동', age: 25, job: '개발자', city: '서울' }

// 객체 복사
// const original = { name: '홍길동', age: 25 };
// const copy = { ...original };

// copy.age = 30;

// console.log(original.age); // 25  ← 원본 안 바뀜
// console.log(copy.age);     // 30

// 일부 값만 덮어쓰기
// const user = { name: '홍길동', age: 25, job: '학생' };

// const updated = { ...user, job: '개발자' };
// // 뒤에 오는 값이 앞을 덮어씀

// console.log(updated);
// // { name: '홍길동', age: 25, job: '개발자' }

// ---
// 4. 함수 인자에서 사용

// function sum(a, b, c) {
//     return a + b + c;
// }

// const numbers = [1, 2, 3];

// console.log(sum(...numbers)); // 6
// // sum(1, 2, 3) 과 동일

// ---
// 5. React에서 props 전달

// const props = { type: 'success', text: '성공했습니다' };

// // 하나씩 전달
// <Alert type={props.type} text={props.text} />

// // 스프레드로 한 번에 전달
// <Alert {...props} />
// // 완전히 동일한 결과

// ---
// 6. 나머지 매개변수 (Rest) - 반대 개념

// ...이 함수 매개변수에 쓰이면 모으는 역할을 합니다.

// function sum(...numbers) {
//     // numbers = [1, 2, 3, 4, 5] 로 모아줌
//     return numbers.reduce((acc, num) => acc + num, 0);
// }

// console.log(sum(1, 2, 3, 4, 5)); // 15

// ---
// Spread vs Rest 비교

// ┌──────┬────────────────┬────────────────┐
// │      │   Spread ...   │    Rest ...    │
// ├──────┼────────────────┼────────────────┤
// │ 위치 │ 배열/객체 앞   │ 함수 매개변수  │
// ├──────┼────────────────┼────────────────┤
// │ 역할 │ 펼치기         │ 모으기         │
// ├──────┼────────────────┼────────────────┤
// │ 방향 │ 하나 → 여러 개 │ 여러 개 → 하나 │
// └──────┴────────────────┴────────────────┘

// // Spread: 펼치기
// const arr = [1, 2, 3];
// console.log(...arr); // 1  2  3

// // Rest: 모으기
// function fn(...args) {
//     console.log(args); // [1, 2, 3]
// }
// fn(1, 2, 3);

// ---
// 핵심 한 줄 요약

// ▎ ... 은 "이 안에 있는 걸 다 꺼내서 펼쳐라" 는 의미입니다.
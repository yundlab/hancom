const out = document.querySelector('#out');
const API = "http://localhost:3000/users";

console.log("스크립트 로드됨, out:", out);  // ← 추가

const show = (label, data) => {
    out.textContent = `${label}\n${JSON.stringify(data)}`;
};

const norm = (data) => 
    Array.isArray(data)
        ? data.map(u => ({ id: u.id, name: u.name }))
        : { id: data.id, name: data.name };

document.querySelector('#btn-create').addEventListener('click', async () => {
    console.log("버튼 클릭됨");  // ← 추가
    const res = await fetch(API, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "John" })
    });
    console.log("응답 받음:", res.status);  // ← 추가
    const data = await res.json();
    console.log("데이터:", data);  // ← 추가
    show("CREATE 결과", norm(data));
})

document.querySelector('#btn-read').addEventListener('click', async() => {
    const res = await fetch(API);
    const users = await res.json();
    show("READ 결과", norm(users));
})

document.querySelector('#btn-update').addEventListener('click', async () => {
    const res = await fetch(`${API}/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Jane" })
    });
    show("UPDATE 결과", norm(await res.json()));
});


document.querySelector('#btn-delete').addEventListener('click', async() => {
    await fetch(`${API}/1`, { method: "DELETE" });
    show("DELETE 결과", "1번 사용자 삭제됨")
})
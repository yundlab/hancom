const BASE = 'http://192.168.10.28:5000/hancom/한윤지/users'
const HEADERS = { 'Authorization': 'HANCOM', 'Content-Type': 'application/json' }

async function loadStudents() {
  const res = await fetch(BASE, { headers: HEADERS })
  const students = await res.json()
  render(students)
}

function render(students) {
  const grid = document.getElementById('grid')
  grid.innerHTML = ''  // 초기화 후 다시 그리기
  students.forEach(s => {
    const div = document.createElement('div')
    div.textContent = s.name

    div.onclick = async () => {
        const newName = prompt('새 이름을 입력하세요', s.name)
        if(!newName) return 

        await fetch(`${BASE}/${s.id}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify({ name:newName })
        })

        loadStudents()
    }
    grid.appendChild(div)
  })
  
}

loadStudents()



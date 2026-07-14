const input = document.getElementById('q')
const send = document.getElementById('btn')
const answer = document.getElementById('ans')

send.addEventListener('click', () => {
    answer.textContent = '생각 중...'
    const prompt = q.value
    fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ prompt })
    })
    .then(res => res.json())
    .then(data => {answer.textContent = data.reply || data.error })
    .catch(() => {answer.textContent = 'X 서버 안 켜짐? (server서 node index.js 먼저)'        
    })
})
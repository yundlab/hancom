const q = document.getElementById('q')
const btn = document.getElementById('btn')
const chat = document.getElementById('chat')
const clearBtn = document.getElementById('clear')

// 말풍선 하나를 만들어 대화창에 추가하고, 그 요소를 돌려준다
function addMsg(text, who) {
    const div = document.createElement('div')
    div.className = 'msg ' + who   // who: 'me'(질문) 또는 'ai'(응답)
    div.textContent = text
    chat.appendChild(div)
    chat.scrollTop = chat.scrollHeight   // 항상 맨 아래로 스크롤
    return div
}

async function sendMessage() {
    const prompt = q.value.trim()
    if (!prompt) return

    addMsg(prompt, 'me')          // 1. 내 질문 쌓기
    q.value = ''

    const aiBubble = addMsg('생각 중...', 'ai')   // 2. AI 자리 먼저 만들고

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        })
        const data = await res.json()
        aiBubble.textContent = data.reply || data.error || '응답 없음'  // 3. 응답 채우기
    } catch {
        aiBubble.textContent = 'X 서버 안 켜짐? (node index.js 먼저 실행)'
    }
    chat.scrollTop = chat.scrollHeight
}

btn.addEventListener('click', sendMessage)
// 엔터로도 전송 (채팅답게)
q.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage()
})

// 대화 지우기: chat 안의 말풍선을 전부 비운다
clearBtn.addEventListener('click', () => {
    if (confirm('대화 내역을 모두 지울까요?')) {
        chat.innerHTML = ''   // 쌓인 말풍선 전부 제거 → 초기화
    }
})

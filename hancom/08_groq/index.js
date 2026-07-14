require('dotenv').config()
const express = require('express')
const app = express()
const key = process.env.GROQ_API_KEY

app.use(express.json())
app.use(express.static('public'))

app.post('/chat', async (req, res) => {
    const { message } = req.body

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: "user", content: message }]
        })
    })

    const data = await groqRes.json()
    const answer = data.choices?.[0]?.message?.content || "응답 없음"
    res.json({ answer })
})

app.listen(3000, () => console.log('http://localhost:3000'))
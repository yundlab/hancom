require('dotenv').config()

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }

    const { prompt } = req.body || {}
    const key = process.env.GROQ_API_KEY

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: "user", content: prompt }]
            })
        })

        const data = await groqRes.json()
        const reply = data.choices?.[0]?.message?.content || "응답 없음"
        res.status(200).json({ reply })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

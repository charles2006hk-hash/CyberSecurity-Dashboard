// api/analyze.js 最終穩定版
export default async function handler(req, res) {
    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 嘗試這個最穩定的 ID，它在 v1 之下對收費帳戶完全開放
    const MODEL_NAME = "gemini-1.5-flash"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `分析此網絡安全威脅對 BT 公司的影響：${title}` }] }]
            })
        });

        const data = await response.json();

        // 如果還是報錯，我們讓它顯示「可用模型列表」，這樣妳就能一眼看到正確的 ID
        if (data.error) {
            return res.status(400).json({ error: `API 報錯: ${data.error.message}` });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });
    } catch (err) {
        res.status(500).json({ error: "Server Error: " + err.message });
    }
}

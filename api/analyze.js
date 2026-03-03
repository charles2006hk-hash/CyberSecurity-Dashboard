// api/analyze.js 核心修正
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 2026 最新收費版模型名稱
    const MODEL_NAME = "gemini-3-flash"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `你是一位在澳洲 BT 公司工作的高級 SOC 分析師。請針對此標題進行深度威脅分析：
                        1. 潛在風險點（針對電信基礎設施）
                        2. 建議在 SOC Prime 搜尋的關鍵字。
                        請用專業、簡煉的中文回答（80字內）。標題：${title}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: `API 錯誤: ${data.error.message}` });
        }

        // 確保提取路徑正確
        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });

    } catch (err) {
        res.status(500).json({ error: "伺服器執行錯誤: " + err.message });
    }
}

// api/analyze.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 收費版建議使用 v1 正式路徑
    // 模型建議用 gemini-2.0-flash 或 gemini-1.5-flash-latest
    const MODEL = "gemini-2.0-flash"; 
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `你是一位為 BT 公司工作的資深 SOC 分析師。請針對此威脅標題進行深度分析：
                        1. 潛在風險點（針對電信基礎設施）
                        2. 建議在 SOC Prime 搜尋的關鍵字或 Sigma 規則方向。
                        內容請精簡在 80 字內。標題：${title}` 
                    }] 
                }],
                generationConfig: {
                    temperature: 0.4, // 降低隨機性，讓分析更專業穩定
                    maxOutputTokens: 200
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(data.error.code || 500).json({ error: data.error.message });
        }

        // 提取 AI 回傳內容
        const aiResponse = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiResponse });

    } catch (err) {
        res.status(500).json({ error: "系統運行錯誤: " + err.message });
    }
}

// api/analyze.js
export default async function handler(req, res) {
    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 確保這裡的模型名稱是 gemini-3-flash
    const MODEL_NAME = "gemini-3-flash"; 

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `作為網絡安全專家，請針對此新聞標題進行簡短分析（50字內）："${title}"。請說明對大型電信公司的威脅點及建議監控方向。` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        // 檢查 API 是否回傳錯誤訊息（例如 Key 沒設對）
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '伺服器內部錯誤' });
    }
}

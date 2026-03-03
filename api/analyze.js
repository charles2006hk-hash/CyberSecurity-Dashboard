export default async function handler(req, res) {
    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // 從環境變數讀取，外部看不到

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `作為網路安全專家，請針對此新聞標題進行簡短分析（50字內）："${title}"。請說明對大型電信公司的威脅點及建議監控方向。` }] }]
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'AI 分析失敗' });
    }
}

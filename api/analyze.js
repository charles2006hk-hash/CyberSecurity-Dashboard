// api/analyze.js
export default async function handler(req, res) {
    // 1. 設置標頭，允許跨域 (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: '請使用 POST 請求' });
    }

    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 2. 檢查關鍵環境變數
    if (!API_KEY) {
        return res.status(500).json({ error: '伺服器未設定 GEMINI_API_KEY，請在 Vercel Settings 檢查' });
    }

    // 3. 呼叫 Gemini (使用目前最穩定的 1.5-flash 標識符)
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `你是一位資深網絡安全分析師，請針對以下新聞標題提供簡短的威脅分析（50字內）："${title}"` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // 如果 Google API 回報錯誤（例如 Key 無效）
            return res.status(400).json({ error: `Google API 錯誤: ${data.error.message}` });
        }

        return res.status(200).json(data);
    } catch (err) {
        // 捕捉程式碼崩潰原因
        return res.status(500).json({ error: `伺服器內部崩潰: ${err.message}` });
    }
}

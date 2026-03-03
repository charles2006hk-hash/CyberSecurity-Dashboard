// api/analyze.js
export default async function handler(req, res) {
    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 2026 免費版最推薦名稱
    const MODEL_NAME = "gemini-2.0-flash"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `分析此標題的網絡安全威脅：${title}` }] }]
            })
        });

        const rawData = await response.text(); // 先取純文字，防止 JSON 解析失敗
        let data;
        try {
            data = JSON.parse(rawData);
        } catch (e) {
            return res.status(500).json({ error: "Google API 回傳非 JSON 格式", details: rawData });
        }

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        // 確保路徑正確提取文字
        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });
    } catch (error) {
        res.status(500).json({ error: "後端執行錯誤: " + error.message });
    }
}

// api/analyze.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 根據您的 available_models 清單，使用這個絕對不會錯的名字
    const MODEL_PATH = "models/gemini-3-flash-preview"; 
    
    // 注意：既然清單包含了 "models/"，URL 拼接要精確
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${MODEL_PATH}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `你是一位資深網路安全專家，請針對此新聞標題進行專業威脅分析（80字內）："${title}"` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });

    } catch (err) {
        res.status(500).json({ error: "執行錯誤: " + err.message });
    }
}

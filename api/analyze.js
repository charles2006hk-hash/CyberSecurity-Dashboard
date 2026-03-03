// api/analyze.js
export default async function handler(req, res) {
    const { title } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL_PATH = "models/gemini-3-flash-preview"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${MODEL_PATH}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `You are a Senior SOC Lead at BT. Analyze this threat title in BOTH Chinese and English. 
                        Format: 
                        [Risk / 風險分析]: (Max 40 words each)
                        [Action / 建議行動]: (Focus on SOC Prime keywords/Sigma rules)
                        
                        Title: "${title}"` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } catch (err) {
        res.status(500).json({ error: "Analysis failed" });
    }
}

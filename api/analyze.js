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
                        text: `You are a Senior SOC Lead at BT. Analyze this: "${title}". 
                        Return JSON format:
                        {
                          "impact": (1-5 numerical value),
                          "likelihood": (1-5 numerical value),
                          "analysis_en": "English analysis",
                          "analysis_zh": "中文分析",
                          "action": "Suggested SOC action",
                          "category": "Identity/Malware/Infrastructure"
                        }` 
                    }] 
                }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Analysis failed" });
    }
}

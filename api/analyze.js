// api/analyze.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

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
                        text: `You are a Senior SOC Lead at BT. Analyze: "${title}". 
                        Estimate the likely origin or targeted region of this threat.
                        Return strict JSON:
                        {
                          "impact": (1-5), 
                          "likelihood": (1-5),
                          "analysis_en": "English analysis (Max 30 words)", 
                          "analysis_zh": "中文分析 (Max 30 words)",
                          "action": "SOC Action", 
                          "category": "Identity/Malware/Infra",
                          "geo_lat": (Latitude float between -90 and 90),
                          "geo_lng": (Longitude float between -180 and 180)
                        }` 
                    }] 
                }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        res.status(200).json(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (err) { res.status(500).json({ error: "Analysis failed" }); }
}

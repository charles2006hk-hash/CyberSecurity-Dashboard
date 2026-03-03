// api/analyze.js (偵錯專用)
export default async function handler(req, res) {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    try {
        // 請求 Google 列出所有妳這把 Key 權限內可用的模型
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        // 直接回傳模型清單給網頁
        res.status(200).json({ 
            message: "請從以下清單選擇一個支援 generateContent 的模型名稱",
            available_models: data.models ? data.models.map(m => m.name) : "無可用模型"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

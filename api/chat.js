export default async function handler(req, res) {
  // Add CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    // Preflight request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Missing learner message" });
    }

    const systemPrompt = `
You are an expert workplace communication coach.
Evaluate the learner's email reply to a colleague's request using this rubric:
1. Empathy – Acknowledges and understands the colleague's need.
2. Clarity – Communicates limits and availability clearly.
3. Next Steps – Offers an alternative or partial help.

Give ONE single score out of 5 (whole numbers only) and 2–3 specific improvement tips.
Respond in this exact format (no extra explanation):
Score: X/5
Feedback:
- tip 1
- tip 2
- tip 3
`;

    // Call OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.2,
        max_tokens: 300
      })
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, text);
      return res.status(502).json({ error: "Error from OpenAI", details: text });
    }

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}

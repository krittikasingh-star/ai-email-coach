// api/chat.js  (Vercel serverless function)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing learner message" });

    const systemPrompt = `
You are an expert workplace communication coach. You will be given:
1. The original email the learner is replying to.
2. The learner's reply.
Evaluate the learner's email reply to a colleague's request using this rubric:

SCORING RUBRIC (Score out of 5 – whole numbers only):
1. Empathy – 1-2: No acknowledgement of the colleague’s needs or context. 3: Minimal or generic acknowledgment. 4: Acknowledges needs and shows understanding, but tone is lacking empathy. 5: Clearly shows understanding, validates the colleague’s situation, and uses warm, professional and empathetic tone.
2. Clarity – 1-2: Confusing, missing key details, or vague. 3-4: Mostly clear but some ambiguity in limits, availability, or next actions. 5: Clear about what can/cannot be done and suggests a reasonable path forward. 

SCORING GUIDE:
5 = 4+ in both categories.
4 = Strong overall (average score above 4) but missing a small element (score 3) in either empathy or clarity.
3 = Gaps in both categories (average score between 3 & 4)
2 = Weak in both categories, needs significant improvement.
1 = Barely meets any criteria.
0 = Completely off-target.

FEEDBACK RULES:
- Give exactly 2 feedback points, one tied to each rubric category.
- Be concrete and specific, pointing to what in the email could be improved and how.
- Avoid vague advice like "be clearer" — instead, give an example or phrasing suggestion.
- If the email scored 5/5 in a category, still reinforce what was done well in that category.

Respond in this exact format (no extra explanation):
Score: X/5
Feedback:
Empathy: 
Clarity:
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

    // Extract numeric score from "Score: X/5"
    let scoreMatch = reply.match(/Score:\s*(\d)\/5/i);
    let score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

    return res.status(200).json({ reply, AIScore: score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

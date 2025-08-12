// api/chat.js  (Vercel serverless function)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing learner message" });

    const systemPrompt = `
You are an expert workplace communication coach.
You will be given:
1. The original email the learner is replying to.
2. The learner's reply.

Evaluate the learner's reply in the context of the original email using this rubric:

CATEGORY CRITERIA:
1. Empathy – 
   1–2: No acknowledgement of the colleague’s needs or context.  
   3: Minimal or generic acknowledgment.  
   4: Acknowledges needs and shows understanding, but tone lacks warmth or empathy.  
   5: Clearly shows understanding, validates the colleague’s situation, and uses a warm, professional, and empathetic tone.

2. Clarity – 
   1–2: Confusing, missing key details, or vague.  
   3–4: Mostly clear but with some ambiguity in limits, availability, or next actions.  
   5: Crystal clear about what can/cannot be done and suggests a reasonable, actionable path forward.

SCORING METHOD:
- First, assign each category a score from 1–5.  
- Then calculate the average of the two scores.  
- Round the average to the nearest whole number to determine the final Score (X/5).  

SCORING GUIDE:
5 = Both categories score 4 or 5, with an average of 4.5 or higher.  
4 = Strong overall but one category scores 3.  
3 = Both categories have notable gaps (average 3.0–3.4).  
2 = Weak in both categories (average 2.0–2.9).  
1 = Barely meets any criteria.  
0 = Completely off-target.

FEEDBACK RULES:
- Give exactly 2 feedback points, one labeled "Empathy:" and one labeled "Clarity:".
- Be concrete and specific, pointing to what in the email could be improved and how.
- Avoid vague advice like "be clearer" — instead, give an example or phrasing suggestion.
- If the category score is 5, reinforce what was done well.

Respond in this exact format (no extra explanation):
Score: X/5
Empathy: [feedback]
Clarity: [feedback]
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
      const text = await await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, text);
      return res.status(502).json({ error: "Error from OpenAI", details: text });
    }

    const data = await openaiRes.json();
    const rawReply = data?.choices?.[0]?.message?.content ?? "";

    // Extract numeric score from "Score: X/5"
    let scoreMatch = rawReply.match(/Score:\s*(\d)\/5/i);
    let score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

    // Remove the score line from feedback text
    let feedbackOnly = rawReply.replace(/Score:\s*\d\/5\s*/i, "").trim();

    // Return clean feedback and separate score
    return res.status(200).json({ reply: feedbackOnly, AIScore: score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

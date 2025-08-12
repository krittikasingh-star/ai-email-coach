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

Evaluate the reply using this rubric, applying the provided learning material:

LEARNING MATERIAL:

Empathy — 3 Key Points:
1. Start with Acknowledgement: Recognise the reader’s perspective or feelings before getting to the main point.
2. Mind Your Tone: Use collaborative, respectful language; avoid giving commands.
3. End on a Positive Note: Close with appreciation and an offer of help.

Clarity — 3 Key Points:
1. State the Purpose Early: Put the main point or request in the first few lines.
2. Use Simple Structure: Short paragraphs, bullet points, and headings for quick reading. (not relevant here)
3. Be Action-Oriented: End with explicit, realistic next steps.

SCORING:
Score Empathy and Clarity each from 1–5, giving the benefit of the doubt for partial effort:
- 1: No attempt or completely off-base.
- 2: Minimal or unclear attempt.
- 3: Partial application of the points.
- 4: Good application of most points, some improvements possible.
- 5: Excellent application, all or nearly all points followed.
Keep in mind that feedback points relevant to longer email in terms of structure (bullet points, headings, etc.) will not be penalized as these exercises require short replies.

FINAL SCORE (X/5):
Average the two category scores, rounding to the nearest whole number.

FEEDBACK RULES:
- Give exactly 2 feedback sections, labeled "Empathy:" and "Clarity:".
- In each section:
  - Reference the specific learning material points followed or missed.
  - Quote or paraphrase the learner’s wording where relevant.
  - Give one positive observation (when relevant) and one concrete improvement.
- Be encouraging and specific, avoiding generic advice.
- Dont need to give feedback on every point, just the most relevant ones.

Respond in this format (no extra explanation):
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
        temperature: 0.3, // slightly higher to make feedback warmer
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

    // Return full feedback with score + numeric score for tracking
    return res.status(200).json({ reply, AIScore: score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

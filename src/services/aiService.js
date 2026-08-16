const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export const aiService = {
  analyzeTask: async (taskTitle) => {
    if (!GROQ_API_KEY) {
      console.warn('Groq API Key is missing. Falling back to default category.');
      return { category: 'AGI', isAnomaly: false };
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          response_format: { type: "json_object" },
          messages: [
            {
              role: 'system',
              content: `You are an RPG Gamification AI. You have two jobs:
1. Categorize the given task title into exactly ONE of these 5 categories based on its intent:
- STR: Strength, working out, physical health, sports.
- INT: Intelligence, study, reading, coding, learning.
- CHA: Charisma, socializing, meeting friends, networking.
- VIT: Vitality, sleeping, eating healthy, mental health, self-care.
- AGI: Agility, chores, cleaning, organizing, errands.

2. Detect anomalies. A task is an anomaly if it is:
- Gibberish (e.g. "asdfgh", "hdbsad")
- Self-sabotage / harmful (e.g. "makan racun", "merokok sebungkus")
- Completely nonsensical for a productivity app.

Respond ONLY with a valid JSON object in this exact format:
{
  "category": "STR" | "INT" | "CHA" | "VIT" | "AGI",
  "isAnomaly": boolean,
  "anomalyReason": "Short explanation in Indonesian if anomaly is true, otherwise empty string"
}`
            },
            {
              role: 'user',
              content: `Task: "${taskTitle}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 150
        })
      });

      const data = await response.json();
      
      if (data?.choices && data.choices.length > 0) {
        const jsonStr = data.choices[0].message.content;
        try {
          const result = JSON.parse(jsonStr);
          const validCategories = ['STR', 'INT', 'CHA', 'VIT', 'AGI'];
          if (validCategories.includes(result.category)) {
            return {
              category: result.category,
              isAnomaly: !!result.isAnomaly,
              anomalyReason: result.anomalyReason || ''
            };
          }
        } catch (e) {
          console.error('Failed to parse AI JSON:', e);
        }
      }
      return { category: 'AGI', isAnomaly: false }; // Default fallback
    } catch (error) {
      console.error('AI analysis error:', error);
      return { category: 'AGI', isAnomaly: false };
    }
  }
};

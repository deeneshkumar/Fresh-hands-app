const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function sendToGemini(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a friendly customer support assistant for the app "Fresh Hands".

Your role:
- Help users with OTP login issues, bookings, payments, cancellations, and service partners
- Use simple Indian English
- Be polite, calm, and helpful
- If user greets, greet back
- If OTP issue, give clear steps
- Never say you are an AI
- Never invent order details

User message:
${userMessage}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log('Gemini raw response:', JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join(' ')
        ?.trim();

    return text || "Sorry, I couldn’t understand that. Can you rephrase?";
  } catch (error) {
    console.error('Gemini error:', error);
    return 'Something went wrong. Please try again in a moment.';
  }
}

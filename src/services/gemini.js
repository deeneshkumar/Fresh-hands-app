const GEMINI_API_KEY = 'AIzaSyBjyXTCWTHqsDtqgPNvtDCEpN4mtBGopn4'; // ⚠️ move this to env later

// Use a valid, supported model:
const MODEL_NAME = 'gemini-1.5-flash';
// or: const MODEL_NAME = 'gemini-1.5-pro';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export const sendMessageToGemini = async (message) => {
    try {
        console.log("Sending message to Gemini...");

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: message }
                        ]
                    }
                ]
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error Details:', JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || 'Error from Gemini API');
        }

        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0].text
        ) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.log('Unexpected Gemini response format:', JSON.stringify(data, null, 2));
            return "I'm sorry, I couldn't understand that. Please try again.";
        }

    } catch (error) {
        console.error('Gemini Request Failed:', error);
        return "I'm having trouble connecting to the support AI. Please ensure you have internet access.";
    }
};

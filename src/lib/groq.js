const axios = require("axios");

async function groq({ message, instruction = "", sessionId = null }) {
    if (!message) throw new Error("Message kosong");

    let messages = [];

    // restore session
    if (sessionId) {
        try {
            messages = JSON.parse(
                Buffer.from(sessionId, "base64").toString()
            );
        } catch {
            messages = [];
        }
    }

    // system instruction
    if (instruction && messages.length === 0) {
        messages.push({
            role: "system",
            content: instruction
        });
    }

    messages.push({
        role: "user",
        content: message
    });

    const { data } = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama-3.1-70b-versatile",
            messages,
            temperature: 0.7,
            max_tokens: 1024
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    const reply = data.choices[0].message.content;

    messages.push({
        role: "assistant",
        content: reply
    });

    return {
        text: reply,
        sessionId: Buffer.from(JSON.stringify(messages)).toString("base64")
    };
}

module.exports = groq;
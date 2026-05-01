const axios = require("axios");
require("dotenv").config();

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

async function chatCompletion(messages, model = "mistralai/mixtral-8x7b-instruct") {
  try {
    console.log("🔑 API KEY:", process.env.OPENROUTER_API_KEY);

    const res = await axios.post(
      ENDPOINT,
      {
        model,
        messages,
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://ai-powered-mock-interiview-3.onrender.com/",
          "X-Title": "InterviewPrepAI",
        },
        timeout: 30000,
      }
    );

    return res.data.choices[0].message.content.trim();

  } catch (err) {
    console.error("❌ OpenRouter error →", err.response?.data || err.message);
    throw new Error("AI request failed");
  }
}

module.exports = { chatCompletion };
const fetch = require("node-fetch");

exports.handler = async (event) => {
   const headers = {
    "Access-Control-Allow-Origin": "https://www.unitedsupport508.com", // your production domain
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // 🔁 Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  try {
    const { message, context } = JSON.parse(event.body);
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          { role: "system", content: "You are a helpful assistant for a website that supports 508(c)(1)(A) trusts and online churches." },
          { role: "user", content: `Context: ${context}\n` }
          //{ role: "user", content: `Context: ${context}\n\nUser question: ${message}` }
          //{ content: context } 
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch OpenAI response", detail: err.message }),
    };
  }
};

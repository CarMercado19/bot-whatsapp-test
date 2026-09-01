const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fetchGemini(textoMensaje) {
    const timerStart = performance.now();

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(textoMensaje);
    const message = result.response.text();

    const timerEnd = performance.now();
    const timerResult = ((timerEnd - timerStart) / 1000).toFixed(2);

    return {
        message,
        timerResult
    };
}

module.exports = { fetchGemini };
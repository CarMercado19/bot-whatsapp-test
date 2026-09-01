require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const chatSessions = new Map();
const RUTA_MEMORIA = './chatLogs.json';

function loadMemory() {
    if (fs.existsSync(RUTA_MEMORIA)) {
        const datos = fs.readFileSync(RUTA_MEMORIA, 'utf-8');
        return JSON.parse(datos);
    }
    return {};
}

// Cargamos toda la memoria guardada al encender el bot
const diskMemory = loadMemory();

async function fetchGemini(userMessage, userId) {
    if (!chatSessions.has(userId)) {
        console.log(`📝 Iniciando sesión de memoria para: ${userId}`);

        const previousHistory = diskMemory[userId] || [];

        chatSessions.set(userId, model.startChat({
            history: previousHistory
        }));
    }

    const usersChat = chatSessions.get(userId);
    const timerStart = performance.now();

    const result = await usersChat.sendMessage(userMessage);
    const message = result.response.text();

    const timerEnd = performance.now();
    const timerResult = ((timerEnd - timerStart) / 1000).toFixed(2);

    diskMemory[userId] = await usersChat.getHistory();
    fs.writeFileSync(RUTA_MEMORIA, JSON.stringify(diskMemory, null, 2));

    return {
        message,
        timerResult
    };
}

module.exports = { fetchGemini };
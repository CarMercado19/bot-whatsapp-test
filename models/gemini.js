require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Definimos los modelos en orden de preferencia
const AVAILABLE_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.5-flash"
];

const MEMORY_ROUTE = './chatLogs.json';

function loadMemory() {
    if (fs.existsSync(MEMORY_ROUTE)) {
        const data = fs.readFileSync(MEMORY_ROUTE, 'utf-8');
        return JSON.parse(data);
    }
    return {};
}

const diskMemory = loadMemory();

async function fetchGemini(userMessage, userId) {
    const timerStart = performance.now();
    const previousHistory = diskMemory[userId] || [];

    let message = "";
    let successfulChat = null;

    // 2. Intentamos responder iterando sobre los modelos disponibles
    for (const modelName of AVAILABLE_MODELS) {
        try {
            // Instanciamos el modelo y el chat específico para este intento
            const model = genAI.getGenerativeModel({ model: modelName });
            const usersChat = model.startChat({ history: previousHistory });

            const result = await usersChat.sendMessage(userMessage);
            message = result.response.text();

            successfulChat = usersChat;
            console.log(`✅ IA respondida con: ${modelName}`);
            break; // Rompemos el ciclo si tuvo éxito

        } catch (error) {
            console.log(`⚠️ ${modelName} saturado/falló. Cambiando de modelo...`);

            // Si es el último modelo de la lista y falla, lanzamos el error a index.js
            if (modelName === AVAILABLE_MODELS[AVAILABLE_MODELS.length - 1]) {
                throw error;
            }
        }
    }

    const timerEnd = performance.now();
    const timerResult = ((timerEnd - timerStart) / 1000).toFixed(2);

    // 3. Guardamos el historial solo si algún modelo logró responder
    if (successfulChat) {
        diskMemory[userId] = await successfulChat.getHistory();
        fs.writeFileSync(MEMORY_ROUTE, JSON.stringify(diskMemory, null, 2));
    }

    return {
        message,
        timerResult
    };
}

module.exports = { fetchGemini };
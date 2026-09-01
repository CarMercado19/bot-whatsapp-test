require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { fetchGemini } = require('./models/gemini');
const { whitelist} = require('./models/whitelist')

const timerBotStart = Math.floor(Date.now() / 1000);

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Escanea este código QR desde "Dispositivos vinculados" en tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Bot conectado exitosamente y listo para pensar con IA!');
});

client.on('message', async (msg) => {
    if (msg.timestamp < timerBotStart) {
        console.log('🛑 Mensaje antiguo ignorado:', msg.body);
        return;
    }

    console.log('ID del remitente:', msg.from);

    if (!whitelist.includes(msg.from)) {
        console.log(`🔒 Mensaje de número no autorizado ignorado: ${msg.from}`);
        return;
    }

    const userMessage = msg.body;
    console.log('🙍 Mensaje del usuario:', userMessage);

    try {
        await msg.reply('⏳ Generando respuesta...');

        const aiModel = await fetchGemini(userMessage);

        console.log(`⏱️ Tiempo de procesamiento: ${aiModel.timerResult}s`);
        console.log('🤖 Respuesta de la IA:', aiModel.message);

        await msg.reply(aiModel.message);

        console.log("===================================\n");

    } catch (error) {
        console.error('Hubo un error con la IA:', error);
        await msg.reply('Lo siento, mi cerebro artificial tuvo un problema de conexión. Intenta de nuevo.');
    }
});

console.log('Iniciando sistema...');
client.initialize();
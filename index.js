// 1. Cargar las variables de entorno secretas (tu archivo .env)
require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 2. Importar la herramienta oficial de Google
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 3. Configurar la IA usando tu llave secreta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuración del Cliente de WhatsApp
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
    const textoMensaje = msg.body;
    console.log('🙍 Mensaje del usuario:', textoMensaje);

    try {
        await msg.reply('⏳ Generando respuesta...');

        const tiempoInicio = performance.now();

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });

        const resultado = await model.generateContent(textoMensaje);
        const respuestaIA = resultado.response.text();

        const tiempoFin = performance.now();

        const segundos = ((tiempoFin - tiempoInicio) / 1000).toFixed(2);

        console.log(`⏱️ Tiempo de procesamiento: ${segundos}s`);
        console.log('🤖 Respuesta de la IA:', respuestaIA);

        await msg.reply(respuestaIA);

    } catch (error) {
        console.error('Hubo un error con la IA:', error);
        await msg.reply('Lo siento, mi cerebro artificial tuvo un problema de conexión. Intenta de nuevo.');
    }
});

console.log('Iniciando sistema...');
client.initialize();
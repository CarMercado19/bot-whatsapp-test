require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { fetchGemini } = require('./gemini');

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

        const respuestaIA = await fetchGemini(textoMensaje);

        console.log(`⏱️ Tiempo de procesamiento: ${respuestaIA.tiempo}s`);
        console.log('🤖 Respuesta de la IA:', respuestaIA.texto);

        await msg.reply(respuestaIA.texto);

    } catch (error) {
        console.error('Hubo un error con la IA:', error);
        await msg.reply('Lo siento, mi cerebro artificial tuvo un problema de conexión. Intenta de nuevo.');
    }
});

console.log('Iniciando sistema...');
client.initialize();
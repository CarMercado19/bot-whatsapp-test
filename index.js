const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 1. Configuración del Cliente y la Sesión
const client = new Client({
    authStrategy: new LocalAuth()
});

// 2. El generador del Código QR
client.on('qr', (qr) => {
    console.log('Escanea este código QR desde "Dispositivos vinculados" en tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// 3. El indicador de conexión
client.on('ready', () => {
    console.log('¡Bot conectado exitosamente y listo para trabajar!');
});

// 4. El receptor y lector de mensajes
client.on('message', async (msg) => {
    // Convertimos el mensaje a minúsculas para que no importe si escriben "Hola", "HOLA" o "hola"
    const textoMensaje = msg.body.toLowerCase();

    if (textoMensaje === 'ping') {
        // msg.reply responde citando el mensaje original del usuario
        await msg.reply('pong');
    }
    else if (textoMensaje === 'hola') {
        await msg.reply('¡Hola! Soy tu primer bot de prueba en Node.js.');
    }
});

// 5. El interruptor de encendido
console.log('Iniciando sistema...');
client.initialize();
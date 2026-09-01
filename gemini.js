const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializamos la IA usando tu llave secreta (que leeremos desde index.js)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Creamos una función que reciba el texto y devuelva la respuesta y el tiempo
async function fetchGemini(textoMensaje) {
    const tiempoInicio = performance.now();

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const resultado = await model.generateContent(textoMensaje);
    const respuesta = resultado.response.text();

    const tiempoFin = performance.now();
    const segundos = ((tiempoFin - tiempoInicio) / 1000).toFixed(2);

    // Devolvemos un objeto con ambas piezas de información
    return {
        texto: respuesta,
        tiempo: segundos
    };
}

// Exportamos la función para que index.js pueda usarla
module.exports = { fetchGemini };
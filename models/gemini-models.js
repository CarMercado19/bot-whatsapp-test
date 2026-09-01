require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Consultando el catálogo de Google...");

    try {
        const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const datos = await respuesta.json();

        console.log("\n=== MODELOS DISPONIBLES PARA TI ===");
        datos.models.forEach(modelo => {
            if (modelo.supportedGenerationMethods && modelo.supportedGenerationMethods.includes("generateContent")) {
                console.log(modelo.name.replace('models/', ''));
            }
        });
        console.log("===================================\n");

    } catch (error) {
        console.error("Hubo un error al consultar:", error);
    }
}

listModels();
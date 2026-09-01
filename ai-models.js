require('dotenv').config();

async function listarModelos() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Consultando el catálogo de Google...");

    try {
        // Hacemos una petición directa a la API para listar los modelos
        const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const datos = await respuesta.json();

        console.log("\n=== MODELOS DISPONIBLES PARA TI ===");
        datos.models.forEach(modelo => {
            // Filtramos solo los que aceptan generar texto ("generateContent")
            if (modelo.supportedGenerationMethods && modelo.supportedGenerationMethods.includes("generateContent")) {
                // Limpiamos el texto para mostrar solo el nombre corto
                console.log(modelo.name.replace('models/', ''));
            }
        });
        console.log("===================================\n");

    } catch (error) {
        console.error("Hubo un error al consultar:", error);
    }
}

listarModelos();
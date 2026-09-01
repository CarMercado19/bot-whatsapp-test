# 🤖 Bot de WhatsApp con IA (Gemini)

Un Proof of Concept (PoC) para un bot de WhatsApp integrado con la Inteligencia Artificial de **Google Gemini**. Construido con `Node.js`, `Yarn` y `whatsapp-web.js`.

Este bot incluye un escudo anti-spam para mensajes antiguos, medición de latencia de la API y un sistema de lista blanca (whitelist) para operar de forma segura en un entorno de desarrollo.



## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) instalado en tu sistema.
- [Yarn](https://yarnpkg.com/) como gestor de paquetes.
- Una cuenta de WhatsApp (se recomienda usar un número secundario o de prueba).

## 🚀 Instalación

**Instalar dependencias:** Abre tu terminal en la carpeta del proyecto y ejecuta:
   ```bash
   yarn install
   ```



## ⚙️ Configuración (.env)

Crea un archivo nuevo en la raíz del proyecto llamado exactamente `.env`. Este archivo es ignorado por Git para mantener tus credenciales seguras. Añade las siguientes variables:

  ```bash
  GEMINI_API_KEY=tu_clave_de_google_aqui
  WHITELIST=numero1@c.us,numero2@c.us
  ```

### ¿Cómo obtener los parámetros?

### 🔑 GEMINI_API_KEY:
1. Ve a [Google AI Studio](https://aistudio.google.com/projects).
2. Inicia sesión y haz clic en `Get API key` en el menú izquierdo.
3. Haz clic en `Create API key`.
4. Copia el texto generado y pégalo en tu archivo `.env`.

### 📱 WHITELIST (Números autorizados):

1. Deja el valor de `WHITELIST=` vacío temporalmente.
2. Inicia el bot (`yarn dev`).
3. Envíale un mensaje al bot desde el teléfono de pruebas.
4. Revisa tu terminal. Verás: `ID del remitente: 52155XXXXXXXX@c.us`.
5. Copia ese ID exacto y pégalo en el `.env`. (Para múltiples números, sepáralos solo con comas, sin espacios).



## 💻 Ejecución del Proyecto

El proyecto cuenta con los siguientes scripts configurados en `package.json`:

- Iniciar el bot (Modo Desarrollo):
  ```bash
  yarn dev
  ```

- Prueba aislada de modelos (si aplica):
  ```bash
  yarn models
  ```
  
**Pasos para conectar:**
1. Ejecuta `yarn dev` en tu terminal.
2. La terminal mostrará un código QR.
3. Abre WhatsApp en tu teléfono host, ve a `Dispositivos vinculados` y escanea el código QR.
4. Espera el mensaje: `¡Bot conectado exitosamente y listo para pensar con IA!`.



## 🏗️ Estructura del Proyecto

- `index.js`: Archivo principal. Maneja la conexión con WhatsApp, el QR, escudo anti-spam y enrutamiento.
- `models/gemini.js`: Módulo aislado para comunicación con Google Gemini y cronometraje (`performance.now()`).
- `models/whitelist.js`: Módulo que procesa los IDs permitidos desde las variables de entorno.
- `.env`: Archivo local de variables secretas (no se sube a control de versiones).
- `.gitignore`: Protege la sesión de WhatsApp (`.wwebjs_auth/`), `node_modules/` y el archivo `.env`.
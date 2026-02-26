require('dotenv').config(); // Carga las variables del .env
const express = require('express');
const webpush = require('web-push');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite que React (en otro puerto/dominio) se conecte
app.use(express.json()); // Para poder leer el body de los JSON que envíe React

// Configuración de Web Push con variables de entorno
webpush.setVapidDetails(
    process.env.EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// --- RUTAS ---

// 1. Ruta para que el Frontend obtenga la llave pública dinámicamente
app.get('/public-key', (_, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// 2. Ruta para recibir la suscripción y enviar la notificación de prueba
app.post('/subscribe', async (req, res) => {
    // Extraemos los datos que enviamos desde React
    const { subscription, titulo, mensaje } = req.body;

    // Creamos el payload dinámico con lo que llegó de React
    const payload = JSON.stringify({
        title: titulo || "girorides.com",
        message: mensaje || "Tienes un nuevo mensaje."
    });

    try {
        await webpush.sendNotification(subscription, payload);
        res.status(201).json({ message: "Notificación enviada con éxito." });
    } catch (error) {
        console.error("Error enviando:", error);
        res.status(error.statusCode || 500).json(error);
    }
});

// Ruta de salud (Útil para que Render sepa que el server está vivo)
app.get('/', (req, res) => {
    res.send('Servidor de Notificaciones Push Operativo');
});

// Puerto dinámico para Render o local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔑 Usando llave pública: ${process.env.VAPID_PUBLIC_KEY.substring(0, 10)}...`);
});

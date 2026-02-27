require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const cors = require('cors');

const app = express();

// --- CONFIGURACIÓN ---
app.use(cors());
app.use(express.json());

// Configurar llaves VAPID
webpush.setVapidDetails(
    process.env.EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Base de datos temporal (en memoria)
let subscriptions = [];

// --- RUTAS ---

// 1. Obtener llave pública
app.get('/public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// 2. Registrar un nuevo suscriptor
app.post('/subscribe', (req, res) => {
    const { subscription } = req.body;

    // Validar que la suscripción tenga el formato correcto
    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: "Suscripción inválida" });
    }

    // Verificar si ya existe para no duplicar
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    
    if (!exists) {
        subscriptions.push(subscription);
        console.log(`✅ Nuevo suscriptor añadido. Total: ${subscriptions.length}`);
    }

    res.status(201).json({ message: "Suscrito correctamente." });
});

// 3. Enviar a TODOS los suscriptores (Broadcast)
app.post('/send-all', async (req, res) => {
    const { title, message } = req.body;

    const payload = JSON.stringify({
        title: title || "Giro Rides",
        message: message || "Tienes un mensaje."
    });

    console.log(`📣 Enviando notificación a ${subscriptions.length} dispositivos...`);

    // Mapeamos todas las suscripciones para enviar en paralelo
    const notifications = subscriptions.map((sub, index) => {
        return webpush.sendNotification(sub, payload)
            .catch(err => {
                // Si el código es 410 o 404, significa que la suscripción expiró o el usuario bloqueó permisos
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log(`❌ Limpiando suscripción expirada en el índice: ${index}`);
                    subscriptions[index] = null; // La marcamos para borrar
                }
            });
    });

    try {
        await Promise.all(notifications);
        // Limpiar las suscripciones nulas que marcamos arriba
        subscriptions = subscriptions.filter(sub => sub !== null);
        
        res.json({ 
            success: true, 
            sentTo: subscriptions.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de estado
app.get('/', (req, res) => {
    res.send(`Servidor funcionando. Suscriptores activos: ${subscriptions.length}`);
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready on port ${PORT}`);
});
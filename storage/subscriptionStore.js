import { db } from '../config/firebase.js';

const subsRef = db.ref('push_subscriptions');

export const subscriptionStore = {
    // Obtener todas las suscripciones de Firebase
    getAll: async () => {
        const snapshot = await subsRef.once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : [];
    },

    // Guardar una nueva (usamos el endpoint como ID único para evitar duplicados)
    add: async (sub) => {
        // Limpiamos el endpoint de caracteres no permitidos por Firebase como "." o "$"
        const safeId = Buffer.from(sub.endpoint).toString('base64').replace(/[/+=]/g, '');
        await subsRef.child(safeId).set(sub);
        return true;
    },

    // Eliminar suscripción (cuando el token expira)
    removeByEndpoint: async (endpoint) => {
        const safeId = Buffer.from(endpoint).toString('base64').replace(/[/+=]/g, '');
        await subsRef.child(safeId).remove();
    },

    getCount: async () => {
        const snapshot = await subsRef.once('value');
        return snapshot.numChildren();
    }
};
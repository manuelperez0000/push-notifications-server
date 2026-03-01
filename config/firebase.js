import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Puedes pasar la ruta al archivo JSON o usar variables de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL // Ej: https://tu-app.firebaseio.com
});

export const db = admin.database();
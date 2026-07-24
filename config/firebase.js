import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    };
    
    if (!serviceAccount.privateKey.includes('BEGIN PRIVATE KEY')) {
      console.error("El formato de FIREBASE_PRIVATE_KEY parece estar corrupto. Faltan los marcadores BEGIN PRIVATE KEY.");
    }
  } else {
    console.error("Faltan variables de entorno de Firebase. Asegúrate de configurar FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.");
  }
} catch (error) {
  console.error("Error al configurar las credenciales de Firebase:", error);
}

// 1. Verificamos si la app ya fue inicializada usando getApps()
if (serviceAccount && getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

// 2. Exportamos la base de datos usando la API modular
export const db = getApps().length ? getDatabase() : null;
export const firestore = getApps().length ? getFirestore() : null;
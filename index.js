import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configureWebPush } from "./config/webpush.js";
import router from "./router.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
configureWebPush();

const whitelist = [
  'https://girorides.com',
  'https://www.girorides.com',
  'https://girove.vercel.app/'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por la política de CORS: Origen no autorizado.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// 3. Aplica el middleware globalmente
app.use(cors(corsOptions));


app.use(express.json());
// Silenciar las peticiones automáticas de favicon
app.get(['/favicon.ico', '/favicon.png'], (req, res) => res.status(204).end());
app.get("/", (req, res) => {
  res.json({ ok: true });
});

router(app);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
  });
}

export default app;

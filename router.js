import express from 'express';
import cors from 'cors'
import push from './routes/push.js';

const testRoute = (req, res) => res.json({ message: "API de Giro Rides" });

const route = express.Router();
const router = (app) => {

    app.use(cors())
    app.use('/api/v1', route);

    /*  
    app.get('/*', (req, res, next) => {
        res.status(500).json({ error: "Estos hackers son muy malos"});
    })
    */
    route.get('/', testRoute);
    route.use('/push', push);
}

export default router;
import express from 'express';
import push from './routes/push.js';
import imagekit from './routes/imagekit.js';

const testRoute = (req, res) => res.json({ message: "API de Giro Rides" });

const route = express.Router();
const router = (app) => {

    app.use('/api/v1', route);

    /*  
    app.get('/*', (req, res, next) => {
        res.status(500).json({ error: "Estos hackers son muy malos"});
    })
    */
    route.get('/imagekit',imagekit)
    route.get('/', testRoute);
    route.use('/push', push);
}

export default router;
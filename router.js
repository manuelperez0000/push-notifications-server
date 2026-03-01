import express from 'express';
import cors from 'cors'
import push from './routes/push.js';

const route = express.Router();
const router = (app)=>{
    
    app.use('/api/v1', route);
    app.use(cors())

    route.use('/push', push);
}

export default router;
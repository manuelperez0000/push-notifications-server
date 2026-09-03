import crypto from 'node:crypto';
import express from 'express';
import 'dotenv/config';
const app = express();

const environment = globalThis.process?.env || {};
const privateKey = environment.IMAGEKIT_PRIVATE_KEY;
const allowedOrigin = environment.FRONTEND_URL || '*';

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.sendStatus(204);
    }

    next();
});

const imagekitService = (req, res) => {

    if (!privateKey) {
        console.log('IMAGEKIT_PRIVATE_KEY is not configured.');
        return res.status(500).json({ message: 'IMAGEKIT_PRIVATE_KEY is not configured.' });
    } 

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 30 * 60;
    const signature = crypto
        .createHmac('sha1', privateKey)
        .update(token + expire)
        .digest('hex');

    return res.json({ token, expire, signature });
}

export default imagekitService;
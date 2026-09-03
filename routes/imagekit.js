import crypto from 'node:crypto';

const environment = globalThis.process?.env || {};
const privateKey = environment.IMAGEKIT_PRIVATE_KEY;

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
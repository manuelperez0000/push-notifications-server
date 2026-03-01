import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

export const configureWebPush = () => {
    webpush.setVapidDetails(
        process.env.EMAIL,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
};

export { webpush };
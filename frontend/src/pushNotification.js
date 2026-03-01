import { urlBase64ToUint8Array } from "./services.js";

export default async function sendPushNotification(title, body) {
  const serverUrl = "https://push-notifications-server-6atv.onrender.com";
  const responseKey = await fetch(`${serverUrl}/public-key`);
  const { publicKey } = await responseKey.json();


  const register = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  // ENVIAR SUSCRIPCIÓN + DATOS DEL FORMULARIO
  await fetch(`${serverUrl}/subscribe`, {
    method: "POST",
    body: JSON.stringify({
      subscription: subscription, // La suscripción del navegador
      titulo: title, // Título del formulario
      mensaje: body, // Mensaje del formulario
    }),
    headers: { "Content-Type": "application/json" },
  });

  await fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription,
      title,
      body,
    }),
  });
}

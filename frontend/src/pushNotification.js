export default async function sendPushNotification(title, body) {
  const serverUrl = "https://push-notifications-server-6atv.onrender.com";
  const responseKey = await fetch(`${serverUrl}/public-key`);
  const { publicKey } = await responseKey.json();

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

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

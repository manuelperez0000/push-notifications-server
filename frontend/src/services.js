// Función auxiliar para convertir la llave VAPID
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const apiUrl = "http://localhost:3000/api/v1/push";

export const subscribeUser = async () => {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    // Obtener llave pública del backend
    const res = await fetch(apiUrl + "/public-key");
    const { publicKey } = await res.json();

    // Suscribir al navegador
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // Guardar en Firebase vía Backend
    await fetch(apiUrl + "/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription }),
      headers: { "Content-Type": "application/json" },
    });

    alert("¡Suscrito con éxito!");
  } catch (error) {
    console.error("Error en suscripción:", error);
  }
};

export const sendGlobalNotification = async (title, message) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/push/send-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        message: message,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`📣 Notificación enviada a ${data.sentTo} personas`);
      return data;
    }
  } catch (error) {
    console.error("Error enviando notificación:", error);
    throw error;
  }
};

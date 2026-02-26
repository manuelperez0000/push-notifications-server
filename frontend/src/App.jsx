import React, { useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState("Listo para probar");

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const suscribirYProbar = async () => {
    try {
      const serverUrl = 'http://localhost:3000'; // Tu backend
      
      // 1. Obtener la Public Key dinámicamente
      setMensaje("Obteniendo llave del servidor...");
      const responseKey = await fetch(`${serverUrl}/public-key`);
      const { publicKey } = await responseKey.json();

      // 2. Registrar y esperar al Service Worker
      const register = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 3. Limpiar suscripción vieja si existe
      const oldSub = await register.pushManager.getSubscription();
      if (oldSub) await oldSub.unsubscribe();

      // 4. Crear la nueva suscripción con la llave obtenida
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // 5. Enviar suscripción al backend para disparar la notificación
      setMensaje("Enviando suscripción...");
      await fetch(`${serverUrl}/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });

      setMensaje("¡Notificación enviada!");
    } catch (error) {
      console.error(error);
      setMensaje("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Web Push Dinámico</h1>
      <p>{mensaje}</p>
      <button onClick={suscribirYProbar} style={{ padding: '10px 20px' }}>
        Obtener Llave y Notificar
      </button>
    </div>
  );
}

export default App;
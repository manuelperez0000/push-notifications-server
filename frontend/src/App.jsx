import React, { useState } from 'react';

function App() {
  const [mensajeEstado, setMensajeEstado] = useState("Listo para enviar");
  // Nuevos estados para el formulario
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");

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

  const enviarNotificacion = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    if (!titulo || !cuerpo) {
      alert("Por favor llena ambos campos");
      return;
    }

    try {
      const serverUrl = 'https://tu-app-en-render.onrender.com'; // <--- TU URL DE RENDER
      
      setMensajeEstado("Obteniendo llave...");
      const responseKey = await fetch(`${serverUrl}/public-key`);
      const { publicKey } = await responseKey.json();

      const register = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      setMensajeEstado("Enviando notificación personalizada...");

      // ENVIAR SUSCRIPCIÓN + DATOS DEL FORMULARIO
      await fetch(`${serverUrl}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
          subscription: subscription, // La suscripción del navegador
          titulo: titulo,             // Título del formulario
          mensaje: cuerpo             // Mensaje del formulario
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      setMensajeEstado("¡Enviada!");
    } catch (error) {
      console.error(error);
      setMensajeEstado("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Panel de Notificaciones</h1>
      
      <form onSubmit={enviarNotificacion} style={{ display: 'inline-block', textAlign: 'left', gap: '10px' }}>
        <div>
          <label>Título:</label><br/>
          <input 
            type="text" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            placeholder="Ej: Hola Mundo"
            style={{ width: '300px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Mensaje:</label><br/>
          <textarea 
            value={cuerpo} 
            onChange={(e) => setCuerpo(e.target.value)} 
            placeholder="Ej: Esta es una prueba"
            style={{ width: '300px', height: '80px', marginBottom: '10px' }}
          />
        </div>
        <br/>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Enviar Notificación ahora
        </button>
      </form>
      
      <p><strong>Estado:</strong> {mensajeEstado}</p>
    </div>
  );
}

export default App;
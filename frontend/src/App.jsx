import sendPushNotification from './pushNotification';
function App() {

  const enviarNotificacion = async (e) => {
    e.preventDefault();
    try {
      await sendPushNotification("titulo", "mensaje");
      console.log("¡Enviada!");
    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Panel de Notificaciones</h1>

      <button onClick={enviarNotificacion} type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Enviar Notificación ahora
      </button>



    </div>
  );
}

export default App;
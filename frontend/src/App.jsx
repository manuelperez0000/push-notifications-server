import {
  subscribeUser,
  sendGlobalNotification
} from './services.js';

function App() {


  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Panel de Notificaciones</h1>

      <button onClick={subscribeUser} type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Subscribirse
      </button>
      <button onClick={() => sendGlobalNotification("titulo", "mensaje")} > Enviar notificacion </button>
    </div>
  );
}

export default App;
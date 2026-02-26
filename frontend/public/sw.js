// public/sw.js

self.addEventListener('push', (event) => {
  const data = event.data.json(); // Convertimos el string que envía Node a JSON
  console.log('Push recibido:', data);

  const options = {
    body: data.message,
    icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827347.png', // Un icono cualquiera
    badge: 'https://cdn-icons-png.flaticon.com/512/1827/1827347.png',
  };

  // Esta línea es la que realmente "pinta" la notificación en Windows/Mac/Android
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
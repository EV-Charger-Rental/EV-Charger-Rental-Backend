'use strict';
require('dotenv').config();
const port = process.env.PORT || 3000;
const io = require('socket.io-client');
const host = `http://localhost:${port}/notification`;
const SystemConnection = io.connect(host);

SystemConnection.emit('join-renter');
SystemConnection.on('connect', () => {
  console.log('Renter connected to the system.');

  setInterval(() => {
    const chargerId = Math.floor(Math.random() * 10) + 1;
    SystemConnection.emit('send-request-for-charger', chargerId);
    console.log(`Renter sent a request for the Provider to rent the charger ${chargerId}`);
  }, 5000); 
});

SystemConnection.on('send-request-for-charger-from-renter-side', (chargerId) => {
  console.log(`Renter sent a request for the Provider to rent the charger ${chargerId}`);
  SystemConnection.emit('system received first notification');
});

SystemConnection.on('system received first notification', () => {
  console.log('Provider accepted the renter request for charger');
});

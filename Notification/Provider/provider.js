'use strict';
require('dotenv').config();
const port = process.env.PORT || 3001;
const io = require('socket.io-client');
const host = `http://localhost:${port}/notification`;
const SystemConnection = io.connect(host);



//SystemConnection.emit('get-all');
SystemConnection.emit('join-Provider');

SystemConnection.on('received-request-for-charger', (chargerId) => {
  console.log(`received a request for charger ${chargerId}`);
  console.log(`Provider accepted the renter request for charger ${chargerId}`);
  SystemConnection.emit('Provider-accepted-request', chargerId);
});

// SystemConnection.on('connect', () => {
//   console.log('Shipper connected to the system.');

  SystemConnection.on('reconnect', () => {
    console.log('Provider reconnected to the system.');
    SystemConnection.emit('join-Provider'); // Rejoin the shipper room
    // You can request missing notifications or perform any other necessary actions here
  });


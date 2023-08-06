// 'use strict';
// require('dotenv').config();
// const port = process.env.PORT || 3000;
// const io = require('socket.io-client');
// const host = `http://localhost:${port}/`;
// const SystemConnection = io.connect(host);

// SystemConnection.emit('join-renter');

// SystemConnection.on('send-request-for-charger', (chargerId) => {
//           console.log(`Renter send request to rent this charger ${chargerId}`);
//         console.log("-------------------------------------");
//         SystemConnection.emit(`system received first notification`);
//       });

// // SystemConnection.on('charger-approval', (chargerId, approved) => {
// //   if (approved) {
// //     console.log(`Renter: Charger with ID '${chargerId}' has been approved.`);
// //   } else {
// //     console.log(`Renter: Charger with ID '${chargerId}' has been canceled.`);
// //   }
// //   console.log("-------------------------------------");
// // });

// SystemConnection.on('connect', () => {
//   console.log('Renter connected to the system.');
// });
'use strict';
require('dotenv').config();
const port = process.env.PORT || 3000;
const io = require('socket.io-client');
const host = `http://localhost:${port}/`;
const SystemConnection = io.connect(host);

SystemConnection.emit('join-renter');

SystemConnection.on('connect', () => {
  console.log('Renter connected to the system.');
  const chargerId = 'charger123'; // Replace 'charger123' with the actual charger ID you want to rent
  SystemConnection.emit('send-request-for-charger', chargerId);
});

SystemConnection.on('send-request-for-charger-from-renter-side', (chargerId) => {
  console.log(`Renter send request to rent this charger ${chargerId}`);
  SystemConnection.emit('system received first notification');
});

SystemConnection.on('system received first notification', () => {
  console.log('Provider for charger has been approved your request');
});


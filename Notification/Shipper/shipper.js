// 'use strict';
// require('dotenv').config();
// const port = process.env.PORT || 3000;
// const io = require('socket.io-client');
// const host = `http://localhost:${port}/`;
// const SystemConnection = io.connect(host);

// SystemConnection.emit('join-shipper');

// // SystemConnection.on('chargers', (chargers) => {
// //   // Code to handle the list of chargers received from the system.
// //   // Here, you can display the available chargers to the shipper and let them choose.
// //   console.log('Available chargers:', chargers);
// //   // For demonstration purposes, let's assume the shipper chooses the first charger from the list.
// //   const selectedCharger = chargers[0];
// //   SystemConnection.emit('approve', selectedCharger.id);
// //   // You can also handle the cancelation logic if needed.
// // });
// SystemConnection.on('received-request-for-charger', (chargerId) => {
//   console.log(`Renter send request to this charger ${chargerId}`);
// console.log("-------------------------------------");
// });

// // SystemConnection.on('charger-approval', (chargerId, approved) => {
// //   if (approved) {
// //     console.log(`Shipper: Charger with ID '${chargerId}' has been approved by the renter.`);
// //   } else {
// //     console.log(`Shipper: Charger with ID '${chargerId}' has been canceled by the renter.`);
// //   }
// //   console.log("-------------------------------------");
// // });

// SystemConnection.on('connect', () => {
//   console.log('Shipper connected to the system.');
// });
'use strict';
require('dotenv').config();
const port = process.env.PORT || 3001;
const io = require('socket.io-client');
const host = `http://localhost:${port}/`;
const SystemConnection = io.connect(host);

SystemConnection.emit('join-shipper');

SystemConnection.on('received-request-for-charger', (chargerId) => {
  console.log(`received a request for charger ${chargerId}`);
  console.log(`you approved the request for charger ${chargerId}`);
  SystemConnection.emit('shipper-accepted-request', chargerId);
});

SystemConnection.on('connect', () => {
  console.log('Shipper connected to the system.');
});

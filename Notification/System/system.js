// const express = require('express');
// const app = express();
// const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer);
// const port = process.env.PORT || 3000;

// httpServer.listen(port, () => {
//   console.log(`Main server is running on port ${port}`);
// });

// io.on('connection', (socket) => {
//   console.log('A user connected.');

//   socket.on('join-renter', () => {
//     console.log('Renter joined the system.');
//   });

//   socket.on('join-shipper', () => {
//     console.log('Shipper joined the system.');

//     // // When a shipper joins, send them the list of available chargers.
//     // const chargers = [
//     //   { id: 'charger1', name: 'Charger 1' },
//     //   { id: 'charger2', name: 'Charger 2' },
//     //   // Add more chargers as needed
//     // ];
//     // socket.emit('chargers', chargers);
//   });

//   socket.emit('send-request-for-charger', (chargerId) => {
//     console.log(`Received a request from the renter for charger ${chargerId}`);
//     socket.broadcast.emit('received-request-for-charger', chargerId);
//   //  socket.on(`system received first notification`);
//   });

//   // socket.on('approve', (chargerId) => {
//   //   console.log(`Shipper approved the request for charger with ID '${chargerId}'.`);
//   //   socket.emit('charger-approval', chargerId, true);
//   // });

//   // socket.on('cancel', (chargerId) => {
//   //   console.log(`Shipper canceled the request for charger with ID '${chargerId}'.`);
//   //   socket.emit('charger-approval', chargerId, false);
//   // });

//   // socket.on('took-off-log', (chargerId) => {
//   //   console.log(`Charger with ID '${chargerId}' took off.`);
//   //   socket.broadcast.emit('took-off-log', chargerId);
//   // });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected.');
//   });
// });
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const port = process.env.PORT || 3001;

httpServer.listen(port, () => {
  console.log(`Main server is running on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('join-renter', () => {
    console.log('Renter joined the system.');
  });

  socket.on('join-shipper', () => {
    console.log('Shipper joined the system.');
  });

  socket.on('send-request-for-charger', (chargerId) => {
    console.log(`renter sent a request for the shipper to rent the charger ${chargerId}`);
    socket.broadcast.emit('received-request-for-charger', chargerId);
  });
  io.emit('send-request-for-charger-from-renter-side')
  io.emit('system received first notification')

  socket.on('shipper-accepted-request', (chargerId) => {
    console.log(`shipper accepted the renter request for charger ${chargerId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});


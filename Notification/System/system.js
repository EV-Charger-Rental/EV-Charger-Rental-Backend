'use strict';
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const port = process.env.PORT || 3001;
// const queue = {
//   requests: {

//   }
// };


httpServer.listen(port, () => {
  console.log(`Main server is running on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('A user connected.');


  
  socket.on('join-renter', () => {
    console.log('Renter joined the system.');
  });

  socket.on('join-shipper', () => {
    console.log('Provider joined the system.');
  //  console.log("*********************",chargerId);
  });

  socket.on('send-request-for-charger', (chargerId) => {
    console.log(`Renter sent a request for the shipper to rent the charger ${chargerId}`);
    socket.broadcast.emit('received-request-for-charger', chargerId);
   
  });
  io.emit('send-request-for-charger-from-renter-side')
  io.emit('system received first notification')

  socket.on('shipper-accepted-request', (chargerId) => {
    console.log(`Provider accepted the renter request for charger ${chargerId}`);
  });


  // socket.on('get-all', () => {
  //   const flights = Object.values(queue.requests);
  //   //socket.emit('flight', requests);
  //   queue.requests = {};
  //   console.log("*****************************",queue.requests);
  // });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});


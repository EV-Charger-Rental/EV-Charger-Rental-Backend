'use strict';

let path = require('path');
let http = require('http');
let { userJoin, getCurrentUser, userLeave, getRoomUsers  } = require('./utils/users');
let socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const {messagesModal,roomsModal}=require('./models/index.js');//to use in the socket.io

let formatMessage = require('./utils/messages.js');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
//// const v1Routes = require('./routes/v1.js');
const authRoutes = require('./routes/routes.js');
const v2Routes = require('./routes/V2.js');
// const renterRoutes = require('./routes/renterRoutes.js');
const { messages } = require('./models');
const messagesModel = require('./models/messagesTable/messages');
const { privateMessagesModal } = require('./models');
const { Op } = require('sequelize');



const app = express();
const server = http.createServer(app);

let io = socketIO(server);
let notification = io.of ('/notification')
let peerTOpeer= io.of('/peer-to-peer');

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

let botName = '🔌 Bot';

//home route

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});
// =======================================================================================================================

//rooms socket.io


io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {
  
  const user = userJoin(socket.id, username, room);

  socket.join(user.room);

  //welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to PlugTalk!'));

  // broadcast when a user connects
  socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

  // send users and room info
  io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
  });
  
  socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if(user) {

          io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

          // send users and room info
          io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: getRoomUsers(user.room)
          });
      }
  });

  // listen for chatMessage
  socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);
      let storeMessage = messagesModal.create({
        message: msg,
        room_name: user.room,
        username: user.username,

      });
      io.to(user.room).emit('message', formatMessage(user.username, msg));
  });


  // listen for chatMessage
  socket.on('getMessages', (room) => {
    let messages = messagesModal.findAll({ where: { room_name: room } });
    messages.then((messages) => {
      console.log('============>',messages);
      socket.emit('perviousMessages', messages);
    });
  });


  });
});
 
// =======================================================================================================================

//peer to peer socket.io

const connectedClients = {};

peerTOpeer.on('connection', socket => {

  socket.on('checkin user', name => {
    connectedClients[name] = socket
    // console.log('connectedClients', connectedClients);
    // console log the keys only
    console.log('connectedClients', Object.keys(connectedClients));
});


socket.on('checkout users a vailabilty', plugOwner => {
    if (connectedClients[plugOwner]) {
        socket.emit('plugOwner online', plugOwner);
    }else{
        console.log('user not found')
        socket.emit('plugOwner offline', 'user is currently offline')}
    
})


socket.on('private message', ({plugOwner,msg,username}) => {
    console.log('PrivateMessage', msg);
    console.log('plugOwner', plugOwner);

    const privateMessage = privateMessagesModal.create({
        message: msg,
        sender: username,
        receiver: plugOwner,
    });

    if (connectedClients[plugOwner]) {
        connectedClients[plugOwner].emit('private message', {plugOwner,msg,username});
    }else{
        console.log('user not found')
        socket.emit('disconnected user', 'user is currently offline')}
    
}
);

//get the messages history between two users
socket.on('getpreviousPrivateMessages', ({ plugOwner, username }) => {
  console.log('===================plugOwner', plugOwner);
  console.log('===================username', username);

  const messagesPromise = privateMessagesModal.findAll({
    where: {
      [Op.or]: [
        { sender: plugOwner, receiver: username },
        { sender: username, receiver: plugOwner }
      ]
    },
    order: [['createdAt', 'ASC']]
  });

  messagesPromise.then((messages) => {
    console.log('this is the messages ============>', messages);
    socket.emit('perviousPrivateMessages', messages);
  }).catch((error) => {
    console.error('Error fetching previous private messages:', error);
  });
});

//handle client disconnect

socket.on('disconnect',()=>{
    //delete the user from connectedClients
    delete connectedClients[socket.id];

})
});

// =========================================================================================================

notification.on( 'connection', socket =>{

  
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
//======================================================================================================================================== 
//***************************************************************************************************//
//***************************************************************************************************//



// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(logger);

// Routes
app.use(authRoutes);
// app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

//app.use('/api/renter', renterRoutes);

// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    server.listen(port, () => console.log(`Listening on ${port}`));
  },
};

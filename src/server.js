'use strict';

let path = require('path');
let http = require('http');
let { userJoin, getCurrentUser, userLeave, getRoomUsers  } = require('./utils/users');
let socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

let formatMessage = require('./utils/messages.js');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
// const v1Routes = require('./routes/v1.js');
const authRoutes = require('./routes/routes.js');
const v2Routes = require('./routes/V2.js');
const renterRoutes = require('./routes/renterRoutes.js');


const app = express();
const server = http.createServer(app);
let io = socketIO(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

let botName = '🔌 Bot';

//home route

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});
// =======================================================================================================================
//soket.io
// run when client connects
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
  
//_____________________________________________________________________________________________________________________________________



//_____________________________________________________________________________________________________________________________________



  // runs when client disconnects
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

      // io.emit('message', formatMessage(botName, `'${user.username} has left the chat''`));
  });

  // listen for chatMessage
  socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
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

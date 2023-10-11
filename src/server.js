'use strict';

let path = require('path');
let http = require('http');
let { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
let socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const { messagesModal, roomsModal } = require('./models/index.js');//to use in the socket.io

let formatMessage = require('./utils/messages.js');


const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
//// const v1Routes = require('./routes/v1.js');
const authRoutes = require('./routes/routes.js');
const v2Routes = require('./routes/V2.js');
const mhmdRoutes = require('./routes/mhmdRoutes.js');

// const renterRoutes = require('./routes/renterRoutes.js');
const { messages } = require('./models');
const messagesModel = require('./models/messagesTable/messages');
const { privateMessagesModal } = require('./models');
const { Op } = require('sequelize');
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// tables for the new chat system 
const { conversationsModal } = require('./models');
const { newMessagesModal } = require('./models');
const { participantsModal } = require('./models');
const { send } = require('process');
const { users } = require('./models');


const app = express();
const server = http.createServer(app);

// let io = socketIO(server);

// allowed devices outside of the server to connect to the server

let io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let notification = io.of('/notification')
let peerTOpeer = io.of('/peer-to-peer');
let newPeerToPeer = io.of('/new-peer-to-peer');

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

    const user = userJoin(socket.id, username, room);//userJoin is a function that we imported from the users.js file

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

      if (user) {

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
        console.log('============>', messages);
        socket.emit('perviousMessages', messages);
      });
    });


  });
});

// =======================================================================================================================

// //peer to peer socket.io

// const connectedClients = {};

// peerTOpeer.on('connection', socket => {

//   socket.on('send-message', (message) => {
//     console.log('>>>>>>>>>>message', message);
//   })

//   socket.on('checkin user', name => {
//     connectedClients[name] = socket
//     // console.log('connectedClients', connectedClients);
//     // console log the keys only
//     console.log('connectedClients', Object.keys(connectedClients));
//   });


//   socket.on('checkout users a vailabilty', plugOwner => {
//     if (connectedClients[plugOwner]) {
//       socket.emit('plugOwner online', plugOwner);
//     } else {
//       console.log('user not found')
//       socket.emit('plugOwner offline', 'user is currently offline')
//     }

//   })


//   socket.on('private message', ({ plugOwner, msg, username }) => {
//     console.log('PrivateMessage', msg);
//     console.log('plugOwner', plugOwner);

//     const privateMessage = privateMessagesModal.create({
//       message: msg,
//       sender: username,
//       receiver: plugOwner,
//     });

//     if (connectedClients[plugOwner]) {
//       connectedClients[plugOwner].emit('private message', { plugOwner, msg, username });
//     } else {
//       console.log('user not found')
//       socket.emit('disconnected user', 'user is currently offline')
//     }

//   }
//   );

//   //get the messages history between two users
//   socket.on('getpreviousPrivateMessages', ({ plugOwner, username }) => {
//     console.log('===================plugOwner', plugOwner);
//     console.log('===================username', username);

//     const messagesPromise = privateMessagesModal.findAll({
//       where: {
//         [Op.or]: [
//           { sender: plugOwner, receiver: username },
//           { sender: username, receiver: plugOwner }
//         ]
//       },
//       order: [['createdAt', 'ASC']]
//     });

//     messagesPromise.then((messages) => {
//       console.log('this is the messages ============>', messages);
//       socket.emit('perviousPrivateMessages', messages);
//     }).catch((error) => {
//       console.error('Error fetching previous private messages:', error);
//     });
//   });

//   //handle client disconnect

//   socket.on('disconnect', () => {
//     //delete the user from connectedClients
//     console.log('user disconnected');
//     delete connectedClients[socket.id];

//   })
// });

// =======================================================================================================================

// new peer to peer socket.io

const newConnectedClients = {};


newPeerToPeer.on('connection', socket => {

  console.log('New connection to /new-peer-to-peer namespace.');

  // checking in the user into the new connectedClients object

  // socket.on('checkin user', name => {
  //   newConnectedClients[name] = socket
  //   console.log('connectedClients', Object.keys(newConnectedClients));
  // });

  socket.on('checkin user', name => {
    newConnectedClients[name] = socket;
    // socketToUserMap[socket.id] = name;
    // userToSocketMap[name] = socket.id;
    console.log('connectedClients', Object.keys(newConnectedClients));
});
  // ?????????????????????????????????????????????????????????????????
  socket.on('create-conversation', async (conversation) => {
    console.log('conversation', conversation);


    // find all the newMessages records where the sender and the resiver exist 

    let messages = await newMessagesModal.findAll({
      where: {
        [Op.or]: [
          { senderId: conversation.conversationData.participants[0].id, recieverId: conversation.conversationData.participants[1].id },
          { senderId: conversation.conversationData.participants[1].id, recieverId: conversation.conversationData.participants[0].id }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    // check if the conversation already exist in the database
    let conversationExist = [];
    if (messages.length !== 0) {
      conversationExist = await conversationsModal.findOne({
        where: {
          id: messages[0].dataValues.conversationId,
        }
      });
    }

    if (conversationExist.length !== 0) {
      socket.emit('conversation already exist', conversationExist.id);

      return;
    }


    let newConversation = await conversationsModal.create({
      type: conversation.conversationData.type,
      unreadCount: conversation.conversationData.unreadCount,
    });

    let newParticipants1 = await participantsModal.create({
      role: conversation.conversationData.participants[0].role,
      userId: conversation.conversationData.participants[0].id,
      conversationId: newConversation.dataValues.id,
      lastActivity: conversation.conversationData.participants[0].lastActivity,
      status: conversation.conversationData.participants[0].status,
    });

    let newParticipants2 = await participantsModal.create({
      role: conversation.conversationData.participants[1].role,
      userId: conversation.conversationData.participants[1].id,
      conversationId: newConversation.dataValues.id,
      lastActivity: conversation.conversationData.participants[1].lastActivity,
      status: conversation.conversationData.participants[1].status,
    });

    // check if  the user is connected 
    let status 

    if (newConnectedClients[conversation.conversationData.participants[0].name]) {
      status = 'seen';
    }else{
      status = 'unseen';
    }

    let newMessage = await newMessagesModal.create({
      body: conversation.conversationData.messages[0].body,
      contentType: conversation.conversationData.messages[0].contentType,
      createdAt: conversation.conversationData.messages[0].createdAt,
      senderId: conversation.conversationData.messages[0].senderId,
      recieverId: conversation.conversationData.participants[0].id,
      conversationId: newConversation.dataValues.id,
      status:status,
    });

    let partecipents = await participantsModal.findAll({
      where: {
        conversationId: newConversation.dataValues.id,
      },
    });

    let totalConversationObject = {
      "id": newConversation.dataValues.id,
      "messages": [newMessage.dataValues],
      "participants": partecipents,
      "type": newConversation.dataValues.type,
      "unreadCount": newConversation.dataValues.unreadCount,
    }
    socket.emit('send-conversation-from-server', totalConversationObject);

    // filter the out the reciever from the connectedClients object
    let reciever = conversation.conversationData.participants[0].name;

    if (newConnectedClients[reciever]) {
      newConnectedClients[reciever].emit('new-recieved-conversation-created');
    }

    // if the user is not connected increase the unreadCount in the conversation table by one 
   
    // if(!newConnectedClients[reciever]){
    //   let conversationToUpdate = await conversationsModal.findOne({
    //     where: {
    //       id: newConversation.dataValues.id,
    //     }
    //   });
    //   let unreadCount = conversationToUpdate.dataValues.unreadCount;
    //   unreadCount++;
    //   await conversationsModal.update({ unreadCount: unreadCount }, {
    //     where: {
    //       id: newConversation.dataValues.id,
    //     }
    //   });
    // }

  });

  // ?????????????????????????????????????????????????????????????????????????????????????????????????
  socket.on('get conversation by id', async (conversationId) => {

    console.log('conversationIdIIIIIIIIIIIIIIIIIIIIIII', conversationId);

    if (conversationId) {
      // console.log('conversationId', conversationId);
      let conversation = await conversationsModal.findOne({
        where: {
          id: conversationId,
        }
      });
      // console.log('conversation', conversation);
      let messages = await newMessagesModal.findAll({
        where: {
          conversationId: conversationId,
        }
      });
      // console.log('messages', messages);
      let participants = await participantsModal.findAll({
        where: {
          conversationId: conversationId,
        }
      });

      let users1 = await users.findAll({
        where: {
          id: participants[0].dataValues.userId,
        }
      });
      let users2 = await users.findAll({
        where: {
          id: participants[1].dataValues.userId,
        }
      });

      participants[0].dataValues.id = users1[0].dataValues.id;
      participants[0].dataValues.username = users1[0].dataValues.username;
      participants[0].dataValues.email = users1[0].dataValues.email;
      participants[0].dataValues.phone = users1[0].dataValues.phone;
      participants[0].dataValues.location = users1[0].dataValues.location;

      participants[1].dataValues.id = users2[0].dataValues.id;
      participants[1].dataValues.username = users2[0].dataValues.username;
      participants[1].dataValues.email = users2[0].dataValues.email;
      participants[1].dataValues.phone = users2[0].dataValues.phone;
      participants[1].dataValues.location = users2[0].dataValues.location;


      console.log('participants', participants);

      let totalConversationObject = {
        "id": conversationId,
        "messages": messages,
        "participants": participants,
        "type": conversation.dataValues.type,
        "unreadCount": conversation.dataValues.unreadCount,
      }

      socket.emit('send-conversation by id-from-server', totalConversationObject);
    }
  });
  // ???????????????????????????????????????????????????????????????????????????????????????????????????
  socket.on('get Participant info', async (participantId) => {
    let user = await users.findOne({
      where: {
        id: participantId,
      }
    });
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>user', user);

    let modifiedUser = {
      "status": "offline",
      "id": user.dataValues.id,
      "role": user.dataValues.role,
      "email": user.dataValues.email,
      "name": user.dataValues.username,
      "lastActivity": "",
      "address": user.dataValues.location,
      "avatarUrl": "",
      "phoneNumber": user.dataValues.phone
    }
    socket.emit('send-participant-info back from server', modifiedUser);
  });

  // ???????????????????????????????????????????????????????????????????????????????????????????????????

  socket.on('get all conversations from server', async (userId) => {
    console.log('userId', userId);

    let conversations = await participantsModal.findAll({
      where: {
        userId: userId,
      }
    });

    let totalConversations = [];
    for (let i = 0; i < conversations.length; i++) {
      let conversation = await conversationsModal.findOne({
        where: {
          id: conversations[i].dataValues.conversationId,
        }
      });
      let messages = await newMessagesModal.findAll({
        where: {
          conversationId: conversations[i].dataValues.conversationId,
        }
      });
      let participants = await participantsModal.findAll({
        where: {
          conversationId: conversations[i].dataValues.conversationId,
        }
      });

      console.log('participants', participants);

      let users1 = await users.findAll({
        where: {
          id: participants[0].dataValues.userId,
        }
      });
      let users2 = await users.findAll({
        where: {
          id: participants[1].dataValues.userId,
        }
      });

      participants[0].dataValues.id = users1[0].dataValues.id;
      participants[0].dataValues.username = users1[0].dataValues.username;
      participants[0].dataValues.email = users1[0].dataValues.email;
      participants[0].dataValues.phone = users1[0].dataValues.phone;
      participants[0].dataValues.location = users1[0].dataValues.location;

      participants[1].dataValues.id = users2[0].dataValues.id;
      participants[1].dataValues.username = users2[0].dataValues.username;
      participants[1].dataValues.email = users2[0].dataValues.email;
      participants[1].dataValues.phone = users2[0].dataValues.phone;
      participants[1].dataValues.location = users2[0].dataValues.location;

      let totalConversationObject = {
        "id": conversations[i].dataValues.conversationId,
        "messages": messages,
        "participants": participants,
        "type": conversation.dataValues.type,
        "unreadCount": conversation.dataValues.unreadCount,
      }
      totalConversations.push(totalConversationObject);
    }
    socket.emit('send-all conversations-from-server', totalConversations);
  });







  // ???????????????????????????????????????????????????????????????????????????????????????????????????

  socket.on('send-message', async (conversation) => {

    console.log('conversation', conversation);



  let recieverId= await participantsModal.findOne({
    where:{
      conversationId:conversation.id,
      userId:{
        [Op.not]:conversation.senderId,
      }
    }
  });

  let recieverName= await users.findOne({
    where:{
      id:recieverId.dataValues.userId,
    }
  });

  // check if the user is connected
  let status
  if (newConnectedClients[recieverName.username]) {
    status = 'seen';
  }else{
    status = 'unseen';
  }
  
    let modifiedMsgObj={
      body:conversation.body,
      contentType:'text',
      createdAt:conversation.createdAt,
      senderId:conversation.senderId,
      recieverId:recieverId.dataValues.userId,
      conversationId:conversation.id,
      status:status,

    }

    let newMessage = await newMessagesModal.create(modifiedMsgObj);
    console.log('recieverName',recieverName.username);

    // socket.emit('update-conversation');
    // socket.broadcast.emit('update-conversation');
    socket.emit('send-back-message',newMessage);
    // newConnectedClients[recieverName.username].emit('send-back-message',newMessage);

    if (newConnectedClients[recieverName.username]) {
      console.log('>>>>>>>>>>>>>>>>>>> i am inside the condition ')
      newConnectedClients[recieverName.username].emit('send-back-message',newMessage);
      // socket.broadcast.emit('send-back-message',newMessage);
  } else {
      console.log(`User ${recieverName.username} is not connected!`);
  }

  });

  socket.on('click-conversation', async (data) => {
    let { conversationId, userId }= data
    let conversationToUpdate = await conversationsModal.findOne({
      where: {
        id: conversationId,
      }
    });
    //convert messages staus from unseen to seen

    let messages = await newMessagesModal.findAll({
      where: {
        conversationId: conversationId,
        recieverId: userId,
      }
    });

    let updatedMessages = messages.map(async (message) => {
      let updatedMessage = await newMessagesModal.update({ status: 'seen' }, {
        where: {
          id: message.dataValues.id,
        }
      });
    });

    socket.emit('update-clicked-conversation');

  
 
  });


//   socket.on('checkout user', () => {
//     const name = socketToUserMap[socket.id];
//     if (name) {
//         delete newConnectedClients[name];
     
//     }
// });


  socket.on('checkout user', name => {
    if (newConnectedClients[name]) {
      delete newConnectedClients[name];
    }
  });
  socket.on('disconnect', () => {
    //delete the user from newConnectedClients
    console.log('user disconnected');
    // delete newConnectedClients[socket.id];
    console.log('after delete connectedClients', Object.keys(newConnectedClients));

  })

});


// =========================================================================================================

notification.on('connection', socket => {


  console.log('A user connected.');



  socket.on('join-renter', () => {
    console.log('Renter joined the system.');
  });

  socket.on('join-Provider', () => {
    console.log('Provider joined the system.');
    //  console.log("*********************",chargerId);
  });

  socket.on('send-request-for-charger', (chargerId) => {
    console.log(`Renter sent a request for the Provider to rent the charger ${chargerId}`);
    socket.broadcast.emit('received-request-for-charger', chargerId);

  });
  io.emit('send-request-for-charger-from-renter-side')

  socket.on('Provider-accepted-request', (chargerId) => {
    console.log(`Provider accepted the renter request for charger ${chargerId}`);
    notification.emit('system received first notification');

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
app.use('/api/mhmd', mhmdRoutes);

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

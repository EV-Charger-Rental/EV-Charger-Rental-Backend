const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const plugOwnerHeader = document.getElementById('plugOwner');

// Get username and room from URL
const { username, plugOwner } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log('username', username);
console.log('plugOwner', plugOwner);


const socket = io('/peer-to-peer');// io() is a function that is available to us because we imported the socket.io script in chat.html

// socket.on('message', (message) => {
//     console.log(message);
// });

// // Join chatroom
// socket.emit('joinRoom', { username, room });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// // Message from server
// socket.on('message', (message) => {
//   console.log(message);
//   outputMessage(message);// Output message to DOM

//   // Scroll down
//   chatMessages.
//   scrollTop = // scrollTop is a DOM property that sets or returns the number of pixels an element's content is scrolled vertically.
//   chatMessages.// chatMessages is a DOM element that contains all the messages
//   scrollHeight; // scrollHeight is a DOM property that returns the height of an element in pixels, including padding, but not the border, scrollbar or margin.
// });

// // Message submit
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;

//   msg = msg.trim();// remove white space from both ends of a string

//   if (!msg) {
//     return false;
//   }

//   // Emit message to server
//   socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });

// // Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.chat-messages').appendChild(div);
// }

// // Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

// //Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//   const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//   if (leaveRoom) {
//     window.location = '../index.html';
//   } else {
//   }
// });

socket.emit('checkin user', username);


//check if plugOwner is online 

socket.emit('checkout users a vailabilty', plugOwner);
socket.on('plugOwner online', plugOwner => {
  console.log('plugOwner online', plugOwner);
  // outputMessage(msg);
})

//get the reciever username
outputPlugOwnerHeader(plugOwner);

//get pervious messages
socket.emit('getpreviousPrivateMessages', {plugOwner, username});

//get the messages history between two users and display it
socket.on('perviousPrivateMessages', (messages) => {
  console.log('===================previousMessages', messages);
  for (const message of messages) {
    console.log('message', message);
    outputpreviousprivateMessages(message);
  }

  // Scroll down
  chatMessages.
  scrollTop = // scrollTop is a DOM property that sets or returns the number of pixels an element's content is scrolled vertically.
  chatMessages.// chatMessages is a DOM element that contains all the messages
  scrollHeight; // scrollHeight is a DOM property that returns the height of an element in pixels, including padding, but not the border, scrollbar or margin.


});


socket.on('plugOwner offline', plugOwner => {
  console.log('plugOwner offline', plugOwner);
  // outputMessage(msg);
})



// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();// remove white space from both ends of a string
  
  if (!msg) {
    return false;
  }
  
  // Emit message to server
  socket.emit('private message',{plugOwner,msg,username})
  
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
  usersOwnMessage("me",msg);
  
  // Scroll down
  chatMessages.
  scrollTop = // scrollTop is a DOM property that sets or returns the number of pixels an element's content is scrolled vertically.
  chatMessages.// chatMessages is a DOM element that contains all the messages
  scrollHeight; // scrollHeight is a DOM property that returns the height of an element in pixels, including padding, but not the border, scrollbar or margin.
  
});


// socket.emit('private message',{plugOwner,msg:'hello from user'})
// reseved message
socket.on('private message', ({plugOwner,msg,username}) => {
  console.log('private message', msg);
  outputMessage({username,msg});

// Scroll down
  chatMessages.
  scrollTop = // scrollTop is a DOM property that sets or returns the number of pixels an element's content is scrolled vertically.
  chatMessages.// chatMessages is a DOM element that contains all the messages
  scrollHeight; // scrollHeight is a DOM property that returns the height of an element in pixels, including padding, but not the border, scrollbar or margin.


})

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  // p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.msg;
  // para.innerText = message;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function usersOwnMessage(username,msg){

console.log('+++++++++++++++++hello broder')
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = username;
  // p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = msg;
  // para.innerText = message;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);

    
}

function outputPlugOwnerHeader(plugOwner){
    plugOwnerHeader.innerHTML = `<i class="fas fa-smile"></i> ${plugOwner}`;
//   plugOwnerHeader.innerText = plugOwner;
}

function outputpreviousprivateMessages(message){

  // console.log('===================>>>>>>>>>message', message);
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  if(message.sender === username){
    p.innerText = 'me';
  }
  else{
    p.innerText = message.sender;
  }
  // p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.message;
  // para.innerText = message;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });
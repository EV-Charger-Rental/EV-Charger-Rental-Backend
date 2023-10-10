const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, { 
  ignoreQueryPrefix: true,
});

const socket = io(); // io() is a function that is available to us because we imported the socket.io script in chat.html

socket.on('message', (message) => {
    console.log(message);
});

// Join chatroom
socket.emit('joinRoom', { username, room });


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.emit('getMessages', room);

socket.on('perviousMessages', (messages) => {
  messages.forEach((message) => {
    allpreviousMessages(message);
  });

   // Scroll down
   chatMessages.
   scrollTop = // scrollTop is a DOM property that sets or returns the number of pixels an element's content is scrolled vertically.
   chatMessages.// chatMessages is a DOM element that contains all the messages
   scrollHeight; // scrollHeight is a DOM property that returns the height of an element in pixels, including padding, but not the border, scrollbar or margin.

});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);// Output message to DOM

  // Scroll down
  chatMessages.
  scrollTop = // scrollTop is a DOM property that sets or returns the number of pixels an element's content is scrolled vertically.
  chatMessages.// chatMessages is a DOM element that contains all the messages
  scrollHeight; // scrollHeight is a DOM property that returns the height of an element in pixels, including padding, but not the border, scrollbar or margin.
});

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
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// All previous messages
function allpreviousMessages(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;

  // Parse the ISO timestamp into a Date object
  const time = new Date(message.createdAt);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  
  // Convert 24-hour time to AM/PM format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  
  const createdAt = `${displayHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

  p.innerHTML += `<span>${createdAt}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.message;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}





// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});



const socketIO=require('socket.io-client');

var socket = socketIO.connect('http://localhost:4000');
console.log(socket)
socket.on('newMessage', (newMessage)=>{
    console.log('newMessage', newMessage);
  })




socket.on('newUser',(message)=>{
    console.log(message)
})

socket.on('move',(message)=>{
    console.log("the following usermove"+message.username)
})

const socketIO=require('socket.io-client');

var socket = socketIO.connect('http://localhost:4000');
console.log(socket)
socket.emit("joinroom",JSON.stringify({room:"bola",username:"tolaa"}))
socket.emit("onsit",JSON.stringify({table:"table1",chair:"chair1"}))
socket.on('newMessage', (newMessage)=>{
    console.log('newMessage', newMessage);
  })





socket.on('initUser',(message)=>{
    console.log(message)
})

socket.on('move',(message)=>{
    console.log("the following usermove"+message.username)
})

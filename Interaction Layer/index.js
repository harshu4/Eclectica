const express=require('express');
const socketIO=require('socket.io')
const http=require('http');
const { abort } = require('process');
const port=process.env.PORT||4000
var app=express();
let server = http.createServer(app)
var io=socketIO(server);
//playerobjects with current state
var players = {};
//string containing rooms
var rooms = [];

//for converting players to list
//replace with better alternative
function playertolist(players){
    let playerslist = [];
    for (var key in players) {
        console.log(key)
        playerslist.push(players[key])
    }
    
    return playerslist
}

// make connection with user from server side
io.on('connection', (socket)=>{
socket.emit('initUser',{users:playertolist(players)});
//emit message from server to user
socket.on('spawnuser',(message)=>{
socket.username = message.username;
socket.broadcast.emit('spawnuser', {
    
	location:[0,0,0],
        username: "hello"
});
})

socket.on('register',(message) =>{
    message = JSON.parse(message)
    socket.username  = message.username
    if (players[message.username]){
        socket.emit("changeUsername",{error:"Please change Username"})
    }
    players[message.username] = message;
   
    socket.broadcast.emit('newUser',message);

})


// listen for message from user
socket.on('move', (message)=>{
    message = JSON.parse(message)
	message.username = socket.username;
    
    socket.broadcast.emit("updateUser",message);
});



// when server disconnects from user
socket.on('disconnect', ()=>{
	delete players[socket.username]
    socket.broadcast.emit("removeUser",{username:socket.username})
});
});

server.listen(port);

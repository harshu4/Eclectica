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
function playertolist(players,token){
    let playerslist = [];
    for (var key in players[token]["player"]) {
        
        playerslist.push(players[token]["player"][key])
    }
    
    return playerslist
}

// make connection with user from server side
io.on('connection', (socket)=>{
socket.on('joinroom',(message)=>{
    try{
    message = JSON.parse(message)
    socket.username = message.username;
    if (players[message.room] == undefined){
        players[message.room] = {tables:1,totaltable:10,teams:{},player:{}};
    }
    console.log(playertolist(players,message.room))
    socket.emit('initUser', {
        users:playertolist(players,message.room),
        present:players[message.room].present
    });
   


socket.username = message.username;
socket.room = message.room;
socket.join(message.room);
    }
    catch(e)
{
    console.log(e)
}
})

socket.on('createteam',(message) =>{
    try{
    message = JSON.parse(message)
    if(players[socket.room].teams[message.team] == undefined){

    
    players[socket.room].teams[message.team] = {table:`table${players[socket.room].tables.toString()}`}
    players[socket.room].tables++;
    socket.emit("teamtable",JSON.stringify({table:players[socket.room].teams[message.team].table}))

    }
}
catch(e){
console.log(e)
}
})


socket.on('jointeam',(message) =>{
    try{
    message = JSON.parse(message)
    if(players[socket.room].teams[message.team] == undefined){
        players[socket.room].teams[message.team] = {table:`table${players[socket.room].tables.toString()}`}
        players[socket.room].tables++;
        
        socket.emit("teamtable",JSON.stringify({table:players[socket.room].teams[message.team].table}))
    
        return
        
    }
    socket.emit("teamtable",players[socket.room].teams[message.team].table)
    
    }
    catch(e){
        console.log(e)
    }
})

socket.on('onsit',(message) =>{
    try{
    message = JSON.parse(message);
    message.username = socket.username;
    players[socket.room]["player"][socket.username] = message;
    
    socket.to(socket.room).emit('newUser',message);
    }
    catch(e){
        console.log(e)
    }
})
socket.on('onstand',(message) =>{
    try{
    message = JSON.parse(message);
    delete players[socket.room]["player"][socket.username]
    message.username = socket.username;
    socket.to(socket.room).emit('removeUser',message);
    }
    catch(e){
        console.log(e)
    }
})

socket.on('onpresent',(message) =>{
    try{
    message = JSON.parse(message);
    console.log("presentation started");
    players[socket.room].present = "1";
    players[socket.room].presuser = socket.username;
    message.username = socket.username;
    socket.to(socket.room).emit('present',socket.username);

    }
    catch(e){
        console.log(e)
    }
})

socket.on('onstoppresent',(message) =>{
    try{
    message = JSON.parse(message);
    console.log("presentation stopped");
    message.username = socket.username;
    
    players[socket.room].present = "0";
    socket.to(socket.room).emit('presentstop',socket.username);
    }
    catch(e){
        console.log(e)
    }
})


// listen for message from user



// when server disconnects from user
socket.on('disconnect', ()=>{
    try{
	console.log(socket.username);
    delete players[socket.room]["player"][socket.username]
    if (socket.username == players[socket.room].presuser ){
        players[socket.room].present = "0";  
        socket.to(socket.room).emit('presentstop',socket.username);
    }
    
    socket.broadcast.emit("removeUser",{username:socket.username})
    }
    catch(e){
        console.log(e)
    }
});
});

server.listen(port);

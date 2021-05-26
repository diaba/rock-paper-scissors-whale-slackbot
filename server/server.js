
// required modules
const http = require('http');
const express = require('express'); // listener to the server
const socketio = require('socket.io'); // will return server which you can use to talk to clients

const RpslsGame =  require('./rpsls-game'); 
const app = express();// since express handles client connections

const clientPath = `${__dirname}/../client`; //dirname is the same level as the directory of this file 
console.log(`Serving static from ${clientPath}`);

//to serve static files - adding a middleware
app.use(express.static(clientPath));


const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer;

// function notifyBothPlayers(sockA, sockB, msg_type, msg) {
// 	[sockA, sockB].forEach((sock) => sock.emit(msg_type, msg));
// }

io.on('connection', (sock) => { //when a connection event happens
	//sock.emit('message', "connection event!"); // sock.emit sends the message to jus a single client


	if (waitingPlayer) {
		// both connected player and connect player will recieve a message saying match start
		//notifyBothPlayers(sock, waitingPlayer, 'message', 'Match Starts');
		new RpslsGame(waitingPlayer, sock);
		sock.emit("message", "You are player 2.");
		waitingPlayer = null;

	} else {
		waitingPlayer = sock;
		sock.emit("message", "You are player 1.");
		sock.emit("message", "waiting for another player to join");
	}


	sock.on('message', (text) =>{
		io.emit('message', text); //send back message to EVERYONE that is connected

	})
});



server.on('error', (err) => { // event listener for errors
	console.error('server error: ', err)
});

server.listen(8080, () => { //listens to port 8080
	console.log("rps started on 8080");
});
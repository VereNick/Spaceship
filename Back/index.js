var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
	cors: {
		origin: "http://127.0.0.1:8080",
		methods: ["GET", "POST", "DELETE", "PUT", "POST", "UPDATE"], 
		credentials: true
	},
	allowEIO3: true
});
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.json();
app.use(urlencodedParser, (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "authorization, Origin, Content-type");
	if (req.method == "OPTIONS") {
		return res.status(200).send("ok");
	}
	next();
});
app.get('/', (req, res, next) => {
	res.status(200).send("ok");
});

server.listen(3000);
console.log(123);
users = [];
connections = [];

io.on('connection', function (socket) {
	socket.on('disconnect', function () {
		users.slice(connections.indexOf(socket), 1);
		connections.slice(connections.indexOf(socket), 1);
	});
	socket.on('login', function (ship) {
		users.push(ship);
		connections.push(socket);
		io.sockets.emit('update', ship);
		//console.log(ship);
	});
})
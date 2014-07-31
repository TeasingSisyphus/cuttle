var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
console.log('Server has started');

app.get('/', function (req, res) {
  res.sendfile('./index.html');
});

var Player = function() {
	this.hand = [];
	this.field = [];
}

var Game = function() {
	this.cards =
	["c1", "c2", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13",
	"d1", "d2", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13",
	"h1", "h2", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12", "h13",
	"s1", "s2", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"
	];
	this.deck = this.cards;
	this.p1 = new Player();
	this.p2 = new Player();

}
var count = 0;
var game = new Game();
io.on('connection', function (socket){
	console.log('request made');
	socket.on('touch', function (num){
		count++;
		console.log(game.cards[num]);
		socket.emit('gamesend', game);
	});
});
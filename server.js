////////////////
//Dependencies//
////////////////

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(3000);
console.log('Server has started');

app.get('/', function (req, res) {
  res.sendfile('./index.html');
});

//////////////////////
//Object Definitions//
//////////////////////

//Player Object has two array attributes: hand and field
var Player = function() {
	this.hand = [];
	this.field = [];
}

//Game Object has two Player attributes: p1, p2,
//an array with all cards: cards
//an array with all cards in the current deck (ie not in a hand or field): deck

var Game = function() {
	this.cards =
	["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13",
	"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13",
	"h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12", "h13",
	"s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"
	];
	this.deck = this.cards;
	this.p1 = new Player();
	this.p2 = new Player();

}
//////////////////////
//Method Definitions//
//////////////////////

//shuffle method shuffles all cards in deck
Game.prototype.shuffle = function() {
	//len_index keeps track of where we are in shuffling loop
	var len_index = this.deck.length;
	//random_index is randomly selected and used to shuffle
	var random_index = 0;
	var temp = '';
	//Loops until we have switched each place at least once
	while (0 != len_index) {
		random_index = Math.floor(Math.random() * len_index);
		len_index -= 1;
	//Switches deck[len_index] with deck[random_index]
		temp = this.deck[len_index];
		this.deck[len_index] = this.deck[random_index];
		this.deck[random_index] = temp;
	}
};

////////////////////
//Object Instances//
////////////////////
var count = 0;
var game = new Game();

/////////////////////
//Socket Connection//
/////////////////////

//This function executes when a client connects to the server
io.on('connection', function (socket){
	//registers request on server
	console.log('request made');

	//function executes when user pushes 'pick a card'
	//Alerts client of nth card in deck (n incriments as 'pick a card' is clicked)
	//and logs nth card in console on server
	socket.on('card', function (num){
		count++;
		console.log(game.cards[num]);
		socket.emit('gamesend', game);
	});

	//function executes when user clicks 'shuffle'
	//shuffles deck and emits 'shuffled' event, passing game object through socket
	socket.on('shuffle', function () {
		console.log('shuffle requested');
		game.shuffle();
		game.shuffle();
		game.shuffle();
		console.log('shuffles made');
		socket.emit('shuffled', game);
		console.log('shuffle emitted');
	});
});
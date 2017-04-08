
var http = require('http'),
	path = require('path'),
	fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

let express = require('express');
let app = express();
let _dirname = './'

function handleRequest(request, response) {
	var lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url),
		file = lookup.substring(1, lookup.length);

	console.log('request: ' + request.url);
	fs.exists(file, function(exists) {
		if (exists) {
			console.log('Trying to send: ' + lookup);
			fs.readFile(file, function(err, data) {
				var headers = { 'Content-type': mimeTypes[path.extname(lookup)] };

				if (err) {
					response.writeHead(500);
					response.end('Server Error!');
				} else {
					response.writeHead(200, headers);
					response.end(data);
				}
			});
		} else {
			console.log('Failed to find/send: ' + lookup);
			response.writeHead(404);
			response.end();
		}
	});
}
app.get('/', function(req, res){
    res.sendFile('index.html', {root: _dirname});
});
app.use('./', express.static(_dirname + './'));

let serv = http.createServer(handleRequest).listen(3000, function() {
	console.log('Server is listening on port 3000');
});

//serv.listen(2000);
//console.log('Server started.');

let SOCKET_LIST = {};
let PLAYER_LIST = {};
let lobbyPlayers = 0;

let Player = function(id){
    let self = {
        x: 250,
        y: 250,
        id: id,
        number: Math.floor(10 * Math.random()),
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        maxSpd: 10
    }
    self.updatePostition = function(){
        if(self.pressingRight){
            self.x += self.maxSpd;
        }
        if(self.pressingLeft){
            self.x -= self.maxSpd;
        }
        if(self.pressingUp){
            self.y -= self.maxSpd;
        }
        if(self.pressingDown){
            self.y += self.maxSpd;
        }
    }
    return self;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    let player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('keyPress', function(data){
        if(data.inputId == 'up'){
            player.pressingUp = data.state;
        }
        else if(data.inputId == 'left'){
            player.pressingLeft = data.state;
        }
        else if(data.inputId == 'down'){
            player.pressingDown = data.state;
        }
        else if(data.inputId == 'right'){
            player.pressingRight = data.state;
        }
    });

    socket.on('lobby', function(data){
        if(data == 'enter'){
            lobbyPlayers++;
            if(lobbyPlayers == 2){
                for(var i in SOCKET_LIST){
                    let socket = SOCKET_LIST[i];
                    let pack = {};
                    socket.emit('startNewGame', pack);
                }
            }
        }
        else if(data == 'exit'){
            lobbyPlayers--;
        }
    });

});

// let gameLoop = function(){
//     let pack = [];
//     for(var i in PLAYER_LIST){
//         let player = PLAYER_LIST[i];
//         player.updatePostition();
//         pack.push({
//             x: player.x,
//             y: player.y,
//             number: player.number
//         });
        
//     }
//     for(var i in SOCKET_LIST){
//         let socket = SOCKET_LIST[i];
//         socket.emit('newPosition', pack);
//     }
//     let animation = window.requestAnimationFrame(gameLoop);
// }
// gameLoop();

setInterval(function(){
    let pack = [];
    for(var i in PLAYER_LIST){
        let player = PLAYER_LIST[i];
        player.updatePostition();
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number
        });
    }
    for(var i in SOCKET_LIST){
        let socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

},1000/25);

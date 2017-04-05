let express = require('express');
let app = express();
let serv = require('http').Server(app);
let _dirname = './'

app.get('/', function(req, res){
    res.sendFile('client/index.html', {root: __dirname });
});
app.use('/client', express.static(_dirname + '/client'));

serv.listen(2000);
console.log('Server started.');

let SOCKET_LIST = {};
let PLAYER_LIST = {};

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
io.sockets.on('connection', function(socket){ //whenever there is a connection this funciton will be called
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

});

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

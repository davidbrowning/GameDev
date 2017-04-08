let express = require('express');
let app = express();
let serv = require('http').Server(app);
let _dirname = './'

app.get('/', function(req, res){
    res.sendFile('/client/index.html', {root: _dirname});
});
app.use('/client', express.static(_dirname + '/client'));

serv.listen(2000);
console.log('Server started.');

let SOCKET_LIST = {};
let PLAYER_LIST = {};
let lobbyPlayers = 0;
let GRAVITY = 0.3;

let MyLevels = (function(){
    let that = {};
    that.first = {};
    that.first.boxes = [];
    function makeBox(x, y, w, h){
        return {x: x, y: y, w: w, h: h};
    }
    that.initialize = function(){
        that.first.boxes.push(makeBox(0, 450, 1000, 50));
        that.first.boxes.push(makeBox(1050, 450, 500, 50));
        that.first.boxes.push(makeBox(1550, 400, 500, 100));
        that.first.boxes.push(makeBox(2150, 450, 1000, 50));
        that.first.boxes.push(makeBox(3200, 450, 1000, 50));
        that.first.boxes.push(makeBox(4250, 450, 500, 50));
        that.first.w = 4750;
        that.first.h = 500;
    };
    return that;
}());

let Player = function(id){
    let self = {
        x: 250,
        y: 440,
        w: 10,
        h: 10,
        id: id,
        number: Math.floor(10 * Math.random()),
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        xSpeed: 10,
        ySpeed: 0,
        state: 'ground'
    }
    self.updatePostition = function(){
        if(self.state == 'jump'){
            self.ySpeed += GRAVITY;
        }
        else {
            self.ySpeed = 0;
        }
        if(self.pressingRight){
            self.x += self.xSpeed;
        }
        if(self.pressingLeft){
            self.x -= self.xSpeed;
        }
        self.y += self.ySpeed;
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
        else if(data.inputId == 'jump'){
            console.log('Jump on Server');
            player.y = 439
            player.ySpeed = 10;
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

function update(elapsedTime){
    let pack = [];
    for(var i in PLAYER_LIST){
        let player = PLAYER_LIST[i];
        player.updatePostition();
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number,
            id: player.id
        });
    }
    for(var i in SOCKET_LIST){
        let socket = SOCKET_LIST[i];
        for(let j = 0; j < pack.length; j++){
            if(pack[j].id == i){
                pack[j].myPlayer = true;
            }
            else {
                pack[j].myPlayer = false;
            }
        }
        socket.emit('newPosition', pack);
    }
}

setInterval(function(){
    let elapsedTime;
    update(elapsedTime);

},1000/25);
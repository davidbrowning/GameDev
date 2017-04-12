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
let GRAVITY = 5;
let count = 0;
let ENEMY_SPEED = 15;

let MyLevels = (function(){
    let that = [];
    for(let i = 0; i < 5; i++){
        that.push({
            boxes: [],
            enemies: []
        });
    }
    function makeBox(x, y, w, h, s){
        return {x: x, y: y, w: w, h: h, s: s};
    }
    function makeEnemy(x, y, w, h, s, ix, ex){
        return {
            x: x,
            y: y,
            w: w,
            h: h,
            speed: s,
            initialx: ix,
            endx: ex
        }
    }
    that[0].boxes.push(makeBox(-10, 450, 1000, 50));
    that[0].boxes.push(makeBox(1050, 450, 600, 50));
    that[0].boxes.push(makeBox(1550, 420, 500, 100));
    that[0].boxes.push(makeBox(2140, 450, 1000, 50));
    that[0].boxes.push(makeBox(3200, 450, 1000, 50));
    that[0].boxes.push(makeBox(4250, 450, 500, 50));
    that[0].enemies.push(makeEnemy(1050, 440, 10, 10, ENEMY_SPEED, 1050, 1540));
    that[0].enemies.push(makeEnemy(1550, 410, 10, 10, ENEMY_SPEED, 1550, 2040));
    that[0].enemies.push(makeEnemy(2140, 440, 10, 10, ENEMY_SPEED, 2140, 2600));
    that[0].enemies.push(makeEnemy(2640, 440, 10, 10, ENEMY_SPEED, 2640, 3130));
    that[0].enemies.push(makeEnemy(3200, 440, 10, 10, ENEMY_SPEED, 3200, 3520));
    that[0].enemies.push(makeEnemy(3533, 440, 10, 10, ENEMY_SPEED, 3533, 3850));
    that[0].enemies.push(makeEnemy(3867, 440, 10, 10, ENEMY_SPEED, 3867, 4190));
    that[0].w = 4740;
    that[0].h = 500;
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

    function colCheck(shapeA, shapeB) {
        // get the vectors to check against
        var vX = (shapeA.x + (shapeA.w / 2)) - (shapeB.x + (shapeB.w / 2)),
            vY = (shapeA.y + (shapeA.h / 2)) - (shapeB.y + (shapeB.h / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.w / 2) + (shapeB.w / 2),
            hHeights = (shapeA.h / 2) + (shapeB.h / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = "top";
                    shapeA.y += oY + 0.1;
                } else {
                    colDir = "bottom";
                    shapeA.y -= oY - 0.1;
                    shapeA.state = 'ground';
                }
            } else {
                if (vX > 0) {
                    colDir = "left";
                    shapeA.x += oX + 0.1;
                } else {
                    colDir = "right";
                    shapeA.x -= oX - 0.1;
                }
            }
        }
        return colDir;
    }

    function updateCollision(){
        let grounded = false;
        for(let i = 0; i < MyLevels[0].boxes.length; i++){
            let box = MyLevels[0].boxes[i];
            let colDir = colCheck(self, box);
            if(colDir == 'bottom'){
                grounded = true;
            }
        }
        if(!grounded){
            self.state = 'jump';
            count++;
            //console.log('Not Grounded Count: ' + count);
        }
        for(let i = 0; i < MyLevels[0].enemies.length; i++){
            let enemy = MyLevels[0].enemies[i];
            let colDir = colCheck(self, enemy);
            if(colDir != null){
                console.log('You are dead.');
            }
        }
    };

    self.updatePosition = function(){
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
        if(self.x < 0){
            self.x = 0;
        }
        else if(self.x > MyLevels[0].w){
            self.x = MyLevels[0].w - self.w;
        }
        self.y += self.ySpeed;
        updateCollision();
    };
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
            //console.log('Jump on Server');
            if(player.state != 'jump'){
                player.ySpeed = -30;
                player.state = 'jump';
            }
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
    let pack = {
        players: [],
        enemies: []
    };
    for(let i = 0; i < MyLevels[0].enemies.length; i++){
        let enemy = MyLevels[0].enemies[i];
        enemy.x += enemy.speed;
        if(enemy.x < enemy.initialx){
            enemy.speed = ENEMY_SPEED;
            enemy.x = enemy.initialx;
        }
        else if(enemy.x > enemy.endx){
            enemy.speed = -ENEMY_SPEED;
            enemy.x = enemy.endx;
        }
        pack.enemies.push({
            x: enemy.x,
            y: enemy.y
        })
    }
    for(var i in PLAYER_LIST){
        let player = PLAYER_LIST[i];
        player.updatePosition();
        pack.players.push({
            x: player.x,
            y: player.y,
            number: player.number,
            id: player.id,
            l: player.pressingLeft,
            r: player.pressingRight,
            j: (player.state === 'jump')
        });
    }
    for(var i in SOCKET_LIST){
        let socket = SOCKET_LIST[i];
        for(let j = 0; j < pack.players.length; j++){
            if(pack.players[j].id == i){
                pack.players[j].myPlayer = true;
            }
            else {
                pack.players[j].myPlayer = false;
            }
        }
        socket.emit('newPosition', pack);
    }
}

setInterval(function(){
    let elapsedTime;
    update(elapsedTime);
},1000/25);

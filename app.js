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
let TERMINAL_VELOCITY = 40;
let ENEMY_SPEED = 5;
let currentLevel = 2;
let finishedLevelCount = 0;
let gameStarted = false;
let attacks = [];
let deleteAttacks = [];

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
            endx: ex,
            character: 95,
            dead: false
        }
    }
    //Level 0
    that[0].boxes.push(makeBox(-10, 450, 1000, 50));
    that[0].boxes.push(makeBox(1050, 450, 1000, 50));
    that[0].boxes.push(makeBox(1550, 420, 500, 40));
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
    that[0].endPoint = makeBox(4680, 430, 20, 25);
    that[0].w = 4740;
    that[0].h = 500;

    //Level 1
    that[1].boxes.push(makeBox(-10, 450, 1000, 50));
    that[1].boxes.push(makeBox(1050, 450, 3500, 50));
    that[1].boxes.push(makeBox(1550, 410, 3000, 50));
    that[1].boxes.push(makeBox(2050, 370, 2500, 50));
    that[1].boxes.push(makeBox(2550, 330, 500, 50));
    that[1].boxes.push(makeBox(3550, 330, 1000, 50));
    that[1].boxes.push(makeBox(4600, 330, 50, 170));
    that[1].boxes.push(makeBox(4700, 370, 50, 130));
    that[1].boxes.push(makeBox(4800, 410, 50, 90));
    that[1].boxes.push(makeBox(4900, 450, 50, 50));
    that[1].boxes.push(makeBox(5000, 450, 100, 50));
    that[1].enemies.push(makeEnemy(750, 440, 10, 10, ENEMY_SPEED, 750, 1000));
    that[1].enemies.push(makeEnemy(725, 440, 10, 10, ENEMY_SPEED, 725, 975));
    that[1].enemies.push(makeEnemy(700, 440, 10, 10, ENEMY_SPEED, 700, 950));
    that[1].enemies.push(makeEnemy(675, 440, 10, 10, ENEMY_SPEED, 675, 925));
    that[1].enemies.push(makeEnemy(650, 440, 10, 10, ENEMY_SPEED, 650, 900));
    that[1].enemies.push(makeEnemy(625, 440, 10, 10, ENEMY_SPEED, 625, 875));

    that[1].enemies.push(makeEnemy(1050, 440, 10, 10, ENEMY_SPEED, 1050, 1500));
    that[1].enemies.push(makeEnemy(1275, 440, 10, 10, ENEMY_SPEED, 1080, 1540));
    that[1].enemies.push(makeEnemy(1540, 440, 10, 10, ENEMY_SPEED, 1050, 1550));

    that[1].enemies.push(makeEnemy(1550, 400, 10, 10, ENEMY_SPEED, 1550, 2000));
    that[1].enemies.push(makeEnemy(1775, 400, 10, 10, ENEMY_SPEED, 1580, 2040));
    that[1].enemies.push(makeEnemy(2040, 400, 10, 10, ENEMY_SPEED, 1550, 2050));

    that[1].enemies.push(makeEnemy(2050, 360, 10, 10, ENEMY_SPEED, 2050, 2500));
    that[1].enemies.push(makeEnemy(2275, 360, 10, 10, ENEMY_SPEED, 2080, 2540));
    that[1].enemies.push(makeEnemy(2540, 360, 10, 10, ENEMY_SPEED, 2050, 2550));

    that[1].enemies.push(makeEnemy(2550, 320, 10, 10, ENEMY_SPEED, 2550, 3000));
    that[1].enemies.push(makeEnemy(2775, 320, 10, 10, ENEMY_SPEED, 2580, 3040));
    that[1].enemies.push(makeEnemy(3040, 320, 10, 10, ENEMY_SPEED, 2550, 3050));

    that[1].enemies.push(makeEnemy(3050, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3100, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3150, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3200, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3250, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3300, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3350, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3400, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3450, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3500, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3300, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3350, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3400, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3450, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));
    that[1].enemies.push(makeEnemy(3500, 360, 10, 10, ENEMY_SPEED * (Math.random() + 1), 3050, 3540));

    that[1].enemies.push(makeEnemy(3550, 320, 10, 10, ENEMY_SPEED*.5, 3550, 4500));
    that[1].enemies.push(makeEnemy(3775, 320, 10, 10, ENEMY_SPEED*.5, 3580, 4540));
    that[1].enemies.push(makeEnemy(4040, 320, 10, 10, ENEMY_SPEED*.5, 3550, 4550));
    that[1].enemies.push(makeEnemy(3550, 320, 10, 10, ENEMY_SPEED, 3550, 4500));
    that[1].enemies.push(makeEnemy(3775, 320, 10, 10, ENEMY_SPEED, 3580, 4540));
    that[1].enemies.push(makeEnemy(4040, 320, 10, 10, ENEMY_SPEED, 3550, 4550));
    that[1].enemies.push(makeEnemy(3550, 320, 10, 10, ENEMY_SPEED*1.5, 3550, 4500));
    that[1].enemies.push(makeEnemy(3775, 320, 10, 10, ENEMY_SPEED*1.5, 3580, 4540));
    that[1].enemies.push(makeEnemy(4040, 320, 10, 10, ENEMY_SPEED*1.5, 3550, 4550));
    that[1].enemies.push(makeEnemy(3550, 320, 10, 10, ENEMY_SPEED*2, 3550, 4500));
    that[1].enemies.push(makeEnemy(3775, 320, 10, 10, ENEMY_SPEED*2, 3580, 4540));
    that[1].enemies.push(makeEnemy(4040, 320, 10, 10, ENEMY_SPEED*2, 3550, 4550));
    
    that[1].enemies.push(makeEnemy(4600, 320, 10, 10, ENEMY_SPEED, 4600, 4640));
    that[1].enemies.push(makeEnemy(4700, 360, 10, 10, ENEMY_SPEED, 4700, 4740));
    that[1].enemies.push(makeEnemy(4800, 400, 10, 10, ENEMY_SPEED, 4800, 4840));
    that[1].enemies.push(makeEnemy(4900, 440, 10, 10, ENEMY_SPEED, 4900, 4940));

    that[1].endPoint = makeBox(5040, 430, 20, 25);
    that[1].w = 5100;
    that[1].h = 500;

    //Level 2
    that[2].boxes.push(makeBox(-10, 1000, 730, 50));
    that[2].boxes.push(makeBox(220, 700, 500, 300));
    that[2].boxes.push(makeBox(150, 700, 200, 50));
    that[2].boxes.push(makeBox(0, 0, 100, 850));

    that[2].boxes.push(makeBox(820, 400, 500, 650));
    that[2].boxes.push(makeBox(1420, 1000, 560, 50));
    that[2].boxes.push(makeBox(1420, 250, 100, 600));
    that[2].boxes.push(makeBox(1640, 400, 340, 620));
    that[2].boxes.push(makeBox(1880, 0, 100, 420));

    that[2].boxes.push(makeBox(1580, 700, 80, 50));
    that[2].boxes.push(makeBox(1580, 400, 80, 50));
    that[2].boxes.push(makeBox(1500, 550, 80, 50));
    that[2].boxes.push(makeBox(1500, 250, 80, 50));
    that[2].boxes.push(makeBox(1820, 0, 80, 50));
    that[2].boxes.push(makeBox(1700, 175, 50, 50));

    that[2].boxes.push(makeBox(80, 300, 1340, 50));

    that[2].endPoint = makeBox(5040, 430, 20, 25);
    that[2].w = 1980;
    that[2].h = 1050;
    return that;
}());
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
                shapeA.x += oX - 0.1;
            } else {
                colDir = "right";
                shapeA.x -= oX - 0.1;
            }
        }
    }
    return colDir;
}
let Player = function(id){
    let self = {
        x: 50,
        y: 990,
        w: 20,
        h: 30,
        id: id,
        number: Math.floor(10 * Math.random()),
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        xSpeed: 10,
        ySpeed: 0,
        state: 'ground',
        deadCount: 0,
        finished: false,
        attacking: false
    }

    function dead(){
        self.x = 50;
        self.y = 440;
        self.ySpeed = 0;
        self.deadCount++;
        console.log('Deaths: ' + self.deadCount);
    }
    function win(){
        if(!self.finished){
            console.log('You win!');
            self.finished = true;
            finishedLevelCount++;
        }
    }
    self.attack = function(){
        let range = {};
        range.x = self.x - 250;
        range.y = self.y - 250;
        range.w = 500;
        range.h = 500;
        let distance = 500;
        let index = null;
        for(let i = 0; i < MyLevels[currentLevel].enemies.length; i++){
            let colDir = colCheck(range, MyLevels[currentLevel].enemies[i]);
            if(colDir != null){
                let temp = Math.abs(self.x - MyLevels[currentLevel].enemies[i].x);
                if(temp < distance){
                    distance = temp;
                    index = i;
                }
            }
        }
        return index;
    }
    function updateCollision(){
        let grounded = false;
        let climbing = false;
        for(let i = 0; i < MyLevels[currentLevel].boxes.length; i++){
            let box = MyLevels[currentLevel].boxes[i];
            let colDir = colCheck(self, box);
            if(colDir == 'bottom'){
                grounded = true;
            }
            if(colDir == 'left' || colDir == 'right'){
                if(self.state == 'jump' && currentLevel >= 2){
                    self.state = 'climb';
                }
                climbing = true;
            }
        }
        if(!grounded && self.state != 'climb'){
            self.state = 'jump';
        }
        if(!climbing && !grounded && self.state == 'climb'){
            self.state = 'jump';
        }
        for(let i = 0; i < MyLevels[currentLevel].enemies.length; i++){
            let enemy = MyLevels[currentLevel].enemies[i];
            let colDir = colCheck(self, enemy);
            if(colDir != null){
                dead();
            }
        }
        let colDir = colCheck(self, MyLevels[currentLevel].endPoint);
        if(colDir != null){
            win();
        }
    };

    self.updatePosition = function(){
        if(self.state == 'jump'){
            self.ySpeed += GRAVITY;
            if(self.ySpeed > TERMINAL_VELOCITY){
                self.ySpeed = TERMINAL_VELOCITY;
            }
        }
        else {
            self.ySpeed = 0;
        }
        if(self.state == 'climb'){
            if(self.pressingUp){
                self.y -= self.xSpeed;
            }
            if(self.pressingDown){
                self.y += self.xSpeed;
            }
        }
        else {
            if(self.pressingRight){
                self.x += self.xSpeed;
            }
            if(self.pressingLeft){
                self.x -= self.xSpeed;
            }
        }
        if(self.x < 0){
            self.x = 0;
        }
        else if(self.x > MyLevels[currentLevel].w){
            self.x = MyLevels[currentLevel].w - self.w;
        }
        self.y += self.ySpeed;
        if(self.y + self.h > MyLevels[currentLevel].h){
            console.log('Player y: ' + self.y);
            dead();
        }
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
        else if(data.inputId == 'attack'){
            console.log('Attack');
            if(currentLevel >= 1 && (!PLAYER_LIST[data.player].attacking)){
                let attack = PLAYER_LIST[data.player].attack();
                if(attack != null){
                    PLAYER_LIST[data.player].attacking = true;
                    attacks.push({
                        x: PLAYER_LIST[data.player].x, 
                        y: PLAYER_LIST[data.player].y,
                        w: 10,
                        h: 10, 
                        enemy: attack,
                        player: data.player
                    });
                }
                else {
                    PLAYER_LIST[data.player].attacking = false;
                }
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
                gameStarted = true;
            }
        }
        else if(data == 'single'){
            gameStarted = true;
        }
        else if(data == 'exit'){
            lobbyPlayers--;
        }
    });
});

function update(elapsedTime){
    if(gameStarted){
        let pack = {
            players: [],
            enemies: []
        };
        for(let i = 0; i < MyLevels[currentLevel].enemies.length; i++){
            let enemy = MyLevels[currentLevel].enemies[i];
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
            });
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
                j: (player.state === 'jump'),
                count: 0,
                subcount: 0,
                character: 65
            });
        }
        pack.attacks = [];
        for(let i = 0; i < attacks.length; i++){
            if(attacks[i].enemy < MyLevels[currentLevel].enemies.length){
                let xSpeed = (-attacks[i].x + MyLevels[currentLevel].enemies[attacks[i].enemy].x);
                let ySpeed = (-attacks[i].y + MyLevels[currentLevel].enemies[attacks[i].enemy].y);
                let xDir = 1;
                let yDir = 1;
                if(xSpeed < 0){
                    xDir = -1;
                    yDir = -1;                
                }
                let theta = Math.atan(ySpeed / xSpeed);
                xSpeed = 12 * Math.cos(theta);
                ySpeed = 12 * Math.sin(theta);
                attacks[i].x += xDir * xSpeed;
                attacks[i].y += yDir * ySpeed;
                let colDir;
                colDir = colCheck(attacks[i], MyLevels[currentLevel].enemies[attacks[i].enemy]);
                if(colDir != null){
                    console.log('Enemy Dead');
                // MyLevels[currentLevel].enemies[attacks[i].enemy].dead = true;
                    MyLevels[currentLevel].enemies.splice(attacks[i].enemy, 1);
                    deleteAttacks.push(i);
                }
                else{
                    for(let j = 0; j < MyLevels[currentLevel].boxes.length; j++){
                        colDir = colCheck(attacks[i], MyLevels[currentLevel].boxes[j]);
                        if(colDir != null){
                            deleteAttacks.push(i);
                            break;
                        }
                    }
                }

            }
            pack.attacks.push({x: attacks[i].x, y: attacks[i].y});
        }
        for(let i = 0; i < deleteAttacks.length; i++){
            PLAYER_LIST[attacks[deleteAttacks[i]].player].attacking = false;
            attacks.splice(deleteAttacks[i], 1);
        }
        deleteAttacks = [];
        let count = 0;
        let newLevel = false;
        for(var i in SOCKET_LIST){
            count++;
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
            if(finishedLevelCount >= pack.players.length){
                newLevel = true;
                if(count == 1){
                    currentLevel++;
                }
                console.log('Starting Level: ' + currentLevel);
                if(count == pack.players.length){
                    finishedLevelCount = 0;
                }
                let level = currentLevel;
                socket.emit('nextLevel', currentLevel);
            }
        }
        if(newLevel){
            newLevel = false;
            for(var i in PLAYER_LIST){
                PLAYER_LIST[i].finished = false;
            }
        }  
    }
}

setInterval(function(){
    let elapsedTime;
    update(elapsedTime);
},1000/25);

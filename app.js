let express = require('express');
let app = express();
let serv = require('http').Server(app);
let _dirname = './'
let fs = require('fs');

app.get('/', function(req, res){
    res.sendFile('/client/index.html', {root: _dirname});
});
app.use('/client', express.static(_dirname + '/client'));

serv.listen(17995);
console.log('Server started.');

let SOCKET_LIST = {};
let PLAYER_LIST = {};
let lobbyPlayers = 0;
let currentPlayerCount = 0;
let GRAVITY = 5;
let TERMINAL_VELOCITY = 40;
let ENEMY_SPEED = 5;
let currentLevel = 0;
let count = 0;
let finishedLevelCount = 0;
let gameStarted = false;
let attacks = [];
let deleteAttacks = [];
let startTime;
let elapsedTime;
let highScores = [];
for(let i = 0; i < 5; i++){
    highScores.push({string: ' ', time: ' ', deadCount: ' '});
}
fs.readFile(_dirname + 'highScores.txt', 'utf8', function(err, data){
    if(err){
        console.log('File not read: ' + err);
    }
    else{
        console.log('Reading high scores: ' + data);
        highScores = JSON.parse(data);
    }
});

let MyLevels = (function(){
    let that = [];
    for(let i = 0; i < 6; i++){
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
            dead: false,
            dir: false //Left is false, right is true
        }
    }

    that[5].initialize = function(){
        for(let i = 0; i < 5; i++){
            that[i].boxes = [];
            that[i].enemies = [];
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
        that[2].boxes.push(makeBox(150, 50, 91.11, 200));
        that[2].boxes.push(makeBox(291.11, 50, 91.11, 200));
        that[2].boxes.push(makeBox(432.22, 50, 91.11, 200));
        that[2].boxes.push(makeBox(573.33, 50, 91.11, 200));
        that[2].boxes.push(makeBox(714.44, 50, 91.11, 200));
        that[2].boxes.push(makeBox(855.55, 175, 91.11, 75));
        that[2].boxes.push(makeBox(855.55, 50, 91.11, 75));
        that[2].boxes.push(makeBox(996.66, 50, 91.11, 200));
        that[2].boxes.push(makeBox(1137.77, 175, 91.11, 125));
        that[2].boxes.push(makeBox(1137.77, 0, 50, 125));
        that[2].boxes.push(makeBox(1278.88, 50, 91.11, 250));
        that[2].boxes.push(makeBox(0, 50, 380, 50));
        that[2].boxes.push(makeBox(432, 50, 200, 50));

        that[2].boxes.push(makeBox(150, -50, 1830, 50));

        that[2].enemies.push(makeEnemy(220, 690, 10, 10, ENEMY_SPEED, 150, 700));
        that[2].enemies.push(makeEnemy(820, 390, 10, 10, ENEMY_SPEED, 820, 1310));
        that[2].enemies.push(makeEnemy(1420, 990, 10, 10, ENEMY_SPEED, 1420, 1630));
        that[2].enemies.push(makeEnemy(1580, 690, 10, 10, ENEMY_SPEED, 1580, 1630));
        that[2].enemies.push(makeEnemy(1580, 390, 10, 10, ENEMY_SPEED, 1580, 1870));
        that[2].enemies.push(makeEnemy(1500, 540, 10, 10, ENEMY_SPEED, 1510, 1560));
        that[2].enemies.push(makeEnemy(1500, 240, 10, 10, ENEMY_SPEED, 1410, 1560));
        that[2].enemies.push(makeEnemy(1700, 165, 10, 10, ENEMY_SPEED, 1700, 1740));

        that[2].enemies.push(makeEnemy(1278.88, 40, 10, 10, ENEMY_SPEED, 1278.88, 1359.98));
        that[2].enemies.push(makeEnemy(1137.77, 165, 10, 10, ENEMY_SPEED, 1137.77, 1218.88));
        that[2].enemies.push(makeEnemy(996.66, 40, 10, 10, ENEMY_SPEED, 996.66, 1077.77));
        that[2].enemies.push(makeEnemy(855.55, 40, 10, 10, ENEMY_SPEED, 855.55, 936.66));
        that[2].enemies.push(makeEnemy(714.44, 40, 10, 10, ENEMY_SPEED, 714.44, 795.55));
        that[2].enemies.push(makeEnemy(432.22, 40, 10, 10, ENEMY_SPEED, 432.22, 644.44));

        that[2].endPoint = makeBox(20, -20, 20, 25);
        that[2].w = 1980;
        that[2].h = 1050;

        //Level 3
        that[3].boxes.push(makeBox(0, 2950, 100, 50));
        that[3].boxes.push(makeBox(325, 2950, 50, 50));
        that[3].boxes.push(makeBox(475, 2800, 50, 50));
        that[3].boxes.push(makeBox(625, 2650, 50, 50));
        that[3].boxes.push(makeBox(775, 2500, 50, 50));
        that[3].boxes.push(makeBox(900, 2350, 50, 50));
        that[3].boxes.push(makeBox(950, 2000, 50, 200));
        that[3].boxes.push(makeBox(675, 2000, 50, 50));
        that[3].boxes.push(makeBox(400, 2000, 50, 50));
        that[3].boxes.push(makeBox(125, 2000, 50, 50));
        that[3].boxes.push(makeBox(0, 1625, 50, 250));
        that[3].boxes.push(makeBox(0, 1625, 150, 50));
        that[3].boxes.push(makeBox(250, 1475, 50, 250));
        that[3].boxes.push(makeBox(150, 1475, 150, 50));
        that[3].boxes.push(makeBox(0, 1200, 5, 200));
        that[3].boxes.push(makeBox(200, 1000, 5, 200));
        that[3].boxes.push(makeBox(0, 800, 5, 200));
        that[3].boxes.push(makeBox(200, 600, 5, 200));
        that[3].boxes.push(makeBox(400, 400, 5, 200));
        that[3].boxes.push(makeBox(600, 200, 5, 200));
        that[3].boxes.push(makeBox(500, 50, 50, 50));
        that[3].boxes.push(makeBox(725, 50, 50, 50));
        
        that[3].boxes.push(makeBox(475, 2500, 50, 50));
        that[3].boxes.push(makeBox(625, 2200, 50, 200));
        that[3].boxes.push(makeBox(475, 2050, 50, 50));

        that[3].boxes.push(makeBox(550, 1850, 50, 50));
        that[3].boxes.push(makeBox(700, 1700, 100, 50));
        that[3].boxes.push(makeBox(500, 1550, 100, 50));
        that[3].boxes.push(makeBox(700, 1400, 100, 50));
        that[3].boxes.push(makeBox(500, 1250, 100, 50));
        that[3].boxes.push(makeBox(700, 950, 50, 200));
        that[3].boxes.push(makeBox(900, 1000, 50, 50));
        that[3].boxes.push(makeBox(950, 550, 50, 300));
        that[3].boxes.push(makeBox(900, 250, 100, 310));
        that[3].boxes.push(makeBox(750, 710, 50, 50));
        that[3].boxes.push(makeBox(800, 250, 50, 50));

        that[3].endPoint = makeBox(960, 30, 20, 20);
        that[3].w = 1000;
        that[3].h = 3000;

        //Level 4
        that[4].boxes.push(makeBox(0, 1950, 500, 50));
        that[4].boxes.push(makeBox(450, 1500, 50, 500));
        that[4].boxes.push(makeBox(0, 1500, 500, 50));
        that[4].boxes.push(makeBox(700, 1950, 100, 50));
        that[4].boxes.push(makeBox(1100, 1950, 100, 50));
        that[4].boxes.push(makeBox(1400, 1750, 50, 200));
        that[4].boxes.push(makeBox(1400, 1950, 150, 50));
        that[4].boxes.push(makeBox(1700, 1550, 50, 200));
        that[4].boxes.push(makeBox(1950, 1350, 50, 200));
        that[4].boxes.push(makeBox(1650, 1050, 50, 200));
        that[4].boxes.push(makeBox(1650, 1050, 150, 50));
        that[4].boxes.push(makeBox(1275, 1100, 425, 50));
        that[4].boxes.push(makeBox(1225, 1050, 100, 50));
        that[4].boxes.push(makeBox(1225, 800, 50, 250));
        that[4].boxes.push(makeBox(1525, 700, 200, 50));
        that[4].boxes.push(makeBox(1825, 600, 200, 50));

        that[4].boxes.push(makeBox(0, 500, 1525, 50));
        that[4].boxes.push(makeBox(0, 0, 50, 510));
        that[4].boxes.push(makeBox(300, 450, 50, 60));
        that[4].boxes.push(makeBox(600, 450, 50, 60));
        that[4].boxes.push(makeBox(900, 450, 50, 60));
        that[4].boxes.push(makeBox(1200, 450, 50, 60));
        that[4].boxes.push(makeBox(40, 250, 60, 50));
        that[4].boxes.push(makeBox(40, 50, 60, 50));
        that[4].boxes.push(makeBox(375, 50, 225, 50));

        that[4].boxes.push(makeBox(825, 300, 150, 50));
        that[4].boxes.push(makeBox(1075, 300, 150, 50));

        that[4].boxes.push(makeBox(935, 0, 180, 50));
        that[4].boxes.push(makeBox(935, 100, 180, 50));
        that[4].boxes.push(makeBox(925, 0, 50, 150));
        that[4].boxes.push(makeBox(1075, 0, 50, 150));

        that[4].enemies.push(makeEnemy(1325, 1090, 10, 10, ENEMY_SPEED, 1325, 1350));
        that[4].enemies.push(makeEnemy(1350, 1090, 10, 10, ENEMY_SPEED, 1350, 1375));
        that[4].enemies.push(makeEnemy(1375, 1090, 10, 10, ENEMY_SPEED, 1375, 1400));
        that[4].enemies.push(makeEnemy(1400, 1090, 10, 10, ENEMY_SPEED, 1400, 1425));
        that[4].enemies.push(makeEnemy(1425, 1090, 10, 10, ENEMY_SPEED, 1425, 1450));
        that[4].enemies.push(makeEnemy(1450, 1090, 10, 10, ENEMY_SPEED, 1450, 1475));
        that[4].enemies.push(makeEnemy(1475, 1090, 10, 10, ENEMY_SPEED, 1475, 1500));
        that[4].enemies.push(makeEnemy(1500, 1090, 10, 10, ENEMY_SPEED, 1500, 1525));
        that[4].enemies.push(makeEnemy(1525, 1090, 10, 10, ENEMY_SPEED, 1525, 1550));
        that[4].enemies.push(makeEnemy(1550, 1090, 10, 10, ENEMY_SPEED, 1550, 1575));
        that[4].enemies.push(makeEnemy(1575, 1090, 10, 10, ENEMY_SPEED, 1575, 1600));
        that[4].enemies.push(makeEnemy(1600, 1090, 10, 10, ENEMY_SPEED, 1600, 1625));
        that[4].enemies.push(makeEnemy(1625, 1090, 10, 10, ENEMY_SPEED, 1625, 1650));

        that[4].enemies.push(makeEnemy(300, 440, 10, 10, ENEMY_SPEED, 300, 340));
        that[4].enemies.push(makeEnemy(600, 440, 10, 10, ENEMY_SPEED, 600, 640));
        that[4].enemies.push(makeEnemy(900, 440, 10, 10, ENEMY_SPEED, 900, 940));
        that[4].enemies.push(makeEnemy(1200, 440, 10, 10, ENEMY_SPEED, 1200, 1240));

        that[4].enemies.push(makeEnemy(825, 290, 10, 10, ENEMY_SPEED, 825, 865));
        that[4].enemies.push(makeEnemy(875, 290, 10, 10, ENEMY_SPEED, 875, 915));
        that[4].enemies.push(makeEnemy(925, 290, 10, 10, ENEMY_SPEED, 925, 965));
        that[4].enemies.push(makeEnemy(1075, 290, 10, 10, ENEMY_SPEED, 1075, 1115));
        that[4].enemies.push(makeEnemy(1125, 290, 10, 10, ENEMY_SPEED, 1125, 1165));
        that[4].enemies.push(makeEnemy(1175, 290, 10, 10, ENEMY_SPEED, 1175, 1215));

        that[4].endPoint = makeBox(1040, 65, 20, 20);
        that[4].w = 2000;
        that[4].h = 2000;
    };
    return that;
}());

// Source for colCheck function: http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
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
    let self = {};
    self.initialize = function(){
        self.x = 50;
        self.y = 420;
        self.w = 30;
        self.h = 30;
        self.id = id;
        self.number = Math.floor(10 * Math.random());
        self.pressingRight = false;
        self.pressingLeft = false;
        self.pressingUp = false;
        self.pressingDown = false;
        self.xSpeed = 10;
        self.ySpeed = 0;
        self.state = 'ground';
        self.deadCount = 0;
        self.finished = false;
        self.attacking = false;
        self.time = 0;
        self.doubleJump = false;
        self.dashing = false;
        self.dashCoolDown = 0;
    }
    function dead(){
        self.x = 50;
        self.y = 420;
        if(currentLevel == 2){
            self.y = 970;
        }
        else if(currentLevel == 3){
            self.y = 2920;
        }
        else if(currentLevel == 4){
            self.y = 1920;
        }
        self.ySpeed = 0;
        self.deadCount++;
        console.log('Deaths: ' + self.deadCount + ' Id: ' + self.id);
    }
    function win(){
        if(!self.finished){
            console.log('You win!');
            self.time += elapsedTime;
            console.log('Final Time: ' + self.time + ' Id: ' + self.id);
            self.finished = true;
            finishedLevelCount++;
            if(currentLevel == 4){
                for(let i = 0; i < highScores.length; i++){
                    if(highScores[i].string != ' '){
                        if(self.time < highScores[i].time){
                            let scoreString = 'Time in Seconds: ' + self.time + '   Death Count: ' + self.deadCount;
                            let temp = {
                                string: scoreString,
                                time: self.time,
                                deaths: self.deadCount
                            };
                            highScores.splice(i, 0, temp);
                            console.log('New High Score: ' + highScores[i].string);
                            break;
                        }
                    }
                    else {
                        let scoreString = 'Time in Seconds: ' + self.time + '   Death Count: ' + self.deadCount;
                        let temp = {
                            string: scoreString,
                            time: self.time,
                            deaths: self.deadCount
                        };
                        highScores.splice(i, 0, temp);
                        console.log('New High Score: ' + highScores[i].string);
                        break;
                    }
                }
                highScores.length = 5;
                for(let i in SOCKET_LIST){
                    SOCKET_LIST[i].emit('highScores', highScores);
                }
                fs.writeFile(__dirname + '/highScores.txt', JSON.stringify(highScores), function(err) {
                    if(err){
                        return console.log(err);
                    }
                    console.log('High scores successfully saved.');
                });
            }
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
                let temp = Math.sqrt(Math.pow(self.x - MyLevels[currentLevel].enemies[i].x, 2) + 
                                     Math.pow(self.y - MyLevels[currentLevel].enemies[i].y, 2));
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
            self.doubleJump = false;
        }
        if(self.state == 'climb'){
            if(self.pressingUp){
                self.y -= self.xSpeed;
                if(self.dashing){
                    self.y -= 100;
                }
            }
            if(self.pressingDown){
                self.y += self.xSpeed;
                if(self.dashing){
                    self.y += 100;
                }
            }
        }
        else {
            if(self.pressingRight){
                self.x += self.xSpeed;
                if(self.dashing){
                    self.x += 100;
                }
            }
            if(self.pressingLeft){
                self.x -= self.xSpeed;
                if(self.dashing){
                    self.x -= 100;
                }
            }
        }
        self.dashing = false;
        if(self.x < 0){
            self.x = 0;
        }
        else if(self.x > MyLevels[currentLevel].w){
            self.x = MyLevels[currentLevel].w - self.w;
        }
        self.y += self.ySpeed;
        if(self.y > MyLevels[currentLevel].h){
            console.log('Player y: ' + self.y);
            console.log('Player x: ' + self.x);
            dead();
        }
        updateCollision();
    };
    return self;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    if(!gameStarted){
        console.log('Joined game.');
        socket.id = Math.random();
        SOCKET_LIST[socket.id] = socket;

        let player = Player(socket.id);
        player.initialize();
        PLAYER_LIST[socket.id] = player;

        currentPlayerCount++;

        socket.emit('highScores', highScores);

        socket.on('disconnect', function(){
            delete SOCKET_LIST[socket.id];
            delete PLAYER_LIST[socket.id];
            currentPlayerCount--;
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
                if(player.state != 'jump'){
                    player.ySpeed = -30;
                    player.state = 'jump';
                }
                else if(!player.doubleJump && currentLevel >= 3){
                    player.doubleJump = true;
                    player.ySpeed = -30;
                }
            }
            else if(data.inputId == 'attack'){
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
            else if(data.inputId == 'dash'){
                if(currentLevel >= 4 && (!PLAYER_LIST[data.player].dashing)){
                    if(elapsedTime - PLAYER_LIST[data.player].dashCoolDown > 0.5){
                        PLAYER_LIST[data.player].dashing = true;
                        PLAYER_LIST[data.player].dashCoolDown = elapsedTime;
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
                        socket.emit('nextLevel', currentLevel);
                    }
                    MyLevels[5].initialize();
                    gameStarted = true;
                    startTime = process.hrtime();
                }
            }
            else if(data == 'single'){
                MyLevels[5].initialize();
                socket.emit('nextLevel', currentLevel);
                gameStarted = true;
                startTime = process.hrtime();
            }
            else if(data == 'exit'){
                lobbyPlayers--;
            }
        });
    }
    else{
        console.log('No servers available.');
        socket.emit('noServers', 'No available servers.');
    }
});

function update(elapsedTime){
    if(currentPlayerCount == 0){
        currentLevel = 0;
        gameStarted = false;
    }
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
                enemy.dir = false;
            }
            else if(enemy.x > enemy.endx){
                enemy.speed = -ENEMY_SPEED;
                enemy.x = enemy.endx;
                enemy.dir = true;
            }
            pack.enemies.push({
                x: enemy.x,
                y: enemy.y,
                dir: enemy.dir
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
                    MyLevels[currentLevel].enemies.splice(attacks[i].enemy, 1);
                    let inserted = false;
                    for(let k = 0; k < deleteAttacks.length; k++){
                        if(deleteAttacks[k] < i){
                            deleteAttacks.splice(k, 0, i);
                            inserted = true;
                            break;
                        }
                    }
                    if(!inserted){
                        deleteAttacks.push(i);
                    }
                }
                else{
                    for(let j = 0; j < MyLevels[currentLevel].boxes.length; j++){
                        colDir = colCheck(attacks[i], MyLevels[currentLevel].boxes[j]);
                        if(colDir != null){
                            let inserted = false;
                            for(let k = 0; k < deleteAttacks.length; k++){
                                if(deleteAttacks[k] < i){
                                    deleteAttacks.splice(k, 0, i);
                                    inserted = true;
                                    break;
                                }
                            }
                            if(!inserted){
                                deleteAttacks.push(i);
                            }
                            break;
                        }
                    }
                }
            }
            else {
                let inserted = false;
                for(let k = 0; k < deleteAttacks.length; k++){
                    if(deleteAttacks[k] < i){
                        deleteAttacks.splice(k, 0, i);
                        inserted = true;
                        break;
                    }
                }
                if(!inserted){
                    deleteAttacks.push(i);
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
                    if(PLAYER_LIST[i].finished){
                        pack.players[j].time = PLAYER_LIST[i].time;
                    }
                    else{
                        pack.players[j].time = elapsedTime + PLAYER_LIST[i].time;
                    }
                    pack.players[j].deadCount = PLAYER_LIST[i].deadCount;
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
                    if(currentLevel == 1){ 
                        for(let j in PLAYER_LIST){
                            PLAYER_LIST[j].x = 50;
                            PLAYER_LIST[j].y = 420;
                        }
                    }
                    else if(currentLevel == 2){
                        for(let j in PLAYER_LIST){
                            PLAYER_LIST[j].x = 50;
                            PLAYER_LIST[j].y = 970;
                        }
                    }
                    else if(currentLevel == 3){
                        for(let j in PLAYER_LIST){
                            PLAYER_LIST[j].x = 0;
                            PLAYER_LIST[j].y = 2920;
                        }
                    }
                    else if(currentLevel == 4){
                        for(let j in PLAYER_LIST){
                            PLAYER_LIST[j].x = 50;
                            PLAYER_LIST[j].y = 1920;
                        }
                    }
                }
                console.log('Starting Level: ' + currentLevel);
                if(count == pack.players.length){
                    finishedLevelCount = 0;
                }
                if(currentLevel <= 4){
                    socket.emit('nextLevel', currentLevel);
                    startTime = process.hrtime();
                }
                else {
                    if(count == currentPlayerCount){
                        currentLevel = 0;
                        gameStarted = false;
                        for(var j in PLAYER_LIST){
                            PLAYER_LIST[j].initialize();
                        }
                    }
                    socket.emit('nextLevel', 'credits');
                }
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
    elapsedTime = process.hrtime(startTime);
    elapsedTime = Math.floor(elapsedTime[0] + elapsedTime[1] / 1e9);
    update(elapsedTime);
},1000/25);

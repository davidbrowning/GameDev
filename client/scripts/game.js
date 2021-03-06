let socket = io();
let gameState;
let mainMenu;
let newGame;
let gameLobby;
let highScores;
let scoreList = {};
let controls;
let credits;
let noServers;
let customControls = {};
let substate;
let animation;
let players = [];
let screenSize = {};
let canDraw = false;
let offset = {};
let count = 0;
let backgroundcount = 0;
let subcount = 0;
let enemycount = 0;
let off1 = Math.random() * 50
let off2 = Math.random() * 50
let enemysubcount = 0;
let bckgrnd = new Image();
bckgrnd.src = 'client/assets/backgroundOriginal.png'
let img = new Image();
img.src = 'client/assets/chr.png'
let reverse_img = new Image();
reverse_img.src = 'client/assets/chrrev.png'
let platform_img = new Image();
platform_img.src = 'client/assets/sheet.png'
let currentLevel = 0;
let attacks = [];
let myTime;
let myDeathCount;
let timeDiv;
let deathDiv;
let finalScoresDiv;
let gameStarted;
let playerName;
// Courtesy of a music professor of mine, and
// freesound.org
// RICHERlandTV, and Lefty_Studios
//add an event listener to listen for the end. 
let attack = new Audio('client/assets/attack4.wav')
let jump = new Audio('client/assets/jump3.wav')
let particles = []
let DAMPING = .99;

drawable = function(){
    canDraw = true;
}
img.onload = drawable()
reverse_img.onload = drawable()
bckgrnd.onload = drawable()
platform_img.onload = drawable()

socket.on('noServers', function(){
    changeState('noServers');
});

socket.on('startNewGame', function(data){
    console.log('Starting Multiplayer Game...');
    if(gameState == 'gameLobby'){
        players = data;
        changeState('newGame');
    }
});

socket.on('nextLevel', function(data){
    currentLevel = data;
    offset.x = 0; 
    offset.y = 0;
    if(currentLevel == 2){
        offset.y = 600;
    }
    else if(currentLevel == 3){
        offset.y = 2550;
    }
    else if(currentLevel == 4){
        offset.y = 1550;
    }
    console.log('Starting Level: ' + currentLevel);
    //if(audio.ended()){
    //    audio.play()
    //}
});

socket.on('ready', function(data){
    let lobbyStatus = document.getElementById('lobbyStatus');
    let time = Math.ceil(3 - data);
    console.log('Time left: ' + time);
    lobbyStatus.innerHTML = 'Starting game in ' + time + '...';
});

socket.on('finalScores', function(scores){
    let list = document.getElementById('finalScoresList');
    for(let i = 0; i < scores.length; i++){
        let html = '<p>' + scores[i] + '</p>';
        list.innerHTML += html;
    }
    gameStarted = false;
    changeState('finalScores');
    currentLevel = 0;
    window.cancelAnimationFrame(animation);
});

function changeState(state){
    if(gameState == 'gameLobby'){
        let pack = 'exit';
        socket.emit('lobby', pack);
    }
    else if(gameState == 'controls'){
        localStorage['customControls'] = JSON.stringify(customControls);
    }
    if(state == 'noServers'){
        console.log('No Servers.');
        mainMenu.style.display = 'none';
        newGame.style.display = 'none';
        highScores.style.display = 'none';
        credits.style.display = 'none';
        gameLobby.style.display = 'none';
        noServers.style.display = 'block';
    }
    else if(state == 'mainMenu'){
        console.log('Main Menu');
        mainMenu.style.display = 'block';
        newGame.style.display = 'none';
        gameLobby.style.display = 'none';
        highScores.style.display = 'none';
        controls.style.display = 'none';
        credits.style.display = 'none';
    }
    else if(state == 'newGame'){
        socket.emit('lobby', 'single');
        newGame.style.display = 'block';
        gameLobby.style.display = 'none';
        gameStarted = true;
        playerName = window.prompt('Enter your user name:');
        let skt = socket.emit('username', playerName);
        console.log(skt)
        gameLoop();
    }
    else if(state == 'gameLobby'){
        let pack = 'enter';
        socket.emit('lobby', pack);
        mainMenu.style.display = 'none';
        gameLobby.style.display = 'block';
    }
    else if(state == 'highScores'){
        mainMenu.style.display = 'none';
        highScores.style.display = 'block';
        console.log('changing to hs state');
        console.log(highScores);
    }
    else if(state == 'controls'){
        subState = 'runLeft';
        mainMenu.style.display = 'none';
        controls.style.display = 'block';
    }
    else if(state == 'credits'){
        mainMenu.style.display = 'none';
        newGame.style.display = 'none';
        credits.style.display = 'block';
        finalScoresDiv.style.display = 'none';
    }
    else if(state == 'finalScores'){
        newGame.style.display = 'none';
        finalScoresDiv.style.display = 'block';
    }
    gameState = state;
}

function changeSubstate(state){
    substate = state;
}

function update(elapsedTime){
    for(let i = 0; i < players.length; i++){
        if(players[i].myPlayer){
            if(players[i].x + 250 < MyLevels[currentLevel].w &&
               players[i].x - 250 > 0){
                if(players[i].x - offset.x > screenSize.w - 250){
                    offset.x += 10;
                }
                else if(players[i].x - offset.x < 250){
                    offset.x -= 10;
                }
            }
            if(offset.x > players[i].x){
                offset.x -= 10;
            }
            if(offset.y > players[i].y){
                offset.y -= 10;
            }
            else if(offset.y + screenSize.h < players[i].y + 50){
                offset.y += 10;
            }
            if(players[i].y + 125 < MyLevels[currentLevel].h &&
               players[i].y - 125 > 0){
                if(players[i].y - offset.y > screenSize.h - 125){
                    offset.y += 10;
                }
                else if(players[i].y - offset.y < 125){
                    offset.y -= 10;
                }
            }
            myTime = players[i].time;
            myDeathCount = players[i].deadCount;
        }
    }
}

function render(elapsedTime){
    //Graphics.drawRectangle(0, 0, screenSize.w, screenSize.h, 'rgba(155, 155, 255, 1)');
    Graphics.drawRectangle(9, 9, screenSize.w-400, screenSize.h-400, 'rgba(25, 55, 25, 1)');
        if(currentLevel == 0){
        Graphics.drawTexture({
             image : bckgrnd,
             center : {x : 0, y: 0},
             clip : {x : 0+backgroundcount, y : 750, width : 500, height : 300},
             im : {width : 1000, height : 500},
             size : 100,
        });
            Graphics.drawRectangle(250-offset.x, 350-offset.y,100, 50, '#a35303');
            Graphics.drawRectangle(295-offset.x, 400-offset.y,10, 50, '#a35303');
            Graphics.drawText('Welcome! Level 1', 255-offset.x, 360-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Run + Jump!', 255-offset.x, 370-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Run: d', 255-offset.x, 380-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Jump: space', 255-offset.x, 390-offset.y,'Comic Sans MS', 'white');
            Graphics.drawRectangle(650-offset.x, 350-offset.y,160, 50, '#a35303');
            Graphics.drawRectangle(725-offset.x, 400-offset.y,10, 50, '#a35303');
            Graphics.drawText('Watch out for Snakes!', 655-offset.x, 360-offset.y,'Comic Sans MS', 'white');
        }
        else if(currentLevel == 1){
        Graphics.drawTexture({
             image : bckgrnd,
             center : {x : 0, y: 0},
             clip : {x : 0+backgroundcount, y : 600, width : 500, height : 300},
             im : {width : 1000, height : 500},
             size : 100,
        });
            Graphics.drawRectangle(250-offset.x, 350-offset.y,100, 50, '#a35303');
            Graphics.drawRectangle(295-offset.x, 400-offset.y,10, 50, '#a35303');
            Graphics.drawText('Welcome! Level 2', 255-offset.x, 360-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Attack!', 255-offset.x, 370-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Attack: j', 255-offset.x, 380-offset.y,'Comic Sans MS', 'white');
        }
        else if(currentLevel == 2){
        Graphics.drawTexture({
             image : bckgrnd,
             center : {x : 0, y: 0},
             clip : {x : 0+backgroundcount, y : 550, width : 500, height : 300},
             im : {width : 1000, height : 500},
             size : 100,
        });
            Graphics.drawRectangle(250-offset.x, 600-offset.y,100, 50, '#a35303');
            Graphics.drawRectangle(295-offset.x, 650-offset.y,10, 50, '#a35303');
            Graphics.drawText('Level 3', 255-offset.x, 610-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Climbing', 255-offset.x, 620-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('up: w', 255-offset.x, 630-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('down: s', 255-offset.x, 640-offset.y,'Comic Sans MS', 'white');
        }
        else if(currentLevel == 3){
        Graphics.drawTexture({
             image : bckgrnd,
             center : {x : 0, y: 0},
             clip : {x : 0+backgroundcount, y : 450, width : 500, height : 300},
             im : {width : 1000, height : 500},
             size : 100,
        });
            Graphics.drawRectangle(250-offset.x, 2450+350-offset.y,100, 50, '#a35303');
            Graphics.drawText('Welcome! Level 4', 255-offset.x, 2450+360-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Double Jump', 255-offset.x, 2450+370-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Jump again', 255-offset.x, 2450+380-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText(' in mid air.', 255-offset.x, 2450+390-offset.y,'Comic Sans MS', 'white');
        }
        else if(currentLevel == 4){
        Graphics.drawTexture({
             image : bckgrnd,
             center : {x : 0, y: 0},
             clip : {x : 0+backgroundcount, y : 150, width : 500, height : 300},
             im : {width : 1000, height : 500},
             size : 100,
        });
            Graphics.drawRectangle(250-offset.x, 1500+350-offset.y,100, 50, '#a35303');
            Graphics.drawRectangle(295-offset.x, 1500+400-offset.y,10, 50, '#a35303');
            Graphics.drawText('Welcome! Level 5', 255-offset.x, 1500+360-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Dash', 255-offset.x, 1500+370-offset.y,'Comic Sans MS', 'white');
            Graphics.drawText('Dash: l', 255-offset.x, 1500+380-offset.y,'Comic Sans MS', 'white');
        }
    let end = MyLevels[currentLevel].endPoint;
    Graphics.drawRectangle(end.x - offset.x, end.y - offset.y, end.w, end.h, 'rgba(255, 255, 0, 1)');
    for(let i = 0; i < MyLevels[currentLevel].boxes.length; i++){
        let box = MyLevels[currentLevel].boxes[i];
        let x = box.x - offset.x;
        let y = box.y - offset.y;
        //Graphics.drawRectangle(x, y, box.w, box.h, 'rgba(0, 0, 0, 1)');
        if(box.w < 100 && box.h < 100){
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x, y: y},
                 clip : {x : 112, y : 32, width : 15 , height : 10},
                 im : {width : box.w, height : 50},
                 size : 100,
            })
        }
        else if(box.h > 50 && box.w > box.h/2){
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x, y: y},
                 im : {width : box.w, height : box.h},
                 clip : {x : 160, y : 33, width : 48 , height : 30},
                 size : 100,
            })
            
        }
        else if(box.h > 50 && box.w < box.h/2){
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x, y: y},
                 im : {width : box.w, height : box.h},
                 clip : {x : 208, y : 32, width : 15 , height : 30},
                 size : 100,
            })
            
        }
        else{
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x, y: y},
                 clip : {x : 112, y : 32, width : 45 , height : 10},
                 im : {width : box.w, height : 50},
                 size : 100,
            })
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x+(box.w/2-off1), y: y-20},
                 clip : {x : 240, y : 100, width : 40 , height : 20},
                 im : {width : 100, height : 50},
                 size : 100,
            })
        }
    }
    for(let i = 0; i < MyLevels[currentLevel].enemies.length; i++){
        let enemy = MyLevels[currentLevel].enemies[i];
        let x = enemy.x - offset.x;
        let y = enemy.y - offset.y;
        Graphics.drawRectangle(x, y, 10, 10, 'rgba(255, 0, 0, 1)');
        if(!enemy.dir){
            Graphics.drawTexture({
                 image : img,
                 center : {x : x-30, y: y-45},
                 clip : {x : enemycount % 4 * 32, y : 97, width : 30, height : 35},
                 im : {width : 60, height : 65},
                 size : 100,
            });
        }
        else{
            Graphics.drawTexture({
                 image : reverse_img,
                 center : {x : x-30, y: y-45},
                 clip : {x : (enemycount % 4 * 32)+608, y : 97, width : 30, height : 35},
                 im : {width : 60, height : 65},
                 size : 100,
            });
        }
        if(enemycount > 3){
            enemycount = 0;
        }
        else if (enemysubcount > 20){
            enemycount++;
            enemysubcount = 0;
        }
        else{
            enemysubcount++;    
        }
        
    }
    for(let i = 0; i < players.length; i++){
        let x = players[i].x - offset.x;
        let y = players[i].y - offset.y;
        let spritex = x - 15;
        let spritey = y - 25;
        if(players[i].myPlayer){
            Graphics.drawRectangle(x-10, y-50,55, 23, '#33cccc');
            Graphics.drawText(playerName, x-3, y-35,'Comic Sans MS', 'black');
            //Graphics.drawRectangle(x, y, 30, 30, 'rgba(0, 0, 255, 1)');
        }
        else {
            Graphics.drawRectangle(x-10, y-50,55, 23, '#ff3300');
            Graphics.drawText('Player2', x-3, y-35,'Comic Sans MS', 'black');
            //Graphics.drawRectangle(x, y, 30, 30, 'rgba(0, 255, 0, 1)');
        }
        if(canDraw === true){ if(players[i].r === true && players[i].j === false){
                Graphics.drawTexture({
                     image : img,
                     center : {x : spritex, y: spritey},
                     clip : {x : 3 % count * 32, y : players[i].character, width : 30, height : 35},
                     im : {width : 60, height : 65},
                     size : 100,
                });
                if(count == 5){count = 1}
                else if(subcount % 4 == 0){count++;backgroundcount ++;}
                if(subcount == 16){subcount = 0}
                subcount++;
            }   
            else if(players[i].l === true && players[i].j === false){
                Graphics.drawTexture({
                     image : reverse_img,
                     center : {x : spritex, y: spritey},
                     clip : {x : 160 + (3%count * 32), y : players[i].character, width : 30, height : 35},
                     im : {width : 60, height : 65},
                     size : 100,
                     flip : true,
                });
                if(count == 5){count = 1}
                else if(subcount % 4 == 0){count++;backgroundcount--;}
                if(subcount == 16){subcount = 0}
                subcount++;
            }
            else if(players[i].l === true && players[i].j === true){
                Graphics.drawTexture({
                     image : reverse_img,
                     center : {x : spritex, y: spritey},
                     clip : {x : 32*14, y : players[i].character, width : 30, height : 35},
                     im : {width : 60, height : 65},
                     size : 100,
                     flip : true,
                });
                if(count == 5){count = 1}
                else if(subcount % 4 == 0){count++;}backgroundcount--;
                if(subcount == 16){subcount = 0}
                subcount++;
            }
            else if(players[i].j === true){
                Graphics.drawTexture({
                     image : img,
                     center : {x : spritex, y: spritey}, clip : {x : 4*32 , y : players[i].character, width : 30, height : 35},
                     im : {width : 60, height : 65},
                     size : 100,
                     flip : true,
                });
                if(count == 5){count = 1}
                else if(subcount % 2 == 0){count++;backgroundcount++;}
                if(subcount == 16){subcount = 0}
                subcount++;
            }
            else {
                Graphics.drawTexture({
                     image : img,
                     center : {x : spritex, y: spritey},
                     clip : {x : 0, y : players[i].character, width : 30, height : 35},
                     im : {width : 60, height : 65},
                     size : 100,
                });
                backgroundcount;
            }
            if(players[i].j){
                jump.play()
            }
            if(backgroundcount < 0){backgroundcount = 1000} else if( backgroundcount > 1200){backgroundcount = 50} // If we care about it, this is what happens if the user takes forever to complete the level. 
        }
    }
    for(let i = 0; i < attacks.length; i++){
        for(let j = 0; j < 50; ++j){
            particles[j] = new Graphics.Particle(Math.random() *25 + (attacks[i].x - offset.x) - 12.5, Math.random() * 25 + (attacks[i].y - offset.y) - 12.5);
            particles[j].attract(attacks[i].x - offset.x, attacks[i].y - offset.y);
            particles[j].integrate();
            particles[j].draw();
        }
        //Graphics.drawRectangle(attacks[i].x - offset.x, attacks[i].y - offset.y, 10, 10, 'rgba(255, 0, 0, 1)');
            attack.play();
    }
    timeDiv.innerHTML = 'Time in Seconds: ' + myTime;
    deathDiv.innerHTML = 'Death Count: ' + myDeathCount;
}

function gameLoop(){
    let elapsedTime = performance.now();
    update(elapsedTime);
    render(elapsedTime);
    animation = window.requestAnimationFrame(gameLoop);
}

function initScorelist(){
    if(scoreList.item == 'undefined'){
        scoreList.item = [];
    }
}

function initialize(){
    console.log('Initializing...');
    mainMenu = document.getElementById('mainMenu');
    newGame = document.getElementById('newGame');
    gameLobby = document.getElementById('gameLobby');
    highScores = document.getElementById('highScores');
    initScorelist();
    scoreList.item = [];
    scoreList.item.push(document.getElementById('firstScore'));
    scoreList.item.push(document.getElementById('secondScore')); 
    scoreList.item.push(document.getElementById('thirdScore')); 
    scoreList.item.push(document.getElementById('fourthScore')); 
    scoreList.item.push(document.getElementById('fifthScore'));  
    controls = document.getElementById('controls');
    credits = document.getElementById('credits');
    noServers = document.getElementById('noServers');
    socket.on('highScores', function(data){
        if(scoreList.item != null){
            for(let i = 0; i < 5; i++){
                scoreList.item[i].innerHTML = data[i].string;
            }
        }
        console.log(data)
    });
    socket.emit('ready', ' ');
    console.log('Ready');
    if(gameState != 'noServers'){
        gameState = 'mainMenu';
    }
    customControls.up = 'w';
    customControls.down = 's';
    customControls.left = 'a';
    customControls.right = 'd';
    customControls.jump = ' ';
    customControls.attack = 'j';
    customControls.dash = 'l';
    if(localStorage.hasOwnProperty('customControls')){
        customControls = JSON.parse(localStorage.getItem('customControls'));
    }
    socket.on('newPosition', function(data){
        players = data.players;
        MyLevels[currentLevel].enemies = data.enemies;
        attacks = data.attacks;
    });
    substate = 'newGameButton';
    screenSize.w = 1000;
    screenSize.h = 500;
    offset.x = 0;
    offset.y = 0;
    currentLevel = 0;
    timeDiv = document.getElementById('time');
    deathDiv = document.getElementById('deathCount');
    finalScoresDiv = document.getElementById('finalScores');
    let gameStarted = false;
    Graphics.initialize();
}

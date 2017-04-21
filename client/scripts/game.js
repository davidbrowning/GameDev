let socket = io();
let gameState;
let mainMenu;
let newGame;
let gameLobby;
let highScores;
let controls;
let credits;
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
bckgrnd.src = 'client/assets/background.png'
let img = new Image();
img.src = 'client/assets/chr.png'
let reverse_img = new Image();
reverse_img.src = 'client/assets/chrrev.png'
let platform_img = new Image();
platform_img.src = 'client/assets/sheet.png'
let currentLevel = 0;
let attacks = [];

drawable = function(){
    canDraw = true;
}
img.onload = drawable()
reverse_img.onload = drawable()
bckgrnd.onload = drawable()
platform_img.onload = drawable()


socket.on('startNewGame', function(data){
    console.log('Starting Multiplayer Game...');
    players = data;
    changeState('newGame');
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
    console.log('Starting Level: ' + currentLevel);
});

function changeState(state){
    if(gameState == 'gameLobby'){
        let pack = 'exit';
        socket.emit('lobby', pack);
    }
    else if(gameState == 'controls'){
        localStorage['customControls'] = JSON.stringify(customControls);
    }
    gameState = state;
    if(state == 'mainMenu'){
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
    }
    else if(state == 'controls'){
        subState = 'runLeft';
        mainMenu.style.display = 'none';
        controls.style.display = 'block';
    }
    else if(state == 'credits'){
        mainMenu.style.display = 'none';
        credits.style.display = 'block';
    }
}

function changeSubstate(state){
    substate = state;
}

function update(elapsedTime){ //Change this so it is according to what player you are
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
        }
    }
}

function render(elapsedTime){
    //Graphics.drawRectangle(0, 0, screenSize.w, screenSize.h, 'rgba(155, 155, 255, 1)');
    Graphics.drawRectangle(9, 9, screenSize.w-400, screenSize.h-400, 'rgba(25, 55, 25, 1)');
        Graphics.drawTexture({
             image : bckgrnd,
             center : {x : 0, y: 0},
             clip : {x : 0+backgroundcount, y : 0, width : 500, height : 300},
             im : {width : 1000, height : 500},
             size : 100,
        });
    let end = MyLevels[currentLevel].endPoint;
    Graphics.drawRectangle(end.x - offset.x, end.y - offset.y, end.w, end.h, 'rgba(255, 255, 0, 1)');
    for(let i = 0; i < MyLevels[currentLevel].boxes.length; i++){
        let box = MyLevels[currentLevel].boxes[i];
        let x = box.x - offset.x;
        let y = box.y - offset.y;
        Graphics.drawRectangle(x, y, box.w, box.h, 'rgba(0, 0, 0, 1)');
        if(box.w < 100){
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x, y: y},
                 clip : {x : 112, y : 32, width : 15 , height : 10},
                 im : {width : 50, height : 50},
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
        }
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x+(box.w/2-off1), y: y-20},
                 clip : {x : 240, y : 100, width : 40 , height : 20},
                 im : {width : 100, height : 50},
                 size : 100,
            })
            Graphics.drawTexture({
                 image: platform_img,
                 center: {x : x+(box.w/3-off2), y: y-20},
                 clip : {x : 240, y : 82, width : 40 , height : 20},
                 im : {width : 100, height : 50},
                 size : 100,
            })
    }
    for(let i = 0; i < MyLevels[currentLevel].enemies.length; i++){
        let enemy = MyLevels[currentLevel].enemies[i];
        let x = enemy.x - offset.x;
        let y = enemy.y - offset.y;
        Graphics.drawRectangle(x, y, 10, 10, 'rgba(255, 0, 0, 1)');
        Graphics.drawTexture({
             image : img,
             center : {x : x-30, y: y-45},
             clip : {x : enemycount % 4 * 32, y : 97, width : 30, height : 35},
             im : {width : 60, height : 65},
             size : 100,
        });
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
        // x, y is hitbox, spritex, spritey is for drawing.
        let spritex = x - 15;
        let spritey = y - 25;
        if(players[i].myPlayer){
            Graphics.drawRectangle(x, y, 30, 30, 'rgba(0, 0, 255, 1)');
        }
        else {
            Graphics.drawRectangle(x, y, 30, 30, 'rgba(0, 255, 0, 1)');
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
                else if(subcount % 4 == 0){count++;backgroundcount-=2;}
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
                else if(subcount % 4 == 0){count++;}backgroundcount-=2;
                if(subcount == 16){subcount = 0}
                subcount++;
            }
            else if(players[i].j === true){
                Graphics.drawTexture({
                     image : img,
                     center : {x : spritex, y: spritey},
                     clip : {x : 4*32 , y : players[i].character, width : 30, height : 35},
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
                backgroundcount--;
            }
            if(backgroundcount < 3){backgroundcount = 3000} // If we care about it, this is what happens if the user takes forever to complete the level. 
        }
    }
    for(let i = 0; i < attacks.length; i++){
        Graphics.drawRectangle(attacks[i].x - offset.x, attacks[i].y - offset.y, 10, 10, 'rgba(255, 0, 0, 1)');
    }
}

function gameLoop(){
    let elapsedTime = performance.now();
    update(elapsedTime);
    render(elapsedTime);
    animation = window.requestAnimationFrame(gameLoop);
    //window.cancelAnimationFrame(animation);
}

function initialize(){
    console.log('Initializing...')
    gameState = 'mainMenu';
    mainMenu = document.getElementById('mainMenu');
    newGame = document.getElementById('newGame');
    gameLobby = document.getElementById('gameLobby');
    highScores = document.getElementById('highScores');
    controls = document.getElementById('controls');
    credits = document.getElementById('credits');
    customControls.up = 'w';
    customControls.down = 's';
    customControls.left = 'a';
    customControls.right = 'd';
    customControls.jump = 'f';
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
    currentLevel = 4;
    Graphics.initialize();
}

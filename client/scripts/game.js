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
let offset = {};

socket.on('startNewGame', function(data){
    console.log('Starting Multiplayer Game...');
    players = data;
    changeState('newGame');
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
            if(players[i].x + screenSize.w / 2 < MyLevels[0].w &&
               players[i].x - 50 > 0){
                if(players[i].x - offset.x > screenSize.w / 2){
                    offset.x += 10;
                }
                else if(players[i].x - offset.x < 50){
                    offset.x -= 10;
                }
            }
            if(players[i].y + screenSize.h / 2 < MyLevels[0].h &&
               players[i].y - 50 > 0){
                if(players[i].y - offset.y > screenSize.h - 50){
                    offset.y += 10;
                }
                else if(players[i].y - offset.y < screenSize.h / 2){
                    offset.y -= 10;
                }
            }
        }
    }
}

function render(elapsedTime){
    Graphics.drawRectangle(0, 0, screenSize.w, screenSize.h, 'rgba(255, 255, 255, 1)');
    for(let i = 0; i < MyLevels[0].boxes.length; i++){
        let box = MyLevels[0].boxes[i];
        let x = box.x - offset.x;
        let y = box.y - offset.y;
        // console.log('Drawing Box: box.x: ' + box.x + ', box.y: ' + box.y + ', offset.x: ' 
        // + offset.x + ', offset.y: ' + offset.y);
        Graphics.drawRectangle(x, y, box.w, box.h, 'rgba(0, 0, 0, 1)');
    }
    for(let i = 0; i < MyLevels[0].enemies.length; i++){
        let enemy = MyLevels[0].enemies[i];
        let x = enemy.x - offset.x;
        let y = enemy.y - offset.y;
        // console.log('Drawing enemy: enemy.x: ' + enemy.x + ', enemy.y: ' + enemy.y + ', offset.x: ' 
        // + offset.x + ', offset.y: ' + offset.y);
        Graphics.drawRectangle(x, y, 10, 10, 'rgba(255, 0, 0, 1)');
    }
    for(let i = 0; i < players.length; i++){
        let x = players[i].x - offset.x;
        let y = players[i].y - offset.y;
        if(players[i].myPlayer){
            Graphics.drawRectangle(x, y, 10, 10, 'rgba(0, 0, 255, 1)');
        }
        else {
            Graphics.drawRectangle(x, y, 10, 10, 'rgba(0, 255, 0, 1)');
        } 
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
        MyLevels[0].enemies = data.enemies;
    });
    substate = 'newGameButton';
    screenSize.w = 1000;
    screenSize.h = 500;
    offset.x = 0;
    offset.y = 0;
    Graphics.initialize();
    MyLevels.initialize();
}
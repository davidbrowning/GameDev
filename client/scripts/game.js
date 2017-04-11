<<<<<<< HEAD:client/scripts/test.js
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
let img = new Image();
let offset = 0;
let count = 0;
let subcount = 0;
img.src = './client/assets/characters.png'

let canDraw = false;
drawable = function(){
    canDraw = true;
    console.log(canDraw)
}

img.onload = drawable();

socket.on('startNewGame', function(data){
    console.log('Starting Multiplayer Game...');
    changeState('newGame');
});

socket.on('oldPosition', function(data){
    Graphics.clearRect(0, 0, 1000, 500);
    for(let i = 0; i < data.length; i++){
        let col = data[i].number * 103056;
        let colstr = '#'+col;
        if(data[i].number === 0){colstr = '#000000'}
        Graphics.drawRectangle(data[i].x, data[i].y, 10, 10, colstr)

        Graphics.drawTexture({
            image : img,
            center : {x : data[i].x, y : data[i].y},
            clip: {x: 30,y:35,width:30,height:35},
            im:{width:30, height:35},
            size : 100
        });
    }
});

socket.on('newPosition', function(data){
    Graphics.clearRect(0, 0, 1000, 500);
    for(let i = 0; i < data.length; i++){
        let col = data[i].number * 103056;
        let colstr = '#'+col;
        if(data[i].number === 0){colstr = '#000000'}
        Graphics.drawRectangle(data[i].x, data[i].y, 10, 10, colstr)

        Graphics.drawTexture({
            image : img,
            center : {x : data[i].x, y : data[i].y},
            clip: {x: 3 % count * 32,y:35,width:32,height:35}, // 05 for yellow dude, 35 for king, 65 for army dude, 95 for snake
            im:{width:35, height:35},
            flip: false
        });
        
        if (count == 5){
            count = 1;
        }
        else if(subcount % 2 == 0){
            count++;
        }
        if(subcount == 8){subcount = 0}
        subcount++;
    }
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
    if(localStorage.hasOwnProperty('customControls')){
        customControls = JSON.parse(localStorage.getItem('customControls'));
    }
    substate = 'newGameButton';
    Graphics.initialize();
}
=======
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
            if(players[i].x - offset.x > screenSize.w / 2){
                offset.x += 10;
            }
            else if(players[i].x - offset.x < 50){
                offset.x -= 10;
            }
            if(players[i].y - offset.y > screenSize.h - 50){
                offset.y += 10;
            }
            else if(players[i].y - offset.y < screenSize.h / 2){
                offset.y -= 10;
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
    for(let i = 0; i < players.length; i++){
        let x = players[i].x - offset.x;
        let y = players[i].y - offset.y;
        if(players[i].myPlayer){
            Graphics.drawRectangle(x, y, 10, 10, 'rgba(0, 0, 255, 1)');
        }
        else {
            Graphics.drawRectangle(x, y, 10, 10, 'rgba(255, 0, 0, 1)');
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
        players = data;
    });
    substate = 'newGameButton';
    screenSize.w = 1000;
    screenSize.h = 500;
    offset.x = 0;
    offset.y = 0;
    Graphics.initialize();
    MyLevels.initialize();
}
>>>>>>> 30a87758a412ef901fcaa454189569cb4c5a254f:client/scripts/game.js

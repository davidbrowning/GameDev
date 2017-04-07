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

socket.on('startNewGame', function(data){
    console.log('Starting Multiplayer Game...');
    changeState('newGame');
});

socket.on('newPosition', function(data){
    Graphics.clearRect(0, 0, 500, 500);
    for(let i = 0; i < data.length; i++){
        Graphics.fillText(data[i].number, data[i].x, data[i].y);
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
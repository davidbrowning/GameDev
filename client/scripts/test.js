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

socket.on('newPosition', function(data){
    Graphics.clearRect(0, 0, 500, 500);
    for(let i = 0; i < data.length; i++){
        Graphics.fillText(data[i].number, data[i].x, data[i].y);
    }
});

function changeState(state){
    if(state == 'mainMenu'){
        gameState = 'mainMenu';
        mainMenu.style.display = 'block';
        newGame.style.display = 'none';
        gameLobby.style.display = 'none';
        highScores.style.display = 'none';
        controls.style.display = 'none';
        credits.style.display = 'none';
    }
    else if(state == 'newGame'){
        gameState = 'newGame';
        newGame.style.display = 'block';
        gameLobby.style.display = 'none';
    }
    else if(state == 'gameLobby'){
        gameState = 'gameLobby';
        mainMenu.style.display = 'none';
        gameLobby.style.display = 'block';
    }
    else if(state == 'highScores'){
        gameState = 'highScores';
        mainMenu.style.display = 'none';
        highScores.style.display = 'block';
    }
    else if(state == 'controls'){
        gameState = 'controls';
        subState = 'runLeft';
        mainMenu.style.display = 'none';
        controls.style.display = 'block';
    }
    else if(state == 'credits'){
        gameState = 'credits';
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
    substate = 'newGameButton';
    Graphics.initialize();
}
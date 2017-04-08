document.onkeydown = function(event){
    //console.log('You Pressed: ' + event.key);
    if(gameState == 'mainMenu'){
		
    }
    else if(gameState == 'newGame'){
        if(event.key == customControls.up){ 
            socket.emit('keyPress', {inputId: 'up', state: true});
        }
        else if(event.key == customControls.left){ 
            socket.emit('keyPress', {inputId: 'left', state: true});
        }
        else if(event.key == customControls.down){ 
            socket.emit('keyPress', {inputId: 'down', state: true});
        }
        else if(event.key == customControls.right){ 
            socket.emit('keyPress', {inputId: 'right', state: true});
        }
        else if(event.key == customControls.jump){
            socket.emit('keyPress', {inputId: 'jump'});
        }
    }
    else if(gameState == 'gameLobby'){

    }
    else if(gameState == 'highScores'){

    }
    else if(gameState == 'controls'){
        console.log('Key Press in Controls: ' + substate);
        if(substate == 'up'){
            console.log('Substate Up Before: ' + customControls.up);
            customControls.up = event.key;
            console.log('Substate Up After: ' + customControls.up);
        }
        else if(substate == 'down'){
            customControls.down = event.key;
        }
        else if(substate == 'left'){
            customControls.left = event.key;
        }
        else if(substate == 'right'){
            customControls.right = event.key;
        }
        else if(substate == 'jump'){
            customControls.jump = event.key;
        }
        else if(substate == 'attack'){
            customControls.attack = event.key;
        }
        else if(substate == 'dash'){
            customControls.dash = event.key;
        }
        alert("You've changed " + substate + " to " + event.key);
    }
    else if(gameState == 'credits'){

    }
}

document.onkeyup = function(event){
    if(gameState == 'mainMenu'){

    }
    else if(gameState == 'newGame'){
        if(event.key == customControls.up){ 
            socket.emit('keyPress', {inputId: 'up', state: false});
        }
        else if(event.key == customControls.left){ 
            socket.emit('keyPress', {inputId: 'left', state: false});
        }
        else if(event.key == customControls.down){ 
            socket.emit('keyPress', {inputId: 'down', state: false});
        }
        else if(event.key == customControls.right){ 
            socket.emit('keyPress', {inputId: 'right', state: false});
        }
    }
    else if(gameState == 'gameLobby'){

    }
    else if(gameState == 'highScores'){

    }
    else if(gameState == 'controls'){

    }
    else if(gameState == 'credits'){
        
    }
}

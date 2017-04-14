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
    //Level 0
    that[0].boxes.push(makeBox(-10, 450, 1000, 50));
    that[0].boxes.push(makeBox(1050, 450, 600, 50));
    that[0].boxes.push(makeBox(1550, 420, 500, 100));
    that[0].boxes.push(makeBox(2140, 450, 1000, 50));
    that[0].boxes.push(makeBox(3200, 450, 1000, 50));
    that[0].boxes.push(makeBox(4250, 450, 500, 50));
    that[0].enemies.push(makeBox(1050, 440, 10, 10));
    that[0].enemies.push(makeBox(1550, 410, 10, 10));
    that[0].enemies.push(makeBox(2140, 440, 10, 10));
    that[0].enemies.push(makeBox(2640, 440, 10, 10));
    that[0].enemies.push(makeBox(3200, 440, 10, 10));
    that[0].enemies.push(makeBox(3533, 440, 10, 10));
    that[0].enemies.push(makeBox(3867, 440, 10, 10));
    that[0].endPoint = makeBox(4680, 430, 20, 20);
    that[0].w = 4740;
    that[0].h = 500;

    //Level 1
    that[1].boxes.push(makeBox(-10, 450, 1000, 50));
    that[1].boxes.push(makeBox(1050, 450, 600, 50));
    that[1].boxes.push(makeBox(1550, 420, 500, 100));
    that[1].boxes.push(makeBox(2140, 450, 1000, 50));
    that[1].boxes.push(makeBox(3200, 450, 1000, 50));
    that[1].boxes.push(makeBox(4250, 450, 500, 50));
    // that[1].enemies.push(makeEnemy(1050, 440, 10, 10, ENEMY_SPEED, 1050, 1540));
    // that[1].enemies.push(makeEnemy(1550, 410, 10, 10, ENEMY_SPEED, 1550, 2040));
    // that[1].enemies.push(makeEnemy(2140, 440, 10, 10, ENEMY_SPEED, 2140, 2600));
    // that[1].enemies.push(makeEnemy(2640, 440, 10, 10, ENEMY_SPEED, 2640, 3130));
    // that[1].enemies.push(makeEnemy(3200, 440, 10, 10, ENEMY_SPEED, 3200, 3520));
    // that[1].enemies.push(makeEnemy(3533, 440, 10, 10, ENEMY_SPEED, 3533, 3850));
    // that[1].enemies.push(makeEnemy(3867, 440, 10, 10, ENEMY_SPEED, 3867, 4190));
    that[1].endPoint = makeBox(4680, 430, 20, 20);
    that[1].w = 4740;
    that[1].h = 500;
    return that;
}());
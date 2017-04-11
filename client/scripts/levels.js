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
    that[0].w = 4740;
    that[0].h = 500;
    return that;
}());
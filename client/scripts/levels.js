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
    that[1].endPoint = makeBox(5040, 430, 20, 20);
    that[1].w = 5100;
    that[1].h = 500;
    return that;
}());
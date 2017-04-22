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
    that[0].boxes.push(makeBox(-10, 450, 500, 50));
    that[0].boxes.push(makeBox(490, 450, 510, 50));
    that[0].boxes.push(makeBox(1050, 450, 500, 50));
    that[0].boxes.push(makeBox(1550, 420, 500, 40));
    that[0].boxes.push(makeBox(2140, 450, 500, 50));
    that[0].boxes.push(makeBox(2640, 450, 500, 50));
    that[0].boxes.push(makeBox(3200, 450, 500, 50));
    that[0].boxes.push(makeBox(3700, 450, 500, 50));
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
    that[1].boxes.push(makeBox(-10, 450, 500, 50));
    that[1].boxes.push(makeBox(495, 450, 510, 50));
    that[1].boxes.push(makeBox(1050, 450, 500, 50));
    that[1].boxes.push(makeBox(1550, 410, 500, 50));
    that[1].boxes.push(makeBox(2050, 370, 500, 50));
    that[1].boxes.push(makeBox(2550, 330, 500, 50));
    that[1].boxes.push(makeBox(3050, 370, 500, 50));
    that[1].boxes.push(makeBox(3550, 330, 500, 50));
    that[1].boxes.push(makeBox(4050, 330, 500, 50));
    that[1].boxes.push(makeBox(4600, 330, 50, 10));
    that[1].boxes.push(makeBox(4700, 370, 50, 10));
    that[1].boxes.push(makeBox(4800, 410, 50, 10));
    that[1].boxes.push(makeBox(4900, 450, 50, 10));
    that[1].boxes.push(makeBox(5000, 450, 100, 10));
    that[1].endPoint = makeBox(5040, 430, 20, 20);
    that[1].w = 5100;
    that[1].h = 500;

    //Level 2
   that[2].boxes.push(makeBox(-10, 1000, 330, 50));
   that[2].boxes.push(makeBox(330, 1000, 430, 50));
    that[2].boxes.push(makeBox(220, 700, 500, 300));
    that[2].boxes.push(makeBox(150, 700, 270, 50));
    that[2].boxes.push(makeBox(420, 700, 310, 50));
    that[2].boxes.push(makeBox(0, 450, 100, 400));
    that[2].boxes.push(makeBox(0, 0, 100, 450));

    that[2].boxes.push(makeBox(820, 400, 500, 650));
    that[2].boxes.push(makeBox(1420, 1000, 560, 50));
    that[2].boxes.push(makeBox(1420, 250, 101, 300));
    that[2].boxes.push(makeBox(1420, 550, 101, 300));
    that[2].boxes.push(makeBox(1640, 400, 340, 50));
    that[2].boxes.push(makeBox(1640, 400, 100, 220));
    that[2].boxes.push(makeBox(1640, 520, 100, 240));
    that[2].boxes.push(makeBox(1640, 760, 100, 240));
    that[2].boxes.push(makeBox(1880, 0, 100, 420));

    that[2].boxes.push(makeBox(1580, 700, 80, 50));
    that[2].boxes.push(makeBox(1580, 400, 80, 50));
    that[2].boxes.push(makeBox(1500, 550, 80, 50));
    that[2].boxes.push(makeBox(1500, 250, 80, 50));
    that[2].boxes.push(makeBox(1820, 0, 80, 50));
    that[2].boxes.push(makeBox(1700, 175, 50, 50));

<<<<<<< HEAD
    that[2].boxes.push(makeBox(80, 300, 450, 50));
    that[2].boxes.push(makeBox(530, 300, 450, 50));
    that[2].boxes.push(makeBox(980, 300, 450, 50));
    that[2].boxes.push(makeBox(150, 50, 91.11, 200));
    that[2].boxes.push(makeBox(291.11, 50, 91.11, 200));
    that[2].boxes.push(makeBox(432.22, 50, 91.11, 200));
    that[2].boxes.push(makeBox(573.33, 50, 91.11, 200));
    that[2].boxes.push(makeBox(714.44, 50, 91.11, 200));
    that[2].boxes.push(makeBox(855.55, 175, 91.11, 75));
    that[2].boxes.push(makeBox(855.55, 50, 91.11, 75));
    that[2].boxes.push(makeBox(996.66, 50, 91.11, 200));
    that[2].boxes.push(makeBox(1137.77, 175, 91.11, 125));
    that[2].boxes.push(makeBox(1137.77, 0, 50, 125));
    that[2].boxes.push(makeBox(1278.88, 50, 91.11, 250));
    that[2].boxes.push(makeBox(0, 50, 380, 50));
    that[2].boxes.push(makeBox(440, 50, 220, 50));
    

    that[2].boxes.push(makeBox(150, -50, 460, 50));
    that[2].boxes.push(makeBox(610, -50, 460, 50));
    that[2].boxes.push(makeBox(1070, -50, 460, 50));
    that[2].boxes.push(makeBox(1530, -50, 460, 50));

    that[2].endPoint = makeBox(20, -20, 20, 25);
=======
    that[2].boxes.push(makeBox(80, 300, 1340, 50));

    that[2].endPoint = makeBox(5040, 430, 20, 25);
>>>>>>> 42619fdb8834f6b5f34de74e5a74d6fde40c5141
    that[2].w = 1980;
    that[2].h = 1050;
    return that;
}());

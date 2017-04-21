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
   that[2].boxes.push(makeBox(-10, 1000, 730, 50));
    that[2].boxes.push(makeBox(220, 700, 500, 300));
    that[2].boxes.push(makeBox(150, 700, 200, 50));
    that[2].boxes.push(makeBox(0, 0, 100, 850));

    that[2].boxes.push(makeBox(820, 400, 500, 650));
    that[2].boxes.push(makeBox(1420, 1000, 560, 50));
    that[2].boxes.push(makeBox(1420, 250, 100, 600));
    that[2].boxes.push(makeBox(1640, 400, 340, 620));
    that[2].boxes.push(makeBox(1880, 0, 100, 420));

    that[2].boxes.push(makeBox(1580, 700, 80, 50));
    that[2].boxes.push(makeBox(1580, 400, 80, 50));
    that[2].boxes.push(makeBox(1500, 550, 80, 50));
    that[2].boxes.push(makeBox(1500, 250, 80, 50));
    that[2].boxes.push(makeBox(1820, 0, 80, 50));
    that[2].boxes.push(makeBox(1700, 175, 50, 50));

     that[2].boxes.push(makeBox(80, 300, 1340, 50));
    that[2].boxes.push(makeBox(150, 50, 91.11, 200));
    that[2].boxes.push(makeBox(291.11, 50, 91.11, 200));
    that[2].boxes.push(makeBox(432.22, 50, 91.11, 200));
    that[2].boxes.push(makeBox(573.33, 50, 91.11, 200));
    that[2].boxes.push(makeBox(714.44, 50, 91.11, 200));
    that[2].boxes.push(makeBox(855.55, 175, 91.11, 75));
    that[2].boxes.push(makeBox(855.55, 50, 91.11, 75));
    that[2].boxes.push(makeBox(996.66, 50, 91.11, 200));
    that[2].boxes.push(makeBox(1137.77, 175, 91.11, 125));
    that[2].boxes.push(makeBox(1137.77, 0, 91.11, 125));
    that[2].boxes.push(makeBox(1278.88, 50, 91.11, 250));
    that[2].boxes.push(makeBox(0, 50, 380, 50));
    that[2].boxes.push(makeBox(432, 50, 200, 50));
    

    that[2].boxes.push(makeBox(150, -50, 1830, 50));

    that[2].endPoint = makeBox(20, -20, 20, 25);
    that[2].w = 1980;
    that[2].h = 1050;

    //Level 3
    that[3].boxes.push(makeBox(0, 2950, 100, 50));
    that[3].boxes.push(makeBox(325, 2950, 50, 50));
    that[3].boxes.push(makeBox(475, 2800, 50, 50));
    that[3].boxes.push(makeBox(625, 2650, 50, 50));
    that[3].boxes.push(makeBox(775, 2500, 50, 50));
    that[3].boxes.push(makeBox(900, 2350, 50, 50));
    that[3].boxes.push(makeBox(950, 2000, 50, 200));
    that[3].boxes.push(makeBox(675, 2000, 50, 50));
    that[3].boxes.push(makeBox(400, 2000, 50, 50));
    that[3].boxes.push(makeBox(125, 2000, 50, 50));
    that[3].boxes.push(makeBox(0, 1625, 50, 250));
    that[3].boxes.push(makeBox(0, 1625, 150, 50));
    that[3].boxes.push(makeBox(250, 1475, 50, 250));
    that[3].boxes.push(makeBox(150, 1475, 150, 50));
    that[3].boxes.push(makeBox(0, 1200, 5, 200));
    that[3].boxes.push(makeBox(200, 1000, 5, 200));
    that[3].boxes.push(makeBox(0, 800, 5, 200));
    that[3].boxes.push(makeBox(200, 600, 5, 200));
    that[3].boxes.push(makeBox(400, 400, 5, 200));
    that[3].boxes.push(makeBox(600, 200, 5, 200));
    that[3].boxes.push(makeBox(500, 50, 50, 50));
    that[3].boxes.push(makeBox(725, 50, 50, 50));
    
    that[3].boxes.push(makeBox(475, 2500, 50, 50));
    that[3].boxes.push(makeBox(625, 2200, 50, 200));
    that[3].boxes.push(makeBox(475, 2050, 50, 50));

    that[3].boxes.push(makeBox(550, 1850, 50, 50));
    that[3].boxes.push(makeBox(700, 1700, 100, 50));
    that[3].boxes.push(makeBox(500, 1550, 100, 50));
    that[3].boxes.push(makeBox(700, 1400, 100, 50));
    that[3].boxes.push(makeBox(500, 1250, 100, 50));
    that[3].boxes.push(makeBox(700, 950, 50, 200));
    that[3].boxes.push(makeBox(900, 1000, 50, 50));
    that[3].boxes.push(makeBox(950, 550, 50, 300));
    that[3].boxes.push(makeBox(900, 250, 100, 310));
    that[3].boxes.push(makeBox(750, 710, 50, 50));
    that[3].boxes.push(makeBox(800, 250, 50, 50));
    
    that[3].endPoint = makeBox(960, 30, 20, 20);
    that[3].w = 1000;
    that[3].h = 3000;

    //Level 4
    that[4].boxes.push(makeBox(0, 450, 500, 50));
    that[4].boxes.push(makeBox(450, 0, 50, 500));

    that[4].endPoint = makeBox(520, 430, 20, 20);
    that[4].w = 1000;
    that[4].h = 500;
    return that;
}());

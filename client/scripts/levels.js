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
    that[4].boxes.push(makeBox(0, 1950, 500, 50));
    that[4].boxes.push(makeBox(450, 1500, 50, 500));
    that[4].boxes.push(makeBox(0, 1500, 500, 50));
    that[4].boxes.push(makeBox(700, 1950, 100, 50));
    that[4].boxes.push(makeBox(1100, 1950, 100, 50));
    that[4].boxes.push(makeBox(1400, 1750, 50, 200));
    that[4].boxes.push(makeBox(1400, 1950, 150, 50));
    that[4].boxes.push(makeBox(1700, 1550, 50, 200));
    that[4].boxes.push(makeBox(1950, 1350, 50, 200));
    that[4].boxes.push(makeBox(1650, 1050, 50, 200));
    that[4].boxes.push(makeBox(1650, 1050, 150, 50));
    that[4].boxes.push(makeBox(1275, 1100, 425, 50));
    that[4].boxes.push(makeBox(1225, 1050, 100, 50));
    that[4].boxes.push(makeBox(1225, 800, 50, 250));
    that[4].boxes.push(makeBox(1525, 700, 200, 50));
    that[4].boxes.push(makeBox(1825, 600, 200, 50));

    that[4].boxes.push(makeBox(0, 500, 1525, 50));
    that[4].boxes.push(makeBox(0, 0, 50, 510));
    that[4].boxes.push(makeBox(300, 450, 50, 60));
    that[4].boxes.push(makeBox(600, 450, 50, 60));
    that[4].boxes.push(makeBox(900, 450, 50, 60));
    that[4].boxes.push(makeBox(1200, 450, 50, 60));
    that[4].boxes.push(makeBox(40, 250, 60, 50));
    that[4].boxes.push(makeBox(40, 50, 60, 50));
    that[4].boxes.push(makeBox(375, 50, 225, 50));

    that[4].boxes.push(makeBox(825, 300, 150, 50));
    that[4].boxes.push(makeBox(1075, 300, 150, 50));

    that[4].boxes.push(makeBox(935, 0, 180, 50));
    that[4].boxes.push(makeBox(935, 100, 180, 50));
    that[4].boxes.push(makeBox(925, 0, 50, 150));
    that[4].boxes.push(makeBox(1075, 0, 50, 150));

    that[4].endPoint = makeBox(1040, 65, 20, 20);
    that[4].w = 2000;
    that[4].h = 2000;
    return that;
}());

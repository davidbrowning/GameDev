let MyLevels = (function(){
    let that = [];
    for(let i = 0; i < 5; i++){
        that.push({boxes: []});
    }
    function makeBox(x, y, w, h){
        return {x: x, y: y, w: w, h: h};
    }
    that.initialize = function(){
        that[0].boxes.push(makeBox(0, 450, 1000, 50));
        that[0].boxes.push(makeBox(1050, 450, 500, 50));
        that[0].boxes.push(makeBox(1550, 400, 500, 100));
        that[0].boxes.push(makeBox(2150, 450, 1000, 50));
        that[0].boxes.push(makeBox(3200, 450, 1000, 50));
        that[0].boxes.push(makeBox(4250, 450, 500, 50));
        that[0].w = 4750;
        that[0].h = 500;
    };
    return that;
}());
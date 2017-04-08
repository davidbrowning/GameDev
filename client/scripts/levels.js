let MyLevels = (function(){
    let that = {};
    that.first = {};
    that.first.boxes = [];
    function makeBox(x, y, w, h){
        return {x: x, y: y, w: w, h: h};
    }
    that.initialize = function(){
        that.first.boxes.push(makeBox(0, 450, 1000, 50));
        that.first.boxes.push(makeBox(1050, 450, 500, 50));
        that.first.boxes.push(makeBox(1550, 400, 500, 100));
        that.first.boxes.push(makeBox(2150, 450, 1000, 50));
        that.first.boxes.push(makeBox(3200, 450, 1000, 50));
        that.first.boxes.push(makeBox(4250, 450, 500, 50));
        that.first.w = 4750;
        that.first.h = 500;
    };
    return that;
}());
let Graphics = (function(){
        let that = {};
        let canvas;
        let context;
        that.initialize = function(){
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
        };

        that.clearRect = function(x, y, w, h){
            context.clearRect(x, y, w, h);
        };

        that.fillText = function(text, x, y){
            context.font = '30px Arial';
            context.fillText(text, x, y);
        };

        that.drawTexture = function(spec) {
            context.save();
            
            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);
            //context.drawImage(
            //    spec.image, 
            //    spec.center.x, 
            //    spec.center.y,
            //    spec.size, spec.size);
            context.drawImage(
                spec.image, 
                spec.clip.x ,//- spec.size/2, 
                spec.clip.y ,//- spec.size/2,
                spec.clip.width, spec.clip.height, spec.center.x, spec.center.y,
                spec.im.width, spec.im.height);
            
            context.restore();
        }

        that.renderImage = function(image, x, y, width, height){
            context.drawImage(image, x, y, width, height);
        };

        that.drawRectangle = function(x, y, width, height, color){
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.strokeRect(x, y, width, height);
        };

        that.Particle = function(x, y){
            this.x = this.oldX = x;
            this.y = this.oldY = y;
        }
        
        that.Particle.prototype.integrate = function() {
            var velocityX = (this.x - this.oldX) * DAMPING;
            var velocityY = (this.y - this.oldY) * DAMPING;
            this.oldX = this.x;
            this.oldY = this.y;
            this.x += velocityX/4;
            this.y += velocityY/4;
        };

        that.Particle.prototype.attract = function(x, y) {
            var dx = x - this.x;
            var dy = y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            this.x += dx/distance;
            this.y += dy/distance;
        };

        that.Particle.prototype.draw = function() {
            context.strokeStyle = '#e60000';
            context.lineWidth = 8;
            context.beginPath();
            context.moveTo(this.oldX, this.oldY);
            context.lineTo(this.x, this.y);
            context.stroke();
        }; 

        that.drawText = function (text, x, y, font, fillStyle) {
            context.font = font;
            context.fillStyle = fillStyle;
            context.baseline = 'top';
            context.fillText(text, x, y);
        };

        that.drawPauseMenu = function(option){
            that.drawRectangle(0, 0, 1000, 500, 'rgba(220, 220, 220, 0.5)');
            that.drawRectangle(350, 99, 300, 157, 'rgba(0, 0, 0, 1)');
            that.drawRectangle(360, 109, 280, 137, 'rgba(220, 220, 220, 1)');
            
            if(option == 'resume'){
                that.drawRectangle(400, 121.33, 200, 50, 'rgba(0, 0, 255, 1)');
                that.drawText('Resume', 440, 157, '32px Arial, sans-serif', 'rgba(255, 255, 255, 1)');
                that.drawText('Quit', 470, 220, '32px Arial, sans-serif', 'rgba(0, 0, 0, 1)');
            }
            else if(option == 'quit'){
                that.drawRectangle(400, 183.67, 200, 50, 'rgba(0, 0, 255, 1)');
                that.drawText('Resume', 440, 157, '32px Arial, sans-serif', 'rgba(0, 0, 0, 1)');
                that.drawText('Quit', 470, 220, '32px Arial, sans-serif', 'rgba(255, 255, 255, 1)');
            }
            
        };

        return that;
}());

$.fn.jq_dots = function(user_option){
    'use strict';
/*
the_size: 'the_size' is an object which has two keys: x and y. It sets the size of the canvas you created;
the_speed: 'the_speed' sets the movement speed of dots, the range of 'speed' is (0, 1);
the_num: 'the_num' is the number of dots;
the_radius: 'the_radius' sets the radius of these dots;
the_dispersion: The value is (0, 0.1) which measures the dispersion of the dots clouds. With the value increasing the clouds becomes more dispersed.
the_filledColor: Set the color inside the dots.
the_borderColor: Set the border color of the dots.
the_shape: Choose the shape of the clouds which flows your mouse. The options are 'dot', 'rec', 'star4', 'star5' and 'star8'. The default is 'dot'.
the_mouseEvent: Select the mouse event. You can use 'mousemove' or 'click' to make the cloud move forward to your mouse pointer.
*/    
    var defaults = {
        'the_size':{'x':1000,'y':1000},
        'the_speed':0.9,
        'the_num':50,
        'the_radius':35,
        'the_dispersion':0.09,
        'the_filledColor':'white',
        'the_mouseEvent':'mousemove'
    };

    var option = $.extend({}, defaults, user_option);

// var c = document.getElementById('c');
    var c = this.get(0);
    var ctx = c.getContext('2d');
    var WIDTH = c.width = option.the_size.x;
    var HEIGHT = c.height = option.the_size.y;
    var mouse = {
        x: WIDTH / 2,
        y: HEIGHT / 2
    };


    var chooseTheShape = function(shape, r){
        switch(shape){
            case 'star4':
            return pathOfDrawStar(0, 0, 4, r, 0.35*r);
            breack;

            case 'star5':
            return pathOfDrawStar(0, 0, 5, r, 0.35*r);
            breack;

            case 'star8':
            return pathOfDrawStar(0, 0, 8, r, 0.35*r);
            breack;

            case 'rec':
            return ctx.rect((-0.5)*r, (-0.5)*r, r, r);
            breack;

            default:
            return ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        }
    }


    var pathOfDrawStar = function(cx, cy, spikes, outerRadius, innerRadius){
        var rot = 0;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius)
        for (i = 0; i < spikes; i++) {
            x = cx + Math.sin(rot) * outerRadius;
            y = cy - Math.cos(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.sin(rot) * innerRadius;
            y = cy - Math.cos(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }

        ctx.closePath();
    }


    var Blob = function(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.easex = (0.1-option.the_dispersion) + Math.random() * option.the_dispersion;//range 0.1-0
        this.easey = (0.1-option.the_dispersion) + Math.random() * option.the_dispersion;
        this.r = r;//radius
        this.color = color;
    };

    Blob.prototype = {
        constructor: Blob,
        update: function(target) {
            this.vx += (target.x - this.x)*this.easex;// vx + distance*0.1(random)
            this.vy += (target.y - this.y)*this.easey;
            this.vx *= option.the_speed;
            this.vy *= option.the_speed;
            this.x += this.vx;
            this.y += this.vy;
            this.color += 1;

        },
        renderStroke: function(ctx) {
            ctx.save();
            ctx.fillStyle = option.the_borderColor || 'hsla(' + this.color + ', 100%, 50%, 1)';
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            chooseTheShape(option.the_shape, this.r);
            ctx.fill();
            ctx.restore();
        },

        renderFill: function(ctx) {
            ctx.save();
            ctx.fillStyle = option.the_filledColor;
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            chooseTheShape(option.the_shape, 0.8*this.r);
            ctx.fill();
            ctx.restore();
        }
    };

    var blobCount = option.the_num;
    var blobList = [];
    var blob = null;
    var color = Math.random() * 360;

    for (var i = 0; i < blobCount; i++) {
        blob = new Blob(
            WIDTH * Math.random(),
            HEIGHT * Math.random(),
            0.2*option.the_radius+ 0.8*Math.random() * option.the_radius,
            color
        );
        blobList.push(blob);
    }

    c.addEventListener(option.the_mouseEvent, function(e) {
        var rect = c.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    requestAnimationFrame(function loop() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        requestAnimationFrame(loop);

        for (var i = 0; i < blobCount; i++) {
            blob = blobList[i];
            blob.update(mouse);
            blob.renderStroke(ctx);
        }

        for (var j = 0; j < blobCount; j++) {
            blob = blobList[j];
            blob.renderFill(ctx);
        }


    });

}

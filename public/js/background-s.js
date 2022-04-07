backgroundSketch = (s) => {
    let canvasWidth, canvasHeight;

    s.setup = function() {
        s.createCanvas(document.querySelector('#background-sketch').clientWidth, document.querySelector('#background-sketch').clientHeight);
        canvasWidth = s.width;
        canvasHeight = s.height;
    }

    s.draw = function() {
        switch (tone) {
            case 0:
                s.background(255, 255, 0);
                break;
            case 1:
                s.background(100, 100, 0);
                break;
            case 2:
                s.background(255, 100, 50);
                break;
            default:
                s.background(0);
                break;
        }
    }

    s.windowResized = function() {
        s.resizeCanvas(document.querySelector('#background-sketch').clientWidth, document.querySelector('#background-sketch').clientHeight);
        canvasWidth = s.width;
        canvasHeight = s.height;
    }
}

var backgroundP5 = new p5(backgroundSketch, 'background-sketch');
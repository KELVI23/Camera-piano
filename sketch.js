// ********************************
// BACKGROUND SUBTRACTION*
// ********************************
let noteIcon;

function preload() {
  noteIcon = loadImage('assets/note-icon.png'); 
}

var video;
var prevImg;
var diffImg;
var currImg;
let monoSynth;

function setup() {
  createCanvas(640 * 2, 500);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.hide();

  // Set up audio
  getAudioContext().suspend();
  monoSynth = new p5.MonoSynth();

  grid = new Grid(640, 480, monoSynth);
}

function draw() {
  background(0);
  image(video, 0, 0);

  currImg = createImage(video.width, video.height);
  currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

  // Scale down
  currImg.resize(video.width / 4, video.height / 4);
  // Blur
  currImg.filter(BLUR, 3);
  diffImg = createImage(video.width, video.height);
  diffImg.loadPixels();
  // Scale down
  diffImg.resize(video.width / 4, video.height / 4);
  
  const threshold = 50;

  if (typeof prevImg !== 'undefined') {
    prevImg.loadPixels();
    currImg.loadPixels();
    for (var x = 0; x < currImg.width; x += 1) {
      for (var y = 0; y < currImg.height; y += 1) {
        var index = (x + (y * currImg.width)) * 4;
        var redSource = currImg.pixels[index + 0];
        var greenSource = currImg.pixels[index + 1];
        var blueSource = currImg.pixels[index + 2];

        var redBack = prevImg.pixels[index + 0];
        var greenBack = prevImg.pixels[index + 1];
        var blueBack = prevImg.pixels[index + 2];

        var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

        if (d > threshold) {
          diffImg.pixels[index + 0] = 0;
          diffImg.pixels[index + 1] = 0;
          diffImg.pixels[index + 2] = 0;
          diffImg.pixels[index + 3] = 0;
        } else {
          diffImg.pixels[index + 0] = 255;
          diffImg.pixels[index + 1] = 255;
          diffImg.pixels[index + 2] = 255;
          diffImg.pixels[index + 3] = 255;
        }
      }
    }
  }
  diffImg.updatePixels();
  image(diffImg, 640, 0);

  noFill();
  stroke(255);

  textSize(16)
 
  text("Click for sound", 30, 495);

  prevImg = createImage(currImg.width, currImg.height);
  prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

  grid.run(diffImg);
}

function mousePressed() {
  userStartAudio();
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2) {
  var d = (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) + (z2 - z1)*(z2 - z1);
  return d;
}






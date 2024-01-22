class Grid {
  /////////////////////////////////
  constructor(_w, _h, monoSynth) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    this.keys = ['A', 'G', 'F', 'D', 'C']; //musical keys
    this.monoSynth = monoSynth;

    // Initialize grid structure and state
    for (var x = 0; x < _w; x += this.noteSize) {
      var posColumn = [];
      var stateColumn = [];
      for (var y = 0; y < _h; y += this.noteSize) {
        posColumn.push(createVector(x + this.noteSize / 2, y + this.noteSize / 2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img) {
    // draw active notes
    noFill();
    stroke(255);

 
    // variables to track the currently playing note
    let playingNote = false;
    let currentNote = "";

    for (var i = 0; i < this.notePos.length; i++) {
      for (var j = 0; j < this.notePos[i].length; j++) {
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j] > 0) {
          var s = this.noteState[i][j];

          // Map the noteState to an angle for arc
          var angle = map(s, 0, 1, PI, -PI);    

          // Calculate the note color
          var r = map(i, 0, this.notePos.length, 255, 0);
          var g = map(i, 0, this.notePos.length / 2, 0, 255);
          var b = map(i, 0, this.notePos.length, 0, 255);

          // Calculate the note size
          var size = this.noteSize * s;

          // Draw an arc
          stroke(r, g, b, 200);
          strokeWeight(3);
          arc(x, y, size, size, -HALF_PI, angle - HALF_PI);

          var octave = 8 - floor((i + 1) / this.keys.length);
          var note = this.keys[(i + 1) % this.keys.length] + octave;
          // note velocity (volume, from 0 to 1)
          let velocity = random();
          // time from now (in seconds)
          let time = random(0, 0.05);
          // note duration (in seconds)
          let dur = this.noteState[i][j] / 10;
          this.monoSynth.play(note, velocity, time, dur);

          // display currentNote 
          playingNote = true;
          currentNote = note;
        }
        this.noteState[i][j] -= 0.05;
        this.noteState[i][j] = constrain(this.noteState[i][j], 0, 1);
      }
    }

    // Display current  note
    if (playingNote) {
      // Display the note icon
      image(noteIcon, 20, 30, 30, 30); 

      textSize(14);
      fill(255);
      noStroke();
      textAlign(CORNER);
      text("Note: " + currentNote, 60, 45);
    }
  }

  /////////////////////////////////
  findActiveNotes(img) {
    for (var x = 0; x < img.width; x += 1) {
      for (var y = 0; y < img.height; y += 1) {
        var index = (x + y * img.width) * 4;
        var state = img.pixels[index + 0];
        if (state == 0) {
          // If pixel is black (i.e., there is movement), find which note to activate
          var screenX = map(x, 0, img.width, 0, this.gridWidth);
          var screenY = map(y, 0, img.height, 0, this.gridHeight);
          var i = int(screenX / this.noteSize);
          var j = int(screenY / this.noteSize);
          this.noteState[i][j] = 1;
        }
      }
    }
  }
}

function playSynth(note, velocity, time, dur) {
  const synth = new p5.Oscillator();
  synth.setType('cos'); 
  synth.freq(midiToFreq(note));
  synth.amp(velocity);
  synth.start();
  synth.stop(time + dur);
}







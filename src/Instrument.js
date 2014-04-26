function Instrument(config) {
  this.webAudioContext = config.webAudioContext;
  this.outputNode = config.outputNode; 
  this.scale = config.scale;
  this.key = config.key;
  this.tempo = config.tempo;
  this.beatsPerMeasure = config.beatsPerMeasure;
  this.scaleDegreeProbability = config.scaleDegreeProbability;
  this.rhythmProbability = config.rhythmProbability;

  this.oscillatorType = config.oscType;
  this.playType = 'playNote';
}

// whole, half, quarter, eight, sixteenth
Instrument.prototype.RHYTHM_TYPES = [4, 2, 1, 0.5, 0.25];

Instrument.prototype.playNote = function(root, note, startingTime, noteLength) {
  var frequency = this.scale.degreeToFreq(this.scale.at(note), (root).midicps(), 1);
  var oscillator = this.webAudioContext.createOscillator();
  oscillator.connect(this.outputNode);
  oscillator.frequency.value = frequency;
  oscillator.type = oscillator[this.oscillatorType];
  oscillator.start(startingTime);
  oscillator.stop(startingTime + noteLength);
};

Instrument.prototype.playChord = function(root, note, startingTime, noteLength, useArpeggio) {
  if(useArpeggio) {
    this.playNote(root, note, startingTime + noteLength, noteLength);
    this.playNote(root, note + 2, startingTime + noteLength / 4, noteLength - noteLength / 4);
    this.playNote(root, note + 4, startingTime + noteLength / 2, noteLength - noteLength / 2);
  }
  else {
    this.playNote(root, note, startingTime, noteLength);
    this.playNote(root, note + 2, startingTime, noteLength);
    this.playNote(root, note + 4, startingTime, noteLength);
  }
};

Instrument.prototype.scheduleMeasure = function(time) {
  var beatsLeft = this.beatsPerMeasure;
  while(beatsLeft) {
    // choose weighted note type
    var noteType = this.RHYTHM_TYPES.wchoose(this.rhythmProbability);
    if(noteType <= beatsLeft) {
      // choose scale degree by weighted random
      var note = this.scale.degrees().wchoose(this.scaleDegreeProbability);
      var noteLength = noteType * (this.tempo / 60);

      //TODO: make the root genreation smooth, should only move an octave at most between
      var root = 60;//Math.floor((Math.random() * (108 - 21) + 21) / 12) * 12 + key; // numbers because of piano 21 to 108 midi
      this[this.playType](root, note, time, noteLength, false);

      beatsLeft -= noteType;
      time += noteLength;
    }
  }
};

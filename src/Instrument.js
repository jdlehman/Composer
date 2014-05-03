var Instrument = (function() {
  function Instrument(config) {
    this.scaleDegreeProbability = config.scaleDegreeProbability;
    this.rhythmProbability = config.rhythmProbability;
    this.musicSettings = config.musicSettings;

    this.oscillatorType = config.oscType;
    this.playType = 'playNote';
    this.useArpeggio = false;
    this.queue = [];
  }

  Instrument.prototype.playNote = function(root, note, startingTime, noteLength) {
    var frequency = this.musicSettings.scale.degreeToFreq(this.musicSettings.scale.at(note), (root).midicps(), 1);
    var oscillator = this.musicSettings.webAudioContext.createOscillator();
    oscillator.connect(this.musicSettings.outputNode);
    oscillator.frequency.value = frequency;
    oscillator.type = oscillator[this.oscillatorType];
    oscillator.start(startingTime);
    oscillator.stop(startingTime + noteLength);
  };

  Instrument.prototype.playChord = function(root, note, startingTime, noteLength) {
    this.playNote(root, note, startingTime, noteLength);

    if(this.useArpeggio) {
      this.playNote(root, note + 2, startingTime + noteLength / 4, noteLength - noteLength / 4);
      this.playNote(root, note + 4, startingTime + noteLength / 2, noteLength - noteLength / 2);
    }
    else {
      this.playNote(root, note + 2, startingTime, noteLength);
      this.playNote(root, note + 4, startingTime, noteLength);
    }
  };

  Instrument.prototype.scheduleMeasure = function(time) {
    var beatsLeft = this.musicSettings.beatsPerMeasure;
    while(beatsLeft) {
      // choose weighted note type
      var noteType = this.musicSettings.RHYTHM_TYPES.wchoose(this.rhythmProbability);
      if(noteType <= beatsLeft) {
        // choose scale degree by weighted random
        var note = this.musicSettings.scale.degrees().wchoose(this.scaleDegreeProbability);
        var noteLength = noteType * (this.musicSettings.tempo / 60);

        //TODO: make the root genreation smooth, should only move an octave at most between
        var root = 60;//Math.floor((Math.random() * (108 - 21) + 21) / 12) * 12 + key; // numbers because of piano 21 to 108 midi
         this[this.playType](root, note, time, noteLength);

        beatsLeft -= noteType;
        time += noteLength;
      }
    }
  };

  return Instrument;
})();

function Composer(config) {
  this.webAudioContext = WebAudioContext();

  // from config
  this.key = config.key;
  this.tempo = config.tempo;
  this.beatsPerMeasure = config.beatsPerMeasure;
  this.scale = sc.Scale[config.scale]();

  this.gainNode = this.webAudioContext.createGainNode();
  this.gainNode.connect(this.webAudioContext.destination);

  this.scaleDegreeProbability = [0.2, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1];//[0.4, 0.05, 0.025, 0.2, 0.3, 0.1, 0.025];
  this.rhythmProbability = [0.2, 0.2, 0.2, 0.2, 0.2];//[0.2, 0.3, 0.3, 0.1, 0.1];

  this.playing = false;
  this.instruments = [];
}

// whole, half, quarter, eight, sixteenth
Composer.prototype.RHYTHM_TYPES = [4, 2, 1, 0.5, 0.25];

Composer.prototype.addInstrument = function(config) {
  config.webAudioContext = this.webAudioContext;
  config.outputNode = this.gainNode;
  config.scale = this.scale;
  var instrument = new Instrument(config);
  this.instruments.push(instrument);
  return instrument;
};

Composer.prototype.play = function() {
  // prevent playing more than once
  if(this.playing) { return; }

  var self = this;
  this.playing = true;
  this.scheduleMeasure();
  this.interval = setInterval(function() {
    if(self.playing) {
      self.scheduleMeasure();
    }
    else {
      clearInterval(self.interval);
    }
  }, this.tempo / 60 * this.beatsPerMeasure * 1000);
};

Composer.prototype.stop = function() {
  this.playing = false;
};

Composer.prototype.scheduleMeasure = function() {
  var self = this;
  var startTime = this.webAudioContext.currentTime;

  this.instruments.forEach(function(instrument) {
    var time = startTime;
    var beatsLeft = self.beatsPerMeasure;
    while(beatsLeft) {
      // choose weighted note type
      var noteType = self.RHYTHM_TYPES.wchoose(self.rhythmProbability);
      if(noteType <= beatsLeft) {
        // choose scale degree by weighted random
        var note = self.scale.degrees().wchoose(self.scaleDegreeProbability);
        var noteLength = noteType * (self.tempo / 60);

        //TODO: make the root genreation smooth, should only move an octave at most between
        var root = 60;//Math.floor((Math.random() * (108 - 21) + 21) / 12) * 12 + key; // numbers because of piano 21 to 108 midi
        var freq =  self.scale.degreeToFreq(self.scale.at(note), (root).midicps(), 1);
        instrument.playNote(freq, time, noteLength);

        beatsLeft -= noteType;
        time += noteLength;
      }
    }
  });
};


//set gain

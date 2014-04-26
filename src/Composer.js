function Composer(config) {
  this.webAudioContext = WebAudioContext();

  // from config
  this.key = config.key;
  this.tempo = config.tempo;
  this.beatsPerMeasure = config.beatsPerMeasure;
  this.scale = sc.Scale[config.scale]();

  this.gainNode = this.webAudioContext.createGainNode();
  // connect gain node to speaker
  this.gainNode.connect(this.webAudioContext.destination);

  this.scaleDegreeProbability = [0.2, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1];//[0.4, 0.05, 0.025, 0.2, 0.3, 0.1, 0.025];
  this.rhythmProbability = [0.2, 0.2, 0.2, 0.2, 0.2];//[0.2, 0.3, 0.3, 0.1, 0.1];

  this.playing = false;
  this.instruments = [];
}

// whole, half, quarter, eight, sixteenth
Composer.prototype.RHYTHM_TYPES = [4, 2, 1, 0.5, 0.25];

Composer.prototype.addInstrument = function(config) {
  //TODO: move to shared object
  config.webAudioContext = this.webAudioContext;
  config.outputNode = this.gainNode;
  config.scale = this.scale;
  config.key = this.key;
  config.tempo = this.tempo;
  config.beatsPerMeasure = this.beatsPerMeasure;
  config.scaleDegreeProbability = this.scaleDegreeProbability;
  config.rhythmProbability = this.rhythmProbability;
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
    instrument.scheduleMeasure(time);
  });
};

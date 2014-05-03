var Composer = (function() {
  function Composer(config) {
    // from config
    this.musicSettings = new MusicSettings(config);

    this.scaleDegreeProbability = [0.2, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1];//[0.4, 0.05, 0.025, 0.2, 0.3, 0.1, 0.025];
    this.rhythmProbability = [0.2, 0.2, 0.2, 0.2, 0.2];//[0.2, 0.3, 0.3, 0.1, 0.1];

    this.instruments = [];
  }

  // attr must be capitalized ex(Scale, BeatsPerMeasure etc)
  Composer.prototype.set = function(attr, val) {
    this.musicSettings['set' + attr](val);
  };

  Composer.prototype.addInstrument = function(config) {
    config.scaleDegreeProbability = this.scaleDegreeProbability;
    config.rhythmProbability = this.rhythmProbability;
    config.musicSettings = this.musicSettings;

    var instrument = new Instrument(config);
    this.instruments.push(instrument);
    return instrument;
  };

  Composer.prototype.play = function() {
    // prevent playing more than once
    if(this.musicSettings.isPlaying) { return; }

    var self = this;
    this.musicSettings.isPlaying = true;
    this.scheduleMeasure();
    this.interval = setInterval(function() {
      if(self.musicSettings.isPlaying) {
        self.scheduleMeasure();
      }
      else {
        clearInterval(self.interval);
      }
    }, this.musicSettings.tempo / 60 * this.musicSettings.beatsPerMeasure * 1000);
  };

  Composer.prototype.stop = function() {
    this.musicSettings.isPlaying = false;
  };

  Composer.prototype.scheduleMeasure = function() {
    var self = this;
    var startTime = this.musicSettings.webAudioContext.currentTime;

    this.instruments.forEach(function(instrument) {
      var time = startTime;
      instrument.scheduleMeasure(time);
    });
  };

  return Composer;
})();

var MusicSettings = (function() {

  function MusicSettings(config) {
    this.key = config.key;
    this.tempo = config.tempo;
    this.beatsPerMeasure = config.beatsPerMeasure;
    this.scale = sc.Scale[config.scale]();
  };

  // whole, half, quarter, eight, sixteenth
  MusicSettings.prototype.RHYTHM_TYPES = [4, 2, 1, 0.5, 0.25];

  MusicSettings.prototype.setKey = function(key) {
    this.key = key;
  };

  MusicSettings.prototype.setTempo = function(tempo) {
    this.tempo = tempo;
  };

  MusicSettings.prototype.setBeatsPerMeasure = function(bpm) {
    this.beatsPerMeasure = bpm;
  };

  MusicSettings.prototype.setScale = function(scale) {
    this.scale = sc.Scale[scale]();
  };

  return MusicSettings;
})();

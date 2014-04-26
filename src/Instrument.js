function Instrument(config) {
  this.webAudioContext = config.webAudioContext;
  this.outputNode = config.outputNode; 
  this.oscillatorType = config.oscType;
}

Instrument.prototype.playNote = function(frequency, startingTime, noteLength) {
  var oscillator = this.webAudioContext.createOscillator();
  oscillator.connect(this.outputNode);
  oscillator.frequency.value = frequency;
  oscillator.type = oscillator[this.oscillatorType];
  oscillator.start(startingTime);
  oscillator.stop(startingTime + noteLength);
};

Instrument.prototype.playChord = function(frequency, startingTime, noteLength, useArpeggio) {
  // play(root, note, time, noteLength);
  // play(root, note + 2, time, noteLength);
  // play(root, note + 4, time, noteLength);
  // arpegiate
  // play(root, note + 2, time + noteLength / 4, noteLength);
  // play(root, note + 4, time + noteLength / 2, noteLength);
};

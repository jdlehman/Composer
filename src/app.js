window.c = new Composer({
  key: 0,
  tempo: 80,
  beatsPerMeasure: 4,
  scale: 'major'
});

c.addInstrument({
  oscType: 'SINE'
});

c.addInstrument({
  oscType: 'SQUARE'
});

c.addInstrument({
  oscType: 'TRIANGLE'
});

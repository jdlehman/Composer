function WebAudioContext() {
  var contextClass = (window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext);
  if (contextClass) {
    // Web Audio API is available.
    return new contextClass();
  } else {
    throw 'Web Audio API is not available in this browser';
  }
}

/**
 * Ambient nature sound: plays a real looped audio file
 * (assets/sounds/suara-alam.mp3) instead of a synthesized sound.
 * Starts OFF — browsers block audio-with-sound until a real user
 * gesture, so this only ever turns on from a click on #sound-toggle-btn
 * (see main.js).
 */
(function(){

  const audio = new Audio('assets/sounds/suara-alam.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;

  let isOn = false;
  let targetVolume = 0.45;
  let fadeTimer = null;

  function fadeTo(target, ms){
    clearInterval(fadeTimer);
    const start = audio.volume;
    const startedAt = performance.now();
    fadeTimer = setInterval(() => {
      const t = Math.min(1, (performance.now() - startedAt) / ms);
      audio.volume = start + (target - start) * t;
      if (t >= 1) clearInterval(fadeTimer);
    }, 40);
  }

  function turnOn(){
    isOn = true;
    audio.play().catch(() => { isOn = false; });
    fadeTo(targetVolume, 900);
  }

  function turnOff(){
    isOn = false;
    fadeTo(0, 600);
    setTimeout(() => { if (!isOn) audio.pause(); }, 650);
  }

  window.AmbientSound = {
    toggle(){
      if (isOn) turnOff(); else turnOn();
      return isOn;
    },
    isOn(){ return isOn; },
    // volume: 0 to 1. Applied immediately if currently playing; always
    // remembered as the level to fade in to next time it's turned on.
    setVolume(v){
      targetVolume = Math.max(0, Math.min(1, v));
      if (isOn){
        clearInterval(fadeTimer);
        audio.volume = targetVolume;
      }
    },
    getVolume(){ return targetVolume; }
  };

})();

/**
 * Ambient nature sound: plays a real looped audio file
 * (assets/sounds/suara-alam.mp3). Starts OFF — browsers block audio
 * until a real user gesture, so this only ever turns on from a click
 * on #sound-toggle-btn (see main.js).
 *
 * toggle() is async-aware: it doesn't just flip a flag, it waits to see
 * whether audio.play() actually succeeds (browsers can reject it, e.g.
 * if the file 404s or autoplay is blocked) and reports the *real*
 * resulting state back through the callback, so the UI never shows
 * "on" while the file is actually silent.
 */
(function(){

  const audio = new Audio('assets/sounds/suara-alam.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;

  const TARGET_VOLUME = 0.45;
  let isOn = false;
  let fadeTimer = null;

  audio.addEventListener('error', () => {
    console.warn('Ruang Rehat Bunga: file suara tidak bisa dimuat (assets/sounds/suara-alam.mp3). Cek nama file & lokasinya di repo.');
  });

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

  function turnOff(){
    isOn = false;
    fadeTo(0, 500);
    setTimeout(() => { if (!isOn) audio.pause(); }, 550);
  }

  window.AmbientSound = {
    /**
     * @param {(on: boolean) => void} onSettled called once we know the
     *   real state (playback actually started, or actually failed).
     */
    toggle(onSettled){
      if (isOn){
        turnOff();
        onSettled && onSettled(false);
        return;
      }
      audio.play()
        .then(() => {
          isOn = true;
          fadeTo(TARGET_VOLUME, 900);
          onSettled && onSettled(true);
        })
        .catch((err) => {
          console.warn('Ruang Rehat Bunga: suara alam gagal diputar.', err);
          isOn = false;
          onSettled && onSettled(false);
        });
    },
    isOn(){ return isOn; }
  };

})();

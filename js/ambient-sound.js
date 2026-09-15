/**
 * Ambient nature sound: a soft flowing-water bed plus occasional bird
 * chirps, generated entirely with the Web Audio API — no audio files
 * needed, so nothing to license or host.
 *
 * Starts OFF. Browsers block audio with sound until a real user
 * gesture unlocks the AudioContext, so this only ever turns on from
 * a click on #sound-toggle-btn (see main.js).
 */
(function(){

  let ctx = null;
  let masterGain = null;
  let waterSrc = null;
  let waterLfo = null;
  let birdTimer = null;
  let isOn = false;

  function ensureContext(){
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
  }

  // ---------- flowing water bed ----------

  function makeWaterBuffer(){
    // A few seconds of soft brown-ish noise, looped. Brown noise (as
    // opposed to flat white noise) sounds much closer to running water
    // — it's built by lightly integrating white noise instead of using
    // it raw.
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++){
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  function startWater(){
    const src = ctx.createBufferSource();
    src.buffer = makeWaterBuffer();
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.6;

    // Slowly drift the filter so the water isn't a static drone —
    // real running water swells and dips.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.55;

    src.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(masterGain);
    src.start();

    waterSrc = src;
    waterLfo = lfo;
  }

  function stopWater(){
    if (waterSrc){ try { waterSrc.stop(); } catch(e){} waterSrc = null; }
    if (waterLfo){ try { waterLfo.stop(); } catch(e){} waterLfo = null; }
  }

  // ---------- soft bird chirps ----------

  function playChirp(){
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const base = 1800 + Math.random() * 1400;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * (0.75 + Math.random() * 0.4), now + 0.09);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(g);
    if (ctx.createStereoPanner){
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 1.6 - 0.8;
      g.connect(pan);
      pan.connect(masterGain);
    } else {
      g.connect(masterGain);
    }

    osc.start(now);
    osc.stop(now + 0.16);

    if (Math.random() < 0.5){
      setTimeout(() => { if (isOn) playChirp(); }, 90 + Math.random() * 60);
    }
  }

  function scheduleNextChirp(){
    const delay = 3500 + Math.random() * 7000;
    birdTimer = setTimeout(() => {
      if (isOn) playChirp();
      scheduleNextChirp();
    }, delay);
  }

  function stopChirps(){
    if (birdTimer) clearTimeout(birdTimer);
    birdTimer = null;
  }

  // ---------- public toggle ----------

  function fadeMasterTo(value, seconds){
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(value, now + seconds);
  }

  function turnOn(){
    ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
    if (!waterSrc) startWater();
    if (!birdTimer) scheduleNextChirp();
    fadeMasterTo(0.5, 1.2);
    isOn = true;
  }

  function turnOff(){
    isOn = false;
    if (!ctx) return;
    fadeMasterTo(0, 0.8);
    setTimeout(() => { stopWater(); stopChirps(); }, 850);
  }

  window.AmbientSound = {
    toggle(){
      if (isOn) turnOff(); else turnOn();
      return isOn;
    },
    isOn(){ return isOn; }
  };

})();

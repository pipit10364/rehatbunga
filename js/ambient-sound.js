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

    // Lowpass, not bandpass: a bandpass here was cutting away the low
    // rumble the noise buffer was built to have and leaving only a
    // thin slice around 900Hz, which read as hiss/static rather than
    // a soft "shhh". Lowpass keeps the gentle low end intact.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    filter.Q.value = 0.3;

    // Slowly drift the cutoff so the water isn't a static drone — real
    // running water swells and dips — but keep the range small so it
    // doesn't sweep into a whistle.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.035;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 110;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.32;

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
    // A soft 1-2 note trill with a slow attack and a long tail, in a
    // lower register than before. The old version had an instant
    // 15ms attack and a sharp downward pitch snap at 1800-3200Hz —
    // acoustically that's the same shape as a notification beep, which
    // is exactly why it read as an alert instead of a bird. This
    // version fades in gently and bends pitch slowly.
    const noteCount = 1 + Math.floor(Math.random() * 2);
    const baseFreq = 1500 + Math.random() * 900;
    let t = ctx.currentTime;

    for (let i = 0; i < noteCount; i++){
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const freq = i === 0 ? baseFreq : baseFreq * (0.85 + Math.random() * 0.3);
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * (0.94 + Math.random() * 0.08), t + 0.2);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.028, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(g);
      if (ctx.createStereoPanner){
        const pan = ctx.createStereoPanner();
        pan.pan.value = Math.random() * 1.2 - 0.6;
        g.connect(pan);
        pan.connect(masterGain);
      } else {
        g.connect(masterGain);
      }

      osc.start(t);
      osc.stop(t + 0.34);
      t += 0.22 + Math.random() * 0.08;
    }
  }

  function scheduleNextChirp(){
    // Spaced further apart than before — a bird call every few seconds
    // felt busy/alert-like; real ambience leaves a lot of silence.
    const delay = 6000 + Math.random() * 9000;
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
    fadeMasterTo(0.42, 1.4);
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

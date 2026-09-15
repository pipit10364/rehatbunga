/**
 * Short feedback effects for clearing a row/column: a small synthesized
 * chime (Web Audio API, no extra audio file needed) plus a device
 * vibration on supported browsers (mostly Android Chrome; iOS Safari and
 * desktop simply ignore the vibrate call).
 */
(function(){

  let audioCtx = null;

  function getCtx(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // Soft pentatonic run so it always sounds pleasant regardless of order.
  const NOTES = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

  function tone(ctx, freq, startTime, duration, peakGain){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function playClearChime(lineCount){
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const noteCount = Math.min(NOTES.length, Math.max(2, lineCount + 1));
    for (let i = 0; i < noteCount; i++){
      tone(ctx, NOTES[i], now + i * 0.055, 0.32, 0.08);
    }
  }

  function vibrateForClear(lineCount){
    if (!('vibrate' in navigator)) return;
    try {
      navigator.vibrate(lineCount >= 2 ? [22, 35, 22, 35, 30] : 28);
    } catch (e){ /* some browsers throw if called outside a gesture; ignore */ }
  }

  window.SFX = {
    /** Call right when row(s)/column(s) fully clear. */
    playClear(lineCount){
      playClearChime(lineCount);
      vibrateForClear(lineCount);
    }
  };

})();

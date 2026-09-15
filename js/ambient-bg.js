/**
 * Ambient rotating flower background used behind the intro screen and the
 * wish-message / wish-wall screens (kept OFF during actual gameplay so it
 * doesn't compete with the board's own reveal image).
 *
 * - Reuses the existing flower photos (window.FLOWERS_FALLBACK) — no new
 *   assets needed.
 * - The active image is picked from the current 15-minute wall-clock
 *   window, so it naturally rotates every 15 minutes and stays in sync
 *   even after a page refresh.
 * - Rendered with background-size:cover on a fixed full-viewport layer,
 *   so a square photo always fills the device's actual shape (portrait
 *   phone, landscape laptop, whatever) with no empty bars — it just
 *   crops in, the same way the board reveal image already does.
 */
(function(){

  const SLOT_MS = 15 * 60 * 1000; // 15 minutes
  const CHECK_MS = 20 * 1000;     // cheap poll to catch the slot boundary

  const images = (window.FLOWERS_FALLBACK || []).map(f => f.image);

  const root = document.getElementById('ambient-bg');
  const layers = [
    document.getElementById('ambient-bg-a'),
    document.getElementById('ambient-bg-b')
  ];

  let activeLayer = 0;
  let lastSlot = -1;

  function currentSlot(){
    return Math.floor(Date.now() / SLOT_MS) % images.length;
  }

  function applySlot(slot){
    const url = images[slot];
    if (!url) return;
    const showEl = layers[activeLayer];
    const hideEl = layers[1 - activeLayer];
    showEl.style.backgroundImage = `url("${url}")`;
    showEl.classList.add('is-active');
    hideEl.classList.remove('is-active');
    activeLayer = 1 - activeLayer;
  }

  function tick(){
    if (!images.length) return;
    const slot = currentSlot();
    if (slot !== lastSlot){
      lastSlot = slot;
      applySlot(slot);
    }
  }

  tick();
  setInterval(tick, CHECK_MS);

  window.AmbientBg = {
    show(){ root && root.classList.add('is-visible'); },
    hide(){ root && root.classList.remove('is-visible'); }
  };

})();

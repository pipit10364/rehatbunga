(function(){

  let flowersData = [];
  let currentFlower = null;

  const el = {
    introOverlay: document.getElementById('intro-overlay'),
    introStartBtn: document.getElementById('intro-start-btn'),

    gameView: document.getElementById('game-view'),
    boardGrid: document.getElementById('board-grid'),
    boardImageLayer: document.getElementById('board-image-layer'),
    boardImageVeil: document.getElementById('board-image-veil'),
    tray: document.getElementById('tray'),
    progressFill: document.getElementById('progress-fill'),
    progressLabel: document.getElementById('progress-label'),
    progressBar: document.getElementById('progress-bar'),
    restartBtn: document.getElementById('restart-btn'),

    stuckOverlay: document.getElementById('stuck-overlay'),
    stuckRetryBtn: document.getElementById('stuck-retry-btn'),

    victoryOverlay: document.getElementById('victory-overlay'),
    flipCard: document.getElementById('flip-card'),
    flipBtn: document.getElementById('flip-btn'),
    flowerPhoto: document.getElementById('flower-photo'),
    flowerName: document.getElementById('flower-name'),
    flowerMeaning: document.getElementById('flower-meaning'),
    flowerMessage: document.getElementById('flower-message'),
    wishForm: document.getElementById('wish-form'),
    wishInput: document.getElementById('wish-input'),

    wallView: document.getElementById('wall-view'),
    wallMasonry: document.getElementById('wall-masonry'),
    playAgainBtn: document.getElementById('play-again-btn')
  };

  function loadFlowersData(){
    return fetch('src/data/flowers.json')
      .then(res => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .catch(() => window.FLOWERS_FALLBACK);
  }

  function pickRandomFlower(){
    return flowersData[Math.floor(Math.random() * flowersData.length)];
  }

  function showOverlay(overlayEl){
    overlayEl.hidden = false;
    requestAnimationFrame(() => overlayEl.classList.add('is-visible'));
  }

  function hideOverlay(overlayEl){
    overlayEl.classList.remove('is-visible');
    setTimeout(() => { overlayEl.hidden = true; }, 350);
  }

  function updateProgressUI(ratio){
    const pct = Math.round(ratio * 100);
    el.progressFill.style.width = pct + '%';
    el.progressBar.setAttribute('aria-valuenow', String(pct));

    let label;
    if (pct === 0) label = 'Bunga mulai mekar… 0%';
    else if (pct < 100) label = `Bunga sedang mekar… ${pct}%`;
    else label = 'Bunga mekar sepenuhnya 🌸';
    el.progressLabel.textContent = label;

    el.boardImageVeil.style.opacity = String(1 - ratio);
    el.boardImageLayer.style.opacity = String(ratio);
  }

  function setupBoardImage(flower){
    el.boardImageLayer.style.backgroundImage = `url("${flower.image}")`;
  }

  function startNewGameSession(){
    currentFlower = pickRandomFlower();
    setupBoardImage(currentFlower);
    el.flipCard.classList.remove('is-flipped');
    el.wishInput.value = '';

    window.Board.init(el.boardGrid, el.tray, {
      onProgress: updateProgressUI,
      onStuck: () => showOverlay(el.stuckOverlay),
      onVictory: showVictory
    });
  }

  function showVictory(){
    el.flowerPhoto.src = currentFlower.image;
    el.flowerPhoto.alt = `Bunga ${currentFlower.name}`;
    el.flowerName.textContent = currentFlower.name;
    el.flowerMeaning.textContent = currentFlower.meaning;
    el.flowerMessage.textContent = currentFlower.message;
    el.gameView.hidden = true;
    showOverlay(el.victoryOverlay);
  }

  function goToWishWall(){
    hideOverlay(el.victoryOverlay);
    setTimeout(() => {
      el.wallView.hidden = false;
      window.WishWall.render(el.wallMasonry);
    }, 200);
  }

  function resetToIntroFlow(){
    el.wallView.hidden = true;
    el.gameView.hidden = false;
    startNewGameSession();
  }

  // ---------- wire events ----------

  el.introStartBtn.addEventListener('click', () => {
    hideOverlay(el.introOverlay);
    el.gameView.hidden = false;
    startNewGameSession();
  });

  el.restartBtn.addEventListener('click', () => {
    window.Board.resetBoardKeepProgress();
  });

  el.stuckRetryBtn.addEventListener('click', () => {
    hideOverlay(el.stuckOverlay);
    window.Board.resetBoardKeepProgress();
  });

  el.flipBtn.addEventListener('click', () => {
    el.flipCard.classList.add('is-flipped');
    setTimeout(() => el.wishInput.focus(), 500);
  });

  el.wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = el.wishInput.value.trim();
    if (!text) return;
    window.WishWall.addWish(text, currentFlower.name);
    goToWishWall();
  });

  el.playAgainBtn.addEventListener('click', resetToIntroFlow);

  // ---------- boot ----------

  loadFlowersData().then(data => {
    flowersData = data;
  });

})();

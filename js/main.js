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
    flipBackPanels: document.getElementById('flip-back-panels'),
    goWriteBtn: document.getElementById('go-write-btn'),
    backToMessageBtn: document.getElementById('back-to-message-btn'),
    wishForm: document.getElementById('wish-form'),
    wishInput: document.getElementById('wish-input'),
    insertLinkBtn: document.getElementById('insert-link-btn'),
    linkInsertRow: document.getElementById('link-insert-row'),
    linkLabelInput: document.getElementById('link-label-input'),
    linkUrlInput: document.getElementById('link-url-input'),
    linkInsertConfirm: document.getElementById('link-insert-confirm'),
    linkInsertCancel: document.getElementById('link-insert-cancel'),

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
    el.flipBackPanels.classList.remove('is-writing');
    el.wishInput.value = '';
    el.linkInsertRow.hidden = true;
    if (window.AmbientBg) window.AmbientBg.hide();

    window.Board.init(el.boardGrid, el.tray, {
      onProgress: updateProgressUI,
      onStuck: () => showOverlay(el.stuckOverlay),
      onVictory: showVictory
    });
  }

  function renderMessageParagraphs(container, text){
    container.innerHTML = '';
    text.split(/\n+/).map(s => s.trim()).filter(Boolean).forEach(paragraph => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      container.appendChild(p);
    });
  }

  function showVictory(){
    el.flowerPhoto.src = currentFlower.image;
    el.flowerPhoto.alt = `Bunga ${currentFlower.name}`;
    el.flowerName.textContent = currentFlower.name;
    el.flowerMeaning.textContent = currentFlower.meaning;
    renderMessageParagraphs(el.flowerMessage, currentFlower.message);
    el.gameView.hidden = true;
    if (window.AmbientBg) window.AmbientBg.show();
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
  });

  // Mobile: "Tulis Harapanmu" slides to a separate writing room.
  // Desktop: both rooms are already shown side by side (see CSS), and
  // these buttons are hidden there, so this just quietly does nothing.
  el.goWriteBtn.addEventListener('click', () => {
    el.flipBackPanels.classList.add('is-writing');
    setTimeout(() => el.wishInput.focus(), 400);
  });

  el.backToMessageBtn.addEventListener('click', () => {
    el.flipBackPanels.classList.remove('is-writing');
  });

  el.insertLinkBtn.addEventListener('click', () => {
    el.linkInsertRow.hidden = !el.linkInsertRow.hidden;
    if (!el.linkInsertRow.hidden) el.linkLabelInput.focus();
  });

  el.linkInsertCancel.addEventListener('click', () => {
    el.linkInsertRow.hidden = true;
    el.linkLabelInput.value = '';
    el.linkUrlInput.value = '';
  });

  el.linkInsertConfirm.addEventListener('click', () => {
    const label = el.linkLabelInput.value.trim();
    let url = el.linkUrlInput.value.trim();
    if (!label || !url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    // Stored as [label](url) — the wish wall renders this as a small
    // clickable chip showing just the label, not the raw link.
    const token = `[${label}](${url})`;
    const ta = el.wishInput;
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    ta.value = ta.value.slice(0, start) + token + ta.value.slice(end);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + token.length;

    el.linkInsertRow.hidden = true;
    el.linkLabelInput.value = '';
    el.linkUrlInput.value = '';
  });

  el.wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = el.wishInput.value.trim();
    if (!text) return;

    const submitBtn = el.wishForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim…';

    window.WishWall.addWish(text, currentFlower.name)
      .then(() => {
        goToWishWall();
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        alert('Harapanmu belum berhasil terkirim. Coba cek koneksimu, lalu kirim ulang ya.');
      });
  });

  el.playAgainBtn.addEventListener('click', resetToIntroFlow);

  // ---------- boot ----------

  if (window.AmbientBg) window.AmbientBg.show();
  showOverlay(el.introOverlay);

  loadFlowersData().then(data => {
    flowersData = data;
  });

})();

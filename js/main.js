(function(){

  let flowersData = window.FLOWERS_FALLBACK || [];
  let currentFlower = null;
  let lastFlowerId = null;

  const el = {
    introOverlay: document.getElementById('intro-overlay'),
    introStartBtn: document.getElementById('intro-start-btn'),
    introSkipToWallBtn: document.getElementById('intro-skip-to-wall-btn'),

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
    skipToWallBtn: document.getElementById('skip-to-wall-btn'),
    insertLinkBtn: document.getElementById('insert-link-btn'),
    linkInsertRow: document.getElementById('link-insert-row'),
    linkLabelInput: document.getElementById('link-label-input'),
    linkUrlInput: document.getElementById('link-url-input'),
    linkInsertConfirm: document.getElementById('link-insert-confirm'),
    linkInsertCancel: document.getElementById('link-insert-cancel'),

    wallView: document.getElementById('wall-view'),
    wallMasonry: document.getElementById('wall-masonry'),
    wallWriteBtn: document.getElementById('wall-write-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),

    quickWriteOverlay: document.getElementById('quick-write-overlay'),
    quickWishForm: document.getElementById('quick-wish-form'),
    quickWishInput: document.getElementById('quick-wish-input'),
    quickInsertLinkBtn: document.getElementById('quick-insert-link-btn'),
    quickLinkInsertRow: document.getElementById('quick-link-insert-row'),
    quickLinkLabelInput: document.getElementById('quick-link-label-input'),
    quickLinkUrlInput: document.getElementById('quick-link-url-input'),
    quickLinkInsertConfirm: document.getElementById('quick-link-insert-confirm'),
    quickLinkInsertCancel: document.getElementById('quick-link-insert-cancel'),
    quickWriteCancelBtn: document.getElementById('quick-write-cancel-btn'),

    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    soundToggleIcon: document.querySelector('#sound-toggle-btn .sound-toggle-icon')
  };

  function loadFlowersData(){
    return fetch('src/data/flowers.json')
      .then(res => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .catch(() => window.FLOWERS_FALLBACK);
  }

  // Start with the bundled fallback synchronously (flowers-data.js loads
  // before this file), so the "Mulai Rehat" button always has data ready
  // even if the fetch() below is still in flight or fails. Upgrades to
  // the fetched copy once it resolves.

  function pickRandomFlower(){
    if (flowersData.length <= 1) return flowersData[0];
    // Still uniform random overall — this just refuses to pick the exact
    // same flower as last time, so two sessions in a row never repeat.
    let candidate;
    let attempts = 0;
    do {
      candidate = flowersData[Math.floor(Math.random() * flowersData.length)];
      attempts++;
    } while (candidate.id === lastFlowerId && attempts < 10);
    lastFlowerId = candidate.id;
    return candidate;
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

  // Wires the "sisipkan tautan" mini-tool for a given wish textarea.
  // Shared by the flower-panel write form and the standalone quick-write
  // form so the [label](url) insertion behavior stays identical.
  function wireLinkInsertTool({ toggleBtn, row, labelInput, urlInput, confirmBtn, cancelBtn, textarea }){
    toggleBtn.addEventListener('click', () => {
      row.hidden = !row.hidden;
      if (!row.hidden) labelInput.focus();
    });

    cancelBtn.addEventListener('click', () => {
      row.hidden = true;
      labelInput.value = '';
      urlInput.value = '';
    });

    confirmBtn.addEventListener('click', () => {
      const label = labelInput.value.trim();
      let url = urlInput.value.trim();
      if (!label || !url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      const token = `[${label}](${url})`;
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      textarea.value = textarea.value.slice(0, start) + token + textarea.value.slice(end);
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + token.length;

      row.hidden = true;
      labelInput.value = '';
      urlInput.value = '';
    });
  }

  // Wires a wish form's submit: sends to WishWall.addWish, disables the
  // button while sending, and calls onSuccess() once it lands.
  // getFlowerName() is a function so the flower can be looked up at
  // submit time (currentFlower may not exist yet when this is wired).
  function wireWishForm({ form, input, getFlowerName, onSuccess }){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Mengirim…';

      window.WishWall.addWish(text, getFlowerName())
        .then(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
          input.value = '';
          onSuccess();
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
          alert('Harapanmu belum berhasil terkirim. Coba cek koneksimu, lalu kirim ulang ya.');
        });
    });
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

  // For anyone who opens this in a state where writing feels like too
  // much right now — skips straight to the wall, no wish required.
  el.skipToWallBtn.addEventListener('click', () => {
    goToWishWall();
  });

  el.backToMessageBtn.addEventListener('click', () => {
    el.flipBackPanels.classList.remove('is-writing');
  });

  wireLinkInsertTool({
    toggleBtn: el.insertLinkBtn,
    row: el.linkInsertRow,
    labelInput: el.linkLabelInput,
    urlInput: el.linkUrlInput,
    confirmBtn: el.linkInsertConfirm,
    cancelBtn: el.linkInsertCancel,
    textarea: el.wishInput
  });

  wireWishForm({
    form: el.wishForm,
    input: el.wishInput,
    getFlowerName: () => (currentFlower ? currentFlower.name : ''),
    onSuccess: goToWishWall
  });

  // Standalone quick-write form: reachable from the intro's skip-to-wall
  // path and from the "Tulis Pesan" button on the wall itself, so there
  // may be no currentFlower — wishes sent here just have no flowerName.
  wireLinkInsertTool({
    toggleBtn: el.quickInsertLinkBtn,
    row: el.quickLinkInsertRow,
    labelInput: el.quickLinkLabelInput,
    urlInput: el.quickLinkUrlInput,
    confirmBtn: el.quickLinkInsertConfirm,
    cancelBtn: el.quickLinkInsertCancel,
    textarea: el.quickWishInput
  });

  wireWishForm({
    form: el.quickWishForm,
    input: el.quickWishInput,
    getFlowerName: () => '',
    onSuccess: () => hideOverlay(el.quickWriteOverlay)
  });

  el.introSkipToWallBtn.addEventListener('click', () => {
    hideOverlay(el.introOverlay);
    setTimeout(() => {
      el.wallView.hidden = false;
      window.WishWall.render(el.wallMasonry);
    }, 200);
  });

  el.wallWriteBtn.addEventListener('click', () => {
    showOverlay(el.quickWriteOverlay);
    setTimeout(() => el.quickWishInput.focus(), 400);
  });

  el.quickWriteCancelBtn.addEventListener('click', () => {
    hideOverlay(el.quickWriteOverlay);
    el.quickWishInput.value = '';
    el.quickLinkInsertRow.hidden = true;
  });

  el.playAgainBtn.addEventListener('click', resetToIntroFlow);

  el.soundToggleBtn.addEventListener('click', () => {
    if (!window.AmbientSound) return;
    window.AmbientSound.toggle((on) => {
      el.soundToggleBtn.classList.toggle('is-active', on);
      el.soundToggleBtn.setAttribute('aria-pressed', String(on));
      el.soundToggleIcon.textContent = on ? '🔊' : '🔈';
    });
  });

  // ---------- boot ----------

  if (window.AmbientBg) window.AmbientBg.show();
  showOverlay(el.introOverlay);

  loadFlowersData().then(data => {
    if (data && data.length) flowersData = data;
  });

})();

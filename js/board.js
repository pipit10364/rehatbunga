/**
 * Core Block-Blast style board logic.
 * Exposes window.Board with init/reset/callbacks. No external deps.
 */
(function(){

  const SIZE = 8;
  const MAX_CLEARS_FOR_FULL_REVEAL = 18; // lines needed to reach 100% reveal
  const CLEAR_ANIM_MS = 420;

  let grid = [];            // SIZE x SIZE, each cell null or {fill,deep}
  let cellEls = [];         // matching DOM refs
  let trayShapes = [null, null, null];
  let totalLinesCleared = 0;
  let victoryFired = false;

  let boardGridEl, trayEl;
  let callbacks = {};
  let trayEventsWired = false;

  function emptyGrid(){
    const g = [];
    for (let r = 0; r < SIZE; r++){
      g.push(new Array(SIZE).fill(null));
    }
    return g;
  }

  function buildBoardDom(){
    boardGridEl.innerHTML = '';
    cellEls = [];
    for (let r = 0; r < SIZE; r++){
      const row = [];
      for (let c = 0; c < SIZE; c++){
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        boardGridEl.appendChild(cell);
        row.push(cell);
      }
      cellEls.push(row);
    }
  }

  function setCellVisual(r, c, color){
    const el = cellEls[r][c];
    if (color){
      el.classList.add('is-filled');
      el.style.background = `linear-gradient(160deg, ${color.fill}, ${color.deep})`;
    } else {
      el.classList.remove('is-filled');
      el.style.background = '';
    }
  }

  function canPlace(cells, originR, originC){
    for (const [dr, dc] of cells){
      const r = originR + dr, c = originC + dc;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return false;
      if (grid[r][c] !== null) return false;
    }
    return true;
  }

  function canPlaceAnywhere(cells){
    for (let r = 0; r < SIZE; r++){
      for (let c = 0; c < SIZE; c++){
        if (canPlace(cells, r, c)) return true;
      }
    }
    return false;
  }

  function anyTrayShapePlaceable(){
    return trayShapes.some(s => s && canPlaceAnywhere(s.cells));
  }

  function placeShapeAt(shape, originR, originC){
    shape.cells.forEach(([dr, dc]) => {
      const r = originR + dr, c = originC + dc;
      grid[r][c] = shape.color;
      setCellVisual(r, c, shape.color);
    });
  }

  function findFullLines(){
    const rows = [];
    const cols = [];
    for (let r = 0; r < SIZE; r++){
      if (grid[r].every(cell => cell !== null)) rows.push(r);
    }
    for (let c = 0; c < SIZE; c++){
      let full = true;
      for (let r = 0; r < SIZE; r++){
        if (grid[r][c] === null){ full = false; break; }
      }
      if (full) cols.push(c);
    }
    return { rows, cols };
  }

  function clearLines(rows, cols){
    const coords = new Set();
    rows.forEach(r => { for (let c = 0; c < SIZE; c++) coords.add(r + ',' + c); });
    cols.forEach(c => { for (let r = 0; r < SIZE; r++) coords.add(r + ',' + c); });

    coords.forEach(key => {
      const [r, c] = key.split(',').map(Number);
      cellEls[r][c].classList.add('is-clearing');
    });

    setTimeout(() => {
      coords.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        grid[r][c] = null;
        cellEls[r][c].classList.remove('is-clearing');
        setCellVisual(r, c, null);
      });
    }, CLEAR_ANIM_MS);

    return rows.length + cols.length;
  }

  function afterPlacementResolve(){
    const { rows, cols } = findFullLines();
    if (rows.length || cols.length){
      const lines = clearLines(rows, cols);
      window.SFX && window.SFX.playClear(lines);
      totalLinesCleared += lines;
      const ratio = Math.min(1, totalLinesCleared / MAX_CLEARS_FOR_FULL_REVEAL);
      callbacks.onProgress && callbacks.onProgress(ratio);
      if (ratio >= 1 && !victoryFired){
        victoryFired = true;
        setTimeout(() => callbacks.onVictory && callbacks.onVictory(), CLEAR_ANIM_MS + 150);
      }
      return true;
    }
    return false;
  }

  // ---------- tray ----------

  function renderShapeInto(container, cells, color, cellPx, gapPx){
    const bounds = shapeBounds(cells);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${bounds.cols}, ${cellPx}px)`;
    container.style.gridTemplateRows = `repeat(${bounds.rows}, ${cellPx}px)`;
    container.style.gap = gapPx + 'px';
    container.classList.add('shape-grid');

    const filled = new Set(cells.map(([r,c]) => r + ',' + c));
    for (let r = 0; r < bounds.rows; r++){
      for (let c = 0; c < bounds.cols; c++){
        const div = document.createElement('div');
        if (filled.has(r + ',' + c)){
          div.className = 'shape-cell';
          div.style.background = `linear-gradient(160deg, ${color.fill}, ${color.deep})`;
          div.style.width = cellPx + 'px';
          div.style.height = cellPx + 'px';
        } else {
          div.className = 'shape-cell is-empty';
          div.style.width = cellPx + 'px';
          div.style.height = cellPx + 'px';
        }
        container.appendChild(div);
      }
    }
    return bounds;
  }

  function renderTray(){
    const slots = trayEl.querySelectorAll('.tray-slot');
    slots.forEach((slotEl, i) => {
      const shape = trayShapes[i];
      slotEl.innerHTML = '';
      if (!shape){
        slotEl.classList.add('is-empty');
        return;
      }
      slotEl.classList.remove('is-empty');
      // Render into a child wrapper, not slotEl itself: renderShapeInto()
      // adds the "shape-grid" class, which carries pointer-events:none.
      // Applying that directly to slotEl would make the slot ignore the
      // very pointerdown events it needs for dragging.
      const wrapper = document.createElement('div');
      slotEl.appendChild(wrapper);
      renderShapeInto(wrapper, shape.cells, shape.color, 18, 3);
    });
  }

  function spawnNewTray(){
    let attempts = 0;
    let candidate;
    do {
      candidate = [pickRandomShape(), pickRandomShape(), pickRandomShape()];
      attempts++;
    } while (
      attempts < 40 &&
      !candidate.some(s => canPlaceAnywhere(s.cells))
    );
    trayShapes = candidate;
    renderTray();
    checkStuckState();
  }

  function checkStuckState(){
    if (!anyTrayShapePlaceable()){
      callbacks.onStuck && callbacks.onStuck();
    }
  }

  // ---------- drag & drop ----------

  let dragState = null;

  function startDrag(slotIndex, pointerEvent){
    const shape = trayShapes[slotIndex];
    if (!shape) return;

    const boardRect = boardGridEl.getBoundingClientRect();
    const cellStep = boardRect.width / SIZE;
    const bounds = shapeBounds(shape.cells);
    const isTouch = pointerEvent.pointerType === 'touch';
    const lift = isTouch ? Math.max(70, cellStep * 1.4) : 18;

    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    renderShapeInto(ghost, shape.cells, shape.color, cellStep - 4, 4);
    document.body.appendChild(ghost);

    const slotEl = trayEl.querySelector(`[data-slot="${slotIndex}"]`);
    slotEl.classList.add('is-dragging');

    dragState = {
      slotIndex, shape, ghost, boardRect, cellStep, bounds, lift,
      originR: -99, originC: -99, valid: false
    };

    positionGhost(pointerEvent.clientX, pointerEvent.clientY);
    updatePreview(pointerEvent.clientX, pointerEvent.clientY);

    document.addEventListener('pointermove', onDragMove);
    document.addEventListener('pointerup', onDragEnd);
    document.addEventListener('pointercancel', onDragEnd);
  }

  function positionGhost(clientX, clientY){
    const { ghost, bounds, cellStep, lift } = dragState;
    const w = bounds.cols * cellStep;
    const h = bounds.rows * cellStep;
    ghost.style.left = (clientX - w / 2) + 'px';
    ghost.style.top = (clientY - lift - h / 2) + 'px';
  }

  function clearPreviewClasses(){
    for (let r = 0; r < SIZE; r++){
      for (let c = 0; c < SIZE; c++){
        cellEls[r][c].classList.remove('is-preview-ok', 'is-preview-bad');
      }
    }
  }

  function updatePreview(clientX, clientY){
    const { boardRect, cellStep, bounds, shape, lift } = dragState;
    const w = bounds.cols * cellStep;
    const h = bounds.rows * cellStep;
    const ghostLeft = clientX - w / 2;
    const ghostTop = clientY - lift - h / 2;

    const originC = Math.round((ghostLeft - boardRect.left) / cellStep);
    const originR = Math.round((ghostTop - boardRect.top) / cellStep);

    clearPreviewClasses();

    const inBounds = originR >= -0 && originC >= -0 &&
      originR + bounds.rows <= SIZE && originC + bounds.cols <= SIZE &&
      originR > -bounds.rows && originC > -bounds.cols;

    let valid = false;
    if (originR >= 0 && originC >= 0 && originR + bounds.rows <= SIZE && originC + bounds.cols <= SIZE){
      valid = canPlace(shape.cells, originR, originC);
      shape.cells.forEach(([dr, dc]) => {
        const r = originR + dr, c = originC + dc;
        cellEls[r][c].classList.add(valid ? 'is-preview-ok' : 'is-preview-bad');
      });
    }

    dragState.originR = originR;
    dragState.originC = originC;
    dragState.valid = valid;
  }

  function onDragMove(e){
    if (!dragState) return;
    positionGhost(e.clientX, e.clientY);
    updatePreview(e.clientX, e.clientY);
  }

  function commitPlacement(slotIndex, shape, originR, originC){
    placeShapeAt(shape, originR, originC);
    trayShapes[slotIndex] = null;
    renderTray();
    const didClear = afterPlacementResolve();

    if (trayShapes.every(s => s === null)){
      setTimeout(spawnNewTray, CLEAR_ANIM_MS + 60);
    } else if (didClear){
      // grid[r][c] only actually becomes null once clearLines()'s own
      // setTimeout has run. Checking placeability before that reads the
      // stale, still-full board and can wrongly report "stuck" right
      // after a clear that would have freed up space.
      setTimeout(checkStuckState, CLEAR_ANIM_MS + 20);
    } else {
      checkStuckState();
    }
  }

  function findFirstFit(cells){
    for (let r = 0; r < SIZE; r++){
      for (let c = 0; c < SIZE; c++){
        if (canPlace(cells, r, c)) return { r, c };
      }
    }
    return null;
  }

  function onDragEnd(e){
    if (!dragState) return;
    const { slotIndex, shape, ghost, valid, originR, originC } = dragState;

    clearPreviewClasses();
    ghost.remove();
    const slotEl = trayEl.querySelector(`[data-slot="${slotIndex}"]`);
    slotEl.classList.remove('is-dragging');

    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', onDragEnd);
    document.removeEventListener('pointercancel', onDragEnd);
    dragState = null;

    if (valid){
      commitPlacement(slotIndex, shape, originR, originC);
    }
  }

  function wireTrayEvents(){
    trayEl.querySelectorAll('.tray-slot').forEach(slotEl => {
      slotEl.addEventListener('pointerdown', (e) => {
        const idx = Number(slotEl.dataset.slot);
        if (!trayShapes[idx]) return;
        e.preventDefault();
        startDrag(idx, e);
      });

      // Keyboard fallback for anyone who can't drag with a pointer: Enter
      // or Space drops the focused piece into the first open spot found
      // scanning top-left to bottom-right. Not a full keyboard-driven
      // placement UI, but it keeps the game playable via Tab + Enter
      // rather than being pointer-only.
      slotEl.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        const idx = Number(slotEl.dataset.slot);
        const shape = trayShapes[idx];
        if (!shape) return;
        const spot = findFirstFit(shape.cells);
        if (!spot) return;
        commitPlacement(idx, shape, spot.r, spot.c);
      });
    });
  }

  // ---------- public API ----------

  window.Board = {
    init(boardGridElement, trayElement, cbs){
      boardGridEl = boardGridElement;
      trayEl = trayElement;
      callbacks = cbs || {};
      // wireTrayEvents() attaches fresh closures to the (persistent, never
      // recreated) tray-slot DOM nodes. Board.init() runs again every time
      // "Main Lagi" starts a new session, so without this guard the same
      // slots would pick up one more duplicate pointerdown listener per
      // replay — each drag then firing multiple times.
      if (!trayEventsWired){
        wireTrayEvents();
        trayEventsWired = true;
      }
      this.newGame();
    },

    newGame(){
      grid = emptyGrid();
      totalLinesCleared = 0;
      victoryFired = false;
      buildBoardDom();
      callbacks.onProgress && callbacks.onProgress(0);
      spawnNewTray();
    },

    resetBoardKeepProgress(){
      grid = emptyGrid();
      buildBoardDom();
      spawnNewTray();
    },

    getProgress(){
      return Math.min(1, totalLinesCleared / MAX_CLEARS_FOR_FULL_REVEAL);
    }
  };

})();

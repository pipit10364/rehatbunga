/**
 * "Taman Harapan" wish wall: stores wishes in Firestore (collection
 * "wishes") so everyone playing the game sees the same shared wall in
 * realtime, assigns a random anonymous flower-themed handle, and renders
 * a masonry sticky-note board with lightweight reactions.
 *
 * Requires js/firebase-config.js (loaded before this file) to have set
 * up window.db via the Firebase compat SDK.
 *
 * "Already reacted" state is still tracked locally (sessionStorage),
 * since there is no login system — this stops accidental double-taps in
 * one session but can't stop someone reacting again from another device.
 * That's an accepted tradeoff for a no-account community wall.
 */
(function(){

  const REACTED_KEY = 'rehatBunga.reacted.v1';
  const WISH_TEXT_MAX = 500;

  const HANDLE_PREFIXES = ['Teman Bunga', 'Pencinta', 'Sahabat', 'Penjaga', 'Perawat'];
  const HANDLE_FLOWERS = [
    'Kamomil', 'Dandelion', 'Lavender', 'Matahari', 'Teratai', 'Iris',
    'Magnolia', 'Peoni', 'Aster', 'Hortensia', 'Plum', 'Lily Lembah'
  ];

  // Matches the [label](https://...) token the wish-write link tool
  // inserts. Rendered as a small clickable chip showing only the label —
  // like an Instagram Story link sticker, or a spreadsheet cell whose
  // display text differs from the URL it links to.
  const LINK_TOKEN = /\[([^\[\]]{1,60})\]\((https?:\/\/[^\s()]+)\)/g;

  function renderWishText(container, text){
    LINK_TOKEN.lastIndex = 0;
    let lastIndex = 0;
    let match;
    while ((match = LINK_TOKEN.exec(text))){
      if (match.index > lastIndex){
        container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const a = document.createElement('a');
      a.href = match[2];
      a.target = '_blank';
      a.rel = 'noopener noreferrer nofollow';
      a.className = 'wish-link-chip';
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '🔗';
      const label = document.createElement('span');
      label.textContent = match[1];
      a.appendChild(icon);
      a.appendChild(label);
      container.appendChild(a);
      lastIndex = LINK_TOKEN.lastIndex;
    }
    if (lastIndex < text.length){
      container.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  }

  const REACTIONS = [
    { key: 'rasa', emoji: '🌸', label: 'Aku merasakannya juga' },
    { key: 'peluk', emoji: '🤍', label: 'Kirim pelukan' },
    { key: 'semangat', emoji: '💡', label: 'Kamu pasti bisa' }
  ];

  let unsubscribe = null;

  // Search/sort/filter run entirely client-side against the already-
  // loaded snapshot (max 200 wishes) — no extra Firestore reads needed.
  let wallContainer = null;
  let latestWishes = [];
  const wallQuery = { search: '', sort: 'terbaru', flower: '' };

  function sumReactions(wish){
    const r = wish.reactions || {};
    return (r.rasa || 0) + (r.peluk || 0) + (r.semangat || 0);
  }

  function populateFlowerFilter(selectEl){
    if (!selectEl) return;
    const current = selectEl.value;
    const names = [...new Set(latestWishes.map(w => w.flowerName).filter(Boolean))].sort();
    selectEl.innerHTML = '<option value="">Semua bunga</option>' +
      names.map(n => `<option value="${n}">${n}</option>`).join('');
    if (names.includes(current)) selectEl.value = current;
  }

  // Re-derives the visible list from latestWishes whenever the snapshot
  // updates or the person changes search/sort/filter — never refetches.
  function applyWallQuery(){
    if (!wallContainer) return;
    let list = latestWishes.slice();

    if (wallQuery.flower){
      list = list.filter(w => w.flowerName === wallQuery.flower);
    }
    const q = wallQuery.search.trim().toLowerCase();
    if (q){
      list = list.filter(w =>
        (w.text || '').toLowerCase().includes(q) ||
        (w.handle || '').toLowerCase().includes(q)
      );
    }

    if (wallQuery.sort === 'terlama'){
      list.reverse(); // list is still in server order (newest first)
    } else if (wallQuery.sort === 'reaksi'){
      list.sort((a, b) => sumReactions(b) - sumReactions(a));
    }
    // 'terbaru' needs no reordering — that's the server's default order.

    const emptyMessage = latestWishes.length
      ? 'Tidak ada harapan yang cocok dengan pencarian/filter ini.'
      : undefined;
    renderWishes(wallContainer, list, emptyMessage);
  }

  function wireWallControls(){
    const searchInput = document.getElementById('wall-search-input');
    const sortSelect = document.getElementById('wall-sort-select');
    const filterSelect = document.getElementById('wall-filter-select');

    if (searchInput && !searchInput.dataset.wallWired){
      searchInput.dataset.wallWired = '1';
      searchInput.addEventListener('input', () => {
        wallQuery.search = searchInput.value;
        applyWallQuery();
      });
    }
    if (sortSelect && !sortSelect.dataset.wallWired){
      sortSelect.dataset.wallWired = '1';
      sortSelect.addEventListener('change', () => {
        wallQuery.sort = sortSelect.value;
        applyWallQuery();
      });
    }
    if (filterSelect && !filterSelect.dataset.wallWired){
      filterSelect.dataset.wallWired = '1';
      filterSelect.addEventListener('change', () => {
        wallQuery.flower = filterSelect.value;
        applyWallQuery();
      });
    }
  }

  function randomHandle(){
    const p = HANDLE_PREFIXES[Math.floor(Math.random() * HANDLE_PREFIXES.length)];
    const f = HANDLE_FLOWERS[Math.floor(Math.random() * HANDLE_FLOWERS.length)];
    return `${p} ${f}`;
  }

  function loadReactedSet(){
    try {
      const raw = sessionStorage.getItem(REACTED_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e){
      return new Set();
    }
  }

  function saveReactedSet(set){
    try {
      sessionStorage.setItem(REACTED_KEY, JSON.stringify([...set]));
    } catch (e){ /* ignore */ }
  }

  // Returns a Promise. Rejects on network/permission errors so the
  // caller (main.js) can show a friendly message instead of the wish
  // silently disappearing.
  function addWish(text, flowerName){
    const trimmed = text.trim().slice(0, WISH_TEXT_MAX);
    return window.db.collection('wishes').add({
      handle: randomHandle(),
      text: trimmed,
      flowerName: flowerName || '',
      reactions: { rasa: 0, peluk: 0, semangat: 0 },
      ts: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  function toggleReaction(wishId, reactionKey, btnEl){
    const reacted = loadReactedSet();
    const flag = wishId + ':' + reactionKey;
    const alreadyReacted = reacted.has(flag);
    const delta = alreadyReacted ? -1 : 1;

    const wishRef = window.db.collection('wishes').doc(wishId);
    wishRef.update({
      [`reactions.${reactionKey}`]: firebase.firestore.FieldValue.increment(delta)
    }).then(() => {
      if (alreadyReacted){
        reacted.delete(flag);
        btnEl.classList.remove('is-active');
      } else {
        reacted.add(flag);
        btnEl.classList.add('is-active');
      }
      saveReactedSet(reacted);
      // The realtime listener will refresh the visible count from the
      // server; toggling the class here just gives instant feedback.
    }).catch(() => { /* offline or blocked by rules — silently skip */ });
  }

  function renderWishes(container, wishes, emptyMessage){
    const reacted = loadReactedSet();
    container.innerHTML = '';

    if (!wishes.length){
      const empty = document.createElement('p');
      empty.className = 'wall-empty';
      empty.textContent = emptyMessage || 'Belum ada harapan yang dituliskan di sini. Harapanmu bisa jadi yang pertama.';
      container.appendChild(empty);
      return;
    }

    wishes.forEach(wish => {
      const card = document.createElement('article');
      card.className = 'sticky-card';

      const handle = document.createElement('p');
      handle.className = 'sticky-handle';
      handle.textContent = wish.handle;
      card.appendChild(handle);

      const text = document.createElement('p');
      text.className = 'sticky-text';
      renderWishText(text, wish.text);
      card.appendChild(text);

      const reactionsRow = document.createElement('div');
      reactionsRow.className = 'sticky-reactions';

      REACTIONS.forEach(r => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'reaction-btn';
        if (reacted.has(wish.id + ':' + r.key)) btn.classList.add('is-active');
        btn.setAttribute('aria-label', r.label);
        btn.title = r.label;
        btn.innerHTML = `<span aria-hidden="true">${r.emoji}</span><span class="reaction-count">${(wish.reactions && wish.reactions[r.key]) || 0}</span>`;
        btn.addEventListener('click', () => toggleReaction(wish.id, r.key, btn));
        reactionsRow.appendChild(btn);
      });

      card.appendChild(reactionsRow);
      container.appendChild(card);
    });
  }

  // Opens (or re-opens) a realtime listener on the wishes collection and
  // keeps the wall in sync while it's visible. Safe to call multiple
  // times — a previous listener is torn down first.
  function render(container){
    wallContainer = container;
    if (unsubscribe){ unsubscribe(); unsubscribe = null; }

    const loading = document.createElement('p');
    loading.className = 'wall-empty';
    loading.textContent = 'Memuat harapan…';
    container.innerHTML = '';
    container.appendChild(loading);

    wireWallControls();

    unsubscribe = window.db.collection('wishes')
      .orderBy('ts', 'desc')
      .limit(200)
      .onSnapshot(snapshot => {
        latestWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        populateFlowerFilter(document.getElementById('wall-filter-select'));
        applyWallQuery();
      }, () => {
        container.innerHTML = '';
        const err = document.createElement('p');
        err.className = 'wall-empty';
        err.textContent = 'Taman harapan lagi ga bisa dimuat. Coba cek koneksimu ya.';
        container.appendChild(err);
      });
  }

  window.WishWall = { addWish, render };

})();

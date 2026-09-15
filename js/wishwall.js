/**
 * "Tembok Harapan" wish wall: stores wishes in localStorage so they persist
 * across play sessions on the same browser, assigns a random anonymous
 * flower-themed handle, and renders a masonry sticky-note board with
 * lightweight reactions.
 */
(function(){

  const STORAGE_KEY = 'rehatBunga.wishes.v1';
  const REACTED_KEY = 'rehatBunga.reacted.v1';

  const HANDLE_PREFIXES = ['Teman Bunga', 'Pencinta', 'Sahabat', 'Penjaga', 'Perawat'];
  const HANDLE_FLOWERS = [
    'Kamomil', 'Dandelion', 'Lavender', 'Matahari', 'Teratai', 'Iris',
    'Magnolia', 'Peoni', 'Aster', 'Hortensia', 'Plum', 'Lily Lembah'
  ];

  const REACTIONS = [
    { key: 'rasa', emoji: '🌸', label: 'Aku merasakannya juga' },
    { key: 'peluk', emoji: '🤍', label: 'Kirim pelukan' },
    { key: 'semangat', emoji: '💡', label: 'Kamu pasti bisa' }
  ];

  function randomHandle(){
    const p = HANDLE_PREFIXES[Math.floor(Math.random() * HANDLE_PREFIXES.length)];
    const f = HANDLE_FLOWERS[Math.floor(Math.random() * HANDLE_FLOWERS.length)];
    return `${p} ${f}`;
  }

  function loadWishes(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e){
      return [];
    }
  }

  function saveWishes(list){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e){ /* storage unavailable, fail silently */ }
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

  function addWish(text, flowerName){
    const list = loadWishes();
    const entry = {
      id: 'w_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      handle: randomHandle(),
      text: text.trim(),
      flowerName: flowerName || '',
      reactions: { rasa: 0, peluk: 0, semangat: 0 },
      ts: Date.now()
    };
    list.unshift(entry);
    saveWishes(list);
    return entry;
  }

  function toggleReaction(wishId, reactionKey, btnEl){
    const list = loadWishes();
    const wish = list.find(w => w.id === wishId);
    if (!wish) return;

    const reacted = loadReactedSet();
    const flag = wishId + ':' + reactionKey;
    const alreadyReacted = reacted.has(flag);

    if (alreadyReacted){
      wish.reactions[reactionKey] = Math.max(0, (wish.reactions[reactionKey] || 0) - 1);
      reacted.delete(flag);
      btnEl.classList.remove('is-active');
    } else {
      wish.reactions[reactionKey] = (wish.reactions[reactionKey] || 0) + 1;
      reacted.add(flag);
      btnEl.classList.add('is-active');
    }

    saveWishes(list);
    saveReactedSet(reacted);
    const countEl = btnEl.querySelector('.reaction-count');
    if (countEl) countEl.textContent = wish.reactions[reactionKey];
  }

  function render(container){
    const wishes = loadWishes();
    const reacted = loadReactedSet();
    container.innerHTML = '';

    if (!wishes.length){
      const empty = document.createElement('p');
      empty.className = 'wall-empty';
      empty.textContent = 'Belum ada harapan yang dituliskan di sini. Harapanmu bisa jadi yang pertama.';
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
      text.textContent = wish.text;
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
        btn.innerHTML = `<span aria-hidden="true">${r.emoji}</span><span class="reaction-count">${wish.reactions[r.key] || 0}</span>`;
        btn.addEventListener('click', () => toggleReaction(wish.id, r.key, btn));
        reactionsRow.appendChild(btn);
      });

      card.appendChild(reactionsRow);
      container.appendChild(card);
    });
  }

  window.WishWall = { addWish, render };

})();

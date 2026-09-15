# Ruang Rehat Bunga

Game Block Blast 8x8 bertema pastel: bersihkan baris/kolom untuk perlahan
menyingkap gambar bunga di belakang papan. Saat progres 100%, muncul kartu
bunga (flip) berisi makna dan pesan, lalu pemain bisa menuliskan harapan dan
melihatnya di "Tembok Harapan".

## Cara menjalankan

Browser modern memblokir `fetch()` file lokal saat halaman dibuka langsung
lewat `file://`. Supaya `src/data/flowers.json` bisa dimuat dengan normal,
jalankan lewat server lokal sederhana:

```bash
cd rehat-bunga
python3 -m http.server 8000
# lalu buka http://localhost:8000 di browser
```

Kalau tetap dibuka langsung dengan cara klik dua kali `index.html`, game ini
tetap berjalan normal karena ada salinan data bunga di `js/flowers-data.js`
sebagai fallback otomatis.

## Struktur folder

```
index.html
css/style.css          -> semua styling (token warna pastel, board, modal, wall)
js/shapes.js            -> definisi bentuk block (1-5 kotak) + palet warna
js/board.js              -> logika papan, drag-and-drop, clear baris/kolom, progres
js/wishwall.js           -> penyimpanan & render Tembok Harapan (localStorage)
js/flowers-data.js        -> salinan cadangan data bunga (untuk mode file://)
js/main.js                -> penghubung semua bagian + alur layar
src/data/flowers.json      -> 12 data bunga: nama, makna, path gambar, pesan
assets/flowers/*.jpg        -> gambar bunga (dikompres dari upload)
```

## Kustomisasi cepat

- **Jumlah baris yang harus dibersihkan sampai 100%**: ubah konstanta
  `MAX_CLEARS_FOR_FULL_REVEAL` di `js/board.js`.
- **Menambah/mengubah bunga**: edit `src/data/flowers.json` DAN
  `js/flowers-data.js` (harus sama persis), lalu taruh gambarnya di
  `assets/flowers/`.
- **Warna tema**: semua ada di bagian `:root` pada `css/style.css`.
- **Wish tersimpan di mana**: `localStorage` browser (`rehatBunga.wishes.v1`),
  jadi bertahan walau tab ditutup, tapi hanya terlihat di browser/perangkat
  yang sama (belum ada backend/server bersama).

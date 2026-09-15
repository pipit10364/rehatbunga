# Ruang Rehat Bunga

Game Block Blast 8x8 bertema pastel: bersihkan baris/kolom untuk perlahan
menyingkap gambar bunga di belakang papan. Saat progres 100%, muncul kartu
bunga (flip) berisi makna dan pesan, lalu pemain bisa menuliskan harapan dan
melihatnya di "Taman Harapan".

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
js/wishwall.js           -> render Taman Harapan dari Firestore (realtime)
js/firebase-config.js     -> config Firebase (isi dengan config project kamu)
js/flowers-data.js        -> salinan cadangan data bunga (untuk mode file://)
js/main.js                -> penghubung semua bagian + alur layar
src/data/flowers.json      -> 12 data bunga: nama, makna, path gambar, pesan
assets/flowers/*.jpg        -> gambar bunga (dikompres dari upload)
firestore.rules             -> security rules, paste ke Firebase Console > Firestore > Rules
```

## Setup Firebase (wajib sebelum wish wall berfungsi)

1. Buat project di https://console.firebase.google.com, aktifkan
   Firestore Database (mode production).
2. Daftarkan web app di project settings, copy `firebaseConfig`-nya.
3. Paste config itu ke `js/firebase-config.js`, gantikan nilai
   `GANTI_DENGAN_...`.
4. Buka Firestore > Rules, paste isi `firestore.rules` dari repo ini,
   lalu Publish.

Tanpa langkah ini, wall akan gagal dimuat (network error) karena
`js/firebase-config.js` masih pakai nilai placeholder.

## Kustomisasi cepat

- **Jumlah baris yang harus dibersihkan sampai 100%**: ubah konstanta
  `MAX_CLEARS_FOR_FULL_REVEAL` di `js/board.js`.
- **Menambah/mengubah bunga**: edit `src/data/flowers.json` DAN
  `js/flowers-data.js` (harus sama persis), lalu taruh gambarnya di
  `assets/flowers/`.
- **Warna tema**: semua ada di bagian `:root` pada `css/style.css`.
- **Wish tersimpan di mana**: koleksi `wishes` di Firestore, jadi semua
  orang yang main lihat wall yang sama secara realtime. "Reaction mana
  yang udah aku klik" masih disimpan lokal per sesi browser
  (`sessionStorage`), jadi ga ada login, tapi itu cuma buat UI toggle
  aktif/nonaktif tombolnya, bukan sumber data reaction-nya.

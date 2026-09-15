/**
 * Inline fallback copy of src/data/flowers.json.
 * Browsers block fetch() of local JSON files when a page is opened directly
 * via file:// (no server). This lets the game run either way: it tries to
 * fetch the JSON first, and falls back to this array if that fails.
 * Keep this in sync with src/data/flowers.json.
 */
window.FLOWERS_FALLBACK = [
  {
    "id": "iris",
    "name": "Iris",
    "meaning": "Harapan dan kepercayaan yang tumbuh diam-diam",
    "image": "assets/flowers/iris.jpg",
    "message": "Aku mekar dengan warna ungu yang dalam, bukan supaya dilihat semua orang, tapi supaya kamu tahu: rasa percaya itu boleh tumbuh pelan-pelan. Kamu tidak perlu buru-buru yakin pada segalanya.\n\nCukup percaya sedikit hari ini, sedikit lagi besok. Aku akan menunggu di sini setiap kali kamu butuh diingatkan bahwa harapan tidak harus besar untuk berarti."
  },
  {
    "id": "magnolia",
    "name": "Magnolia",
    "meaning": "Keanggunan yang bertahan meski dunia berubah",
    "image": "assets/flowers/magnolia.jpg",
    "message": "Aku sudah ada jauh sebelum banyak bunga lain mengenal caranya mekar, dan aku masih di sini, tenang, utuh. Kamu juga sudah melewati lebih banyak hal daripada yang kamu sadari.\n\nTidak apa-apa jika hari ini terasa berat—kamu tidak harus terlihat sempurna untuk tetap dianggap kuat. Berdirilah selembut mungkin, itu sudah cukup."
  },
  {
    "id": "lily-of-the-valley",
    "name": "Lily of the Valley",
    "meaning": "Kebahagiaan kecil yang kembali lagi",
    "image": "assets/flowers/lily-of-the-valley.jpg",
    "message": "Aku kecil, menunduk, hampir tidak terlihat di antara daun-daun besar. Tapi aku selalu kembali setiap musim, membawa aroma yang tenang.\n\nKebahagiaanmu boleh juga sekecil itu—secangkir teh hangat, satu tarikan napas lega, satu pesan dari orang yang kamu sayang. Hal-hal kecil itu nyata, dan mereka akan terus kembali padamu."
  },
  {
    "id": "peony",
    "name": "Peony",
    "meaning": "Keberanian yang mekar penuh",
    "image": "assets/flowers/peony.jpg",
    "message": "Aku mekar dengan lapisan demi lapisan kelopak, seakan tidak takut mengambil ruang. Kamu juga berhak mengambil ruang untuk merasa lelah, untuk beristirahat, untuk berkata 'aku belum baik-baik saja' tanpa merasa bersalah.\n\nKeberanian bukan berarti selalu kuat—kadang keberanian adalah mengakui bahwa hari ini cukup berat, dan tetap memilih untuk bertahan."
  },
  {
    "id": "daisy",
    "name": "Daisy",
    "meaning": "Kepolosan dan awal yang baru",
    "image": "assets/flowers/daisy.jpg",
    "message": "Aku sederhana—putih, kuning, tidak neko-neko. Tapi aku selalu percaya bahwa setiap pagi adalah kesempatan baru, walau kemarin berantakan.\n\nKamu tidak perlu menyelesaikan semua masalah hari ini. Cukup mulai dari satu langkah kecil, sama seperti aku yang mekar satu kelopak demi satu kelopak setiap pagi."
  },
  {
    "id": "hydrangea",
    "name": "Hydrangea",
    "meaning": "Rasa syukur yang tulus dan pengertian",
    "image": "assets/flowers/hydrangea.jpg",
    "message": "Warnaku bisa berubah tergantung tanah tempatku tumbuh—kadang pink, kadang biru, kadang ungu. Aku belajar bahwa berubah bukan berarti tidak konsisten, itu berarti aku menyesuaikan diri dengan apa yang aku alami.\n\nKamu juga boleh berubah, boleh punya hari baik dan hari buruk. Aku tetap berterima kasih kamu masih di sini, mencoba."
  },
  {
    "id": "lotus",
    "name": "Lotus",
    "meaning": "Ketenangan yang tumbuh dari lumpur",
    "image": "assets/flowers/lotus.jpg",
    "message": "Akarku ada di lumpur yang keruh, tapi aku tetap mekar bersih di atas air, menghadap matahari. Aku tidak menyangkal dari mana aku berasal—justru dari sanalah aku belajar tenang.\n\nApa pun yang sedang kamu lalui sekarang, sesulit apa pun keadaannya, kamu tetap bisa menemukan permukaan tenang milikmu sendiri. Pelan-pelan saja."
  },
  {
    "id": "lavender",
    "name": "Lavender",
    "meaning": "Ketenangan dan pemulihan",
    "image": "assets/flowers/lavender.jpg",
    "message": "Aromaku sering dipakai orang untuk menenangkan diri sebelum tidur, saat pikiran terlalu ramai. Aku ingin kamu tahu, kamu boleh berhenti sejenak dari segala kebisingan itu. Tarik napas panjang, hembuskan pelan.\n\nKamu tidak harus menyelesaikan semuanya malam ini. Istirahat juga bagian dari usaha, bukan kekalahan."
  },
  {
    "id": "plum-blossom",
    "name": "Bunga Plum",
    "meaning": "Ketahanan yang mekar di tengah dingin",
    "image": "assets/flowers/plum-blossom.jpg",
    "message": "Aku mekar lebih dulu dari bunga lain, bahkan saat udara masih dingin dan musim semi belum benar-benar datang. Bukan karena aku tidak takut, tapi karena aku percaya sesuatu yang baik sedang menuju kesana.\n\nKalau sekarang terasa seperti musim dingin bagimu, izinkan aku mengingatkan: kamu sedang menuju sesuatu, walau belum terlihat."
  },
  {
    "id": "chamomile",
    "name": "Chamomile",
    "meaning": "Kedamaian dalam kelembutan",
    "image": "assets/flowers/chamomile.jpg",
    "message": "Orang sering menyeduhku jadi teh hangat saat mereka butuh tenang. Aku suka peran itu—menemani, bukan menyelesaikan semuanya sekaligus. Kamu tidak perlu jadi kuat sepanjang waktu.\n\nBoleh lembut pada dirimu sendiri malam ini. Aku akan tetap di sini, sesederhana secangkir teh, menemani sampai hatimu sedikit lebih ringan."
  },
  {
    "id": "dandelion",
    "name": "Dandelion",
    "meaning": "Harapan yang diterbangkan angin",
    "image": "assets/flowers/dandelion.jpg",
    "message": "Aku tumbuh di mana saja—retakan aspal, pinggir jalan, tempat yang orang kira tidak mungkin ada kehidupan. Lalu saat waktunya tiba, aku melepas setiap benihku ke angin, membiarkan harapan pergi jauh tanpa tahu ke mana ia akan tumbuh.\n\nTitipkan harapanmu padaku. Aku akan membawanya, seringan mungkin, sejauh yang ia butuhkan untuk sampai."
  },
  {
    "id": "sunflower",
    "name": "Bunga Matahari",
    "meaning": "Optimisme yang selalu menghadap cahaya",
    "image": "assets/flowers/sunflower.jpg",
    "message": "Aku selalu mengarahkan wajahku ke arah matahari, bahkan ketika langit sedang mendung. Aku tidak selalu tahu kapan cahaya itu akan muncul lagi, tapi aku tetap menghadap ke sana, menunggu dengan sabar.\n\nKamu boleh melakukan hal yang sama—tetap menghadap ke arah harapan, walau hari ini terasa mendung. Cahayanya akan datang lagi."
  }
];

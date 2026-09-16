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
    "meaning": "Suara hati kecil yang menuntun harapan untuk tumbuh",
    "image": "assets/flowers/iris.jpg",
    "message": "Namaku diambil dari dewi pelangi, pembawa pesan harapan. Aku mekar dengan warna ungu yang dalam, bukan supaya dilihat semua orang, tapi supaya kamu tahu: harapan tidak harus datang dengan suara besar untuk bisa dipercaya.\n\nDi dalam hatimu ada suara kecil yang terus berbisik, ‘besok kita coba lagi.’ Kamu tidak perlu buru-buru yakin pada segalanya, cukup percaya sedikit hari ini, sedikit lagi besok. Aku akan menunggu di sini setiap kali kamu butuh diingatkan bahwa langkah kecil yang gemetar itu tetap sebuah keberanian."
  },
  {
    "id": "magnolia",
    "name": "Magnolia",
    "meaning": "Keanggunan yang bertahan meski dunia berubah",
    "image": "assets/flowers/magnolia.jpg",
    "message": "Aku sudah ada di bumi ini sejak jutaan tahun lalu, bertahan melewati berbagai perubahan zaman dengan tenang. Kamu juga sudah melewati lebih banyak hal daripada yang kamu sadari, dan kamu masih di sini, utuh.\n\nKetika badai datang menerpa, kamu mungkin bergoyang, tapi akarmu kuat. Tidak apa-apa jika hari ini terasa berat, kamu tidak harus terlihat sempurna untuk tetap dianggap kuat. Berdirilah selembut mungkin, itu sudah cukup."
  },
  {
    "id": "lily-of-the-valley",
    "name": "Lily of the Valley",
    "meaning": "Kebahagiaan kecil yang selalu kembali",
    "image": "assets/flowers/lily-of-the-valley.jpg",
    "message": "Aku kecil, menunduk, berbentuk seperti lonceng-lonceng mungil yang berbisik pelan: kebahagiaan pasti akan datang kembali. Hampir tidak terlihat di antara daun-daun besar, tapi aku selalu kembali setiap musim, membawa aroma yang tenang.\n\nKetika kamu merasa berada di titik terendah, ingatlah bahwa roda hidup selalu berputar. Kebahagiaanmu boleh sekecil secangkir teh hangat, satu tarikan napas lega, satu pesan dari orang yang kamu sayang, karena hal-hal kecil itu nyata, dan akan terus kembali padamu."
  },
  {
    "id": "peony",
    "name": "Peony",
    "meaning": "Kelembutan pada diri sendiri di tengah rasa lelah",
    "image": "assets/flowers/peony.jpg",
    "message": "Kelopakku berlapis-lapis dan mekar dengan lembut, seakan tidak takut mengambil ruang. Kamu juga berhak mengambil ruang untuk merasa lelah, untuk beristirahat, untuk berkata ‘aku belum baik-baik saja’ tanpa merasa bersalah.\n\nKamu boleh berhenti bersikap terlalu keras pada dirimu sendiri, kamu sudah melakukan yang terbaik dengan energi yang kamu punya hari ini. Keberanian bukan berarti selalu kuat, kadang keberanian adalah mengakui bahwa hari ini cukup berat, dan tetap memilih untuk bertahan."
  },
  {
    "id": "daisy",
    "name": "Daisy",
    "meaning": "Kesederhanaan dan awal yang baru setiap pagi",
    "image": "assets/flowers/daisy.jpg",
    "message": "Aku sederhana: putih, kuning, tidak neko-neko. Tapi aku selalu percaya setiap pagi adalah kesempatan baru, walau kemarin berantakan.\n\nKamu tidak perlu melakukan hal besar atau luar biasa setiap hari untuk dianggap berharga. Setiap kali kamu bangun dan memutuskan untuk mencoba lagi, sekecil apa pun langkahnya, itu sudah kemenangan, sama seperti aku yang mekar satu kelopak demi satu kelopak setiap pagi."
  },
  {
    "id": "hydrangea",
    "name": "Hydrangea",
    "meaning": "Penerimaan atas setiap emosi yang berubah-ubah",
    "image": "assets/flowers/hydrangea.jpg",
    "message": "Warnaku bisa berubah tergantung tanah tempatku tumbuh, kadang pink, kadang biru, kadang ungu, dan itu mengajarkanku bahwa tidak apa-apa untuk merasa berubah-ubah. Berubah bukan berarti tidak konsisten, itu berarti aku menyesuaikan diri dengan apa yang aku alami.\n\nKamu boleh merasa sedih hari ini, ragu besok, kecewa lusa. Setiap emosi yang kamu rasakan itu valid, bagian dari proses pemulihanmu, dan aku tetap berterima kasih kamu masih di sini, mencoba."
  },
  {
    "id": "lotus",
    "name": "Lotus",
    "meaning": "Keindahan yang tumbuh dari tempat paling keruh",
    "image": "assets/flowers/lotus.jpg",
    "message": "Akarku ada di lumpur yang keruh, tapi aku tetap mekar bersih di atas air, menghadap matahari. Aku tidak menyangkal dari mana aku berasal, tapi justru dari sanalah aku belajar tenang.\n\nLingkungan, kegagalan, atau masa lalu yang pahit tidak menentukan siapa dirimu. Bahkan di tempat yang paling gelap sekalipun, kamu selalu punya kemampuan untuk bertumbuh menjadi sesuatu yang indah. Pelan-pelan saja."
  },
  {
    "id": "lavender",
    "name": "Lavender",
    "meaning": "Ketenangan di tengah kebisingan dunia",
    "image": "assets/flowers/lavender.jpg",
    "message": "Dunia di luar sana sering bising dan kacau, dan aromaku biasa dipakai orang untuk menenangkan diri sebelum tidur, saat pikiran terlalu ramai. Kamu boleh berhenti sejenak dari segala kebisingan itu, letakkan dulu beban yang kamu pikul seharian ini. Tarik napas panjang, hembuskan pelan.\n\nKamu tidak harus menyelesaikan atau memikirkan semuanya sekarang. Istirahat juga bagian dari usaha, bukan kekalahan. Hari esok punya jalannya sendiri, dan tempat ini aman untukmu sekadar menjadi dirimu yang lelah."
  },
  {
    "id": "plum-blossom",
    "name": "Bunga Plum",
    "meaning": "Ketabahan yang mekar di tengah musim dingin",
    "image": "assets/flowers/plum-blossom.jpg",
    "message": "Aku mekar lebih dulu dari bunga lain, bahkan saat udara masih dingin dan musim semi belum benar-benar datang, ketika bunga lain memilih untuk bersembunyi. Bukan karena aku tidak takut, tapi karena aku percaya sesuatu yang baik sedang menuju kepadaku.\n\nMasa-masa sulit ini tidak akan bertahan selamanya, dan ketabahanmu sedang membentukmu jadi pribadi yang lebih indah. Kalau sekarang terasa seperti musim dingin bagimu, izinkan aku mengingatkan: musim bahagiamu sedang dipersiapkan, sesuatu yang baik juga sedang menuju kepadamu, walau belum terlihat."
  },
  {
    "id": "chamomile",
    "name": "Chamomile",
    "meaning": "Ketangguhan lembut yang mekar meski terinjak",
    "image": "assets/flowers/chamomile.jpg",
    "message": "Orang sering menyeduhku jadi teh hangat saat mereka butuh tenang, dan aku justru mekar paling harum ketika diinjak dan dihimpit keadaan. Aku suka peran itu: menemani, bukan menyelesaikan semuanya sekaligus.\n\nKamu juga sama. Jangan ragukan ketangguhanmu sendiri hanya karena hari-hari belakangan ini terasa berat, kamu tidak patah, kamu hanya sedang belajar mekar di tanah yang agak keras. Boleh lembut pada dirimu sendiri hari ini, aku akan tetap di sini, sesederhana secangkir teh, menemani sampai hatimu sedikit lebih ringan."
  },
  {
    "id": "dandelion",
    "name": "Dandelion",
    "meaning": "Keberanian untuk melepaskan dan tumbuh lagi",
    "image": "assets/flowers/dandelion.jpg",
    "message": "Aku tumbuh di mana saja, dari retakan aspal sampai pinggir jalan, tempat yang orang kira tidak mungkin ada kehidupan. Tidak apa-apa kalau saat ini kamu merasa berantakan dan terbawa angin ke mana-mana, terkadang kita harus rela melepaskan hal-hal yang tidak bisa kita kontrol agar bisa menemukan tempat baru untuk tumbuh.\n\nSaat waktunya tiba, aku melepas setiap benihku ke angin, bukan sebagai bentuk kehancuran, melainkan awal dari keberanian baru. Titipkan harapanmu padaku, aku akan membawanya seringan mungkin, ke mana pun angin hidup membawamu pergi, kamu akan menemukan tanah yang ramah untuk berakar lagi."
  },
  {
    "id": "sunflower",
    "name": "Bunga Matahari",
    "meaning": "Harapan yang tak pernah benar-benar padam",
    "image": "assets/flowers/sunflower.jpg",
    "message": "Aku selalu mengarahkan wajahku ke arah matahari, bahkan ketika langit sedang mendung. Matahari itu tidak pernah benar-benar hilang, ia hanya sedang tertutup awan sebentar, dan aku tetap menghadap ke sana, menunggu dengan sabar.\n\nKamu tidak harus selalu ceria setiap hari. Cukup miringkan kepalamu sedikit ke arah cahaya kecil yang ada, dan ingatlah bahwa kehadiranmu di dunia ini sudah cukup untuk menghangatkan orang-orang di sekitarmu. Cahayanya akan datang lagi."
  }
];

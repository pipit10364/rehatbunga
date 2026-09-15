/**
 * Config project Firebase "ruangbunga". Nilai-nilai ini BUKAN rahasia
 * — aman ditaruh di kode frontend yang publik. Keamanan data diatur
 * lewat Firestore security rules (lihat firestore.rules), bukan
 * dengan menyembunyikan config ini.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDN8d1mAB7XpE_dnFqkUcloaZkRQffGDO0",
  authDomain: "ruangbunga.firebaseapp.com",
  projectId: "ruangbunga",
  storageBucket: "ruangbunga.firebasestorage.app",
  messagingSenderId: "1089260300402",
  appId: "1:1089260300402:web:0512a47313dee90ec4faeb"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();


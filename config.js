/* ====== PENGATURAN ALAMAT SERVER (boleh diisi di sini ATAU di index.html) ======
   Ganti tulisan di dalam tanda kutip dengan alamat web app Apps Script Anda
   (Apps Script > Deploy > Kelola deployment > salin "URL aplikasi web", berakhiran /exec).
   Contoh: https://script.google.com/macros/s/AKfycb.../exec
   Kalau alamat di file ini valid, ia dipakai; kalau belum diisi, yang di index.html yang dipakai. */
var ELS_URL_CONFIG = 'https://script.google.com/macros/s/AKfycbyZY2VSSV2CpH9xSmONjEPlxFVhhsC3n2ELxi-4bGTAZDNwK5aJ6BSOXgA2fZd3euDF/exec';
if(/^https:\/\/script\.google\.com\/macros\/s\/[^\/]+\/exec$/.test(ELS_URL_CONFIG)) window.ELS_API_URL = ELS_URL_CONFIG;

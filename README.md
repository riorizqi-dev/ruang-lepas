# RuangLepas - Katarsis & Curahan Hati Anonim

> Kanal digital untuk melepas beban pikiran, amarah, dan rasa lelah secara 100% anonim tanpa sensor dan tanpa penghakiman.

🌐 **Website Live:** [https://ruanglepas.ryuuka.web.id](https://ruanglepas.ryuuka.web.id)  
🔗 **Domain Alternatif:** [https://ryuuka.web.id](https://ryuuka.web.id) | [https://ruang-lepas.vercel.app](https://ruang-lepas.vercel.app)

---

## Tentang RuangLepas

**RuangLepas** hadir sebagai tempat aman untuk menumpahkan uneg-uneg dan keluh kesah yang selama ini tertahan di dada. Terinspirasi dari kebutuhan ruang katarsis digital, RuangLepas dibangun dengan filosofi **Anti-Slop**:
- **0% Emoji Unicode**: 100% ikon, lencana kategori, dan tombol reaksi menggunakan vektor SVG kustom yang tajam dan bermakna semantik.
- **Apple Liquid Glass**: Mengadopsi estetika permukaan kaca refraktif dengan pembatas *specular highlight*, *backdrop blur* halus, dan palet nocturnal slate/sky blue.
- **Tanpa Sensor & Bebas Jejak**: Tidak memerlukan login akun, tidak ada pelacak identitas pribadi, dan data tersimpan lokal.
- **Dukungan Server via QRIS**: Dilengkapi modal donasi QRIS terintegrasi (Ryuuka Store) dengan fitur unduh poster QRIS, salin nominal donasi, dan konfirmasi WhatsApp.

---

## Fitur Utama

- **Tulis Uneg-Uneg**: Form penulisan uneg-uneg dengan nama samaran fleksibel, batas karakter (0/350), dan validasi instan.
- **Kategori Nuansa Perasaan (SVG Ikon)**:
  - **Murka**: Amarah terhadap ketidakadilan atau kekecewaan.
  - **Lelah**: Kondisi fisik dan mental yang terkuras habis.
  - **Resah**: Kecemasan masa depan dan overthinking larut malam.
  - **Sesak**: Kesedihan mendalam yang tertahan.
  - **Lega**: Secercah harapan dan ketenangan setelah melewati badai.
- **Reaksi Interaktif**: Tombol reaksi "Relate" dan "Kirim Dukungan Moril" dengan penghitung interaktif yang tersinkronisasi ke `localStorage`.
- **Pencarian & Penyaringan**: Cari curhatan berdasarkan kata kunci atau saring berdasarkan kategori perasaan dan urutan terpopuler.
- **Modal Donasi QRIS Ryuuka Store**:
  - Tampilan poster QRIS resmi beresolusi tinggi.
  - Tombol **Unduh Gambar QRIS** untuk memudahkan pemindaian di aplikasi e-wallet / m-Banking.
  - Tombol **Salin Nomor WhatsApp Admin** (`0858-1038-3881`) untuk konfirmasi bantuan.
  - Pilihan preset nominal donasi (Rp 5.000 s/d Rp 50.000) dan tombol **Salin Nominal**.
- **Aksesibilitas Penuh (WCAG AA)**: Kontras warna teruji, navigasi keyboard (tutup modal via tombol `Escape`), dan tap target minimal 44px ramah perangkat seluler.

---

## Teknologi yang Digunakan

- **Frontend Library:** React 19
- **Bahasa:** TypeScript
- **Bundler & Dev Server:** Vite 6
- **Styling:** Tailwind CSS + Custom Apple Liquid Glass CSS Variables
- **Ikonografi:** Scalable Vector Graphics (SVG murni, zero emoji)
- **Deployment:** Vercel Production + Custom DNS (IDwebhost)

---

## Cara Menjalankan Secara Lokal

Pastikan Node.js (v18+) telah terpasang di komputermu:

```bash
# Masuk ke direktori proyek
cd ruang-lepas

# Pasang dependensi
npm install

# Jalankan server development
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000).

### Build untuk Produksi:

```bash
npm run build
npm run preview
```

---

## Prinsip & Etika Komunitas

1. Dilarang menyebarkan data pribadi (*doxxing*) pihak lain.
2. Dilarang ujaran kebencian berbasis SARA atau ancaman kekerasan fisik.
3. Gunakan ruang ini untuk saling menguatkan, mendengar, dan melepaskan beban hidup bersama.

---

## Lisensi

Didistribusikan di bawah lisensi MIT. Silakan gunakan dan kembangkan secara bebas untuk kebaikan bersama.

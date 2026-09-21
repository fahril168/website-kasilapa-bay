# Kasilapa Bay — Official Resort Website & CMS

Website resmi penginapan tepi pantai **Kasilapa Bay** di Pulau Tomia, Wakatobi, Sulawesi Tenggara. Dilengkapi dengan antarmuka bilingual (Bahasa Indonesia & English) dan dashboard Content Management System (CMS) terintegrasi untuk mengelola kamar, destinasi wisata, galeri, fasilitas, ulasan tamu, analitik pengunjung, dan informasi kontak.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: [Next.js 16](https://nextjs.org/) (Static Site Generation / SSG) dengan React 19, TypeScript, dan TailwindCSS v4.
- **Styling & UI**: TailwindCSS, Framer Motion (animasi halus), Lucide Icons, Embla Carousel.
- **Backend**: PHP 8.x Native REST API dengan PDO Prepared Statements (Aman dari SQL Injection).
- **Database**: MySQL / MariaDB (11 tabel terstruktur).
- **Hosting Target**: Hostinger Shared / Cloud Hosting (Apache/Nginx dengan dukungan PHP & MySQL).

---

## 🚀 Menjalankan Project di Komputer Lokal

### 1. Prasyarat
- Node.js versi 18 atau lebih baru.
- XAMPP / Laragon (Apache & MySQL aktif di port 3306).
- Database MySQL lokal bernama `kasilapa_db`.

### 2. Setup Database Lokal
1. Buka phpMyAdmin lokal (`http://localhost/phpmyadmin`).
2. Buat database baru dengan nama `kasilapa_db`.
3. Import file database skema:
   ```
   scripts/db_schema.sql
   ```

### 3. Instalasi & Menjalankan Aplikasi
Buka 2 jendela terminal:

**Terminal 1 (Backend API PHP):**
```bash
npm run php
```
*(Menjalankan server backend PHP di `http://localhost:8000`)*

**Terminal 2 (Frontend Next.js):**
```bash
npm run dev
```
*(Membuka website di `http://localhost:3000`)*

---

## 🔐 Akun Akses Admin Dashboard

- **URL Dashboard**: `http://localhost:3000/admin` (Lokal) atau `https://domainanda.com/admin` (Produksi)
- **Username Default**: `admin`
- **Password Default**: `admin123`
- **Email**: `admin@kasilapabay.com`

*Catatan: Ganti password segera setelah deploy produksi melalui menu dashboard admin.*

---

## 📦 Panduan Deploy ke Hostinger

Untuk instruksi lengkap step-by-step deploy ke Hostinger, silakan baca panduan resmi:
👉 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

Untuk membuat paket deploy secara instan:
```bash
npm run package
```
Perintah di atas akan otomatis meng-compile kode dan menghasilkan arsip **`kasilapa-hostinger-deploy.zip`** yang siap langsung di-upload ke folder `public_html` di Hostinger.

---

## 📁 Struktur Direktori Utama

```
kasilapa/
├── app/                  # Rute halaman Next.js App Router (Bilingual [lang])
├── components/           # Komponen UI, layout, navbar, footer, & section
├── lib/                  # Utilitas, hook sinkronisasi, dan kamus i18n
├── public/               # Aset statis publik
│   ├── .htaccess         # Konfigurasi rewrite Apache & header keamanan
│   ├── api/              # Endpoint REST API PHP (koneksi MySQL & auth)
│   └── img/              # Foto kamar (34 foto), destinasi, & logo WebP
├── scripts/              # Skrip pendukung
│   ├── db_schema.sql     # Skema master database MySQL (wajib di-import)
│   ├── package-deploy.js # Skrip otomatisasi build & zip Hostinger
│   └── migrations/       # Riwayat skrip migrasi database
├── DEPLOYMENT_GUIDE.md   # Panduan deploy resmi ke Hostinger
└── package.json          # Manajemen dependensi project
```

---

© 2026 Kasilapa Bay Hotel. All rights reserved.
Tomia Island, Wakatobi, Southeast Sulawesi, Indonesia.

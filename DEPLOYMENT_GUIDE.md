# Panduan Lengkap Deploy Kasilapa Bay ke Hostinger

Dokumen ini berisi panduan langkah-demi-langkah untuk melakukan deploy website **Kasilapa Bay** ke hosting Hostinger (cPanel / hPanel) secara mudah, aman, dan siap produksi.

---

## 1. Ringkasan Arsitektur Sistem

- **Frontend**: Next.js (Static Site Generation / SSG) menghasilkan file HTML, CSS, dan JavaScript statis di folder `out/`.
- **Backend API**: PHP 8.x Native REST API (`public/api/*.php`), berjalan langsung di server Apache / Nginx Hostinger.
- **Database**: MySQL / MariaDB dengan proteksi PDO Prepared Statements (mencegah SQL Injection).
- **Web Server Routing**: Apache mod_rewrite via `.htaccess` (mendukung routing multibahasa `/id`, `/en`, dan `/admin`).

---

## 2. Akun & Kredensial Default

Setelah database di-import, berikut adalah kredensial default untuk masuk ke dashboard admin:

| Keterangan | Nilai Default |
| :--- | :--- |
| **URL Dashboard Admin** | `https://domainanda.com/admin` |
| **Username** | `admin` |
| **Password** | `admin123` |
| **Email** | `admin@kasilapahotel.com` |

> [!IMPORTANT]
> Segera ganti password setelah berhasil login pertama kali melalui menu **"Ganti Password"** di dashboard admin demi keamanan akun Anda.

---

## 3. Langkah-Langkah Deploy ke Hostinger

### Langkah 1: Buat Paket Deploy Otomatis
Di komputer lokal Anda, buka terminal project dan jalankan perintah:
```bash
npm run package
```
Perintah ini akan secara otomatis:
1. Mem-build website Next.js ke mode produksi.
2. Memverifikasi kelengkapan file `.htaccess` dan folder `api/`.
3. Menghasilkan file **`kasilapa-hostinger-deploy.zip`** di folder utama project.

---

### Langkah 2: Buat Database MySQL di Hostinger
1. Masuk ke **Hostinger hPanel** &rarr; menu **Databases** &rarr; **MySQL Databases**.
2. Buat database baru, misalnya:
   - **Nama Database**: `u552286068_kasilapa`
   - **Username**: `u552286068_admin`
   - **Password**: Masukkan password yang kuat (misal: `Riel2323` atau buat baru).
3. Catat ketiga informasi di atas.

---

### Langkah 3: Import Skema Database (`db_schema.sql`)
1. Di halaman **MySQL Databases** Hostinger, klik tombol **Enter phpMyAdmin** pada database yang baru dibuat.
2. Pilih tab **Import** di bagian atas.
3. Klik **Choose File**, lalu pilih file:
   ```
   scripts/db_schema.sql
   ```
4. Gulir ke bawah dan klik tombol **Go / Import**.
5. Seluruh tabel (11 tabel) beserta data awal resort, kamar, destinasi, ulasan, kontak, dan akun admin akan terbuat secara otomatis.

---

### Langkah 4: Upload File Website ke `public_html`
1. Di hPanel Hostinger, buka menu **File Manager** &rarr; masuk ke direktori **`public_html`**.
2. Jika ada file default seperti `default.php`, hapus file tersebut terlebih dahulu.
3. Klik tombol **Upload** &rarr; pilih file **`kasilapa-hostinger-deploy.zip`**.
4. Setelah proses upload selesai (100%), klik kanan file `kasilapa-hostinger-deploy.zip` &rarr; pilih **Extract**.
5. Pilih tujuan ekstraksi langsung di folder **`public_html`**.
6. Pastikan file `.htaccess`, `index.html`, `admin.html`, serta folder `api/`, `img/`, dan `_next/` berada tepat di dalam `public_html`.
7. Anda dapat menghapus file `kasilapa-hostinger-deploy.zip` setelah ekstraksi selesai.

---

### Langkah 5: Sesuaikan Kredensial Database (Jika Berbeda)
Jika kredensial database Anda berbeda dengan default di `config.php`:
1. Masuk ke folder **`public_html/api/`** di File Manager.
2. Temukan file **`db_config.example.php`** lalu ubah namanya (Rename) menjadi **`db_config.php`**.
3. Buka file `db_config.php` dan sesuaikan nilainya:
   ```php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'username_mysql_anda');
   define('DB_PASS', 'password_mysql_anda');
   define('DB_NAME', 'nama_database_anda');
   ```
4. Simpan file. Sistem API akan otomatis menggunakan kredensial tersebut.

---

## 4. Checklist Verifikasi Pasca-Deploy

Setelah selesai deploy, silakan lakukan pengecekan berikut di browser:

- [ ] Buka `https://domainanda.com` &rarr; halaman Beranda tampil dengan benar.
- [ ] Buka `https://domainanda.com/id/akomodasi` dan `/id/destinasi` &rarr; halaman sub-rute termuat tanpa error 404.
- [ ] Buka `https://domainanda.com/id/kontak` &rarr; kontak WhatsApp, username Instagram, dan peta tampil normal.
- [ ] Buka `https://domainanda.com/admin` &rarr; halaman login admin tampil.
- [ ] Login menggunakan akun default (`admin` / `admin123`).
- [ ] Lakukan uji coba ubah kontak atau fasilitas di dashboard untuk memastikan koneksi database MySQL aktif.
- [ ] Lakukan ganti password admin di dashboard.

---

## 5. Pertanyaan Umum & Troubleshooting

**Q: Mengapa saat membuka `/id/akomodasi` muncul error 404 Not Found di Hostinger?**
> Pastikan file `.htaccess` terupload dan berada di dalam `public_html`. File yang diawali titik (`.`) terkadang tersembunyi. Pastikan opsi *Show Hidden Files* diaktifkan di File Manager.

**Q: Database connection failed (500 Error)?**
> Periksa kembali nama database, username, dan password di `public_html/api/db_config.php` atau `public_html/api/config.php`. Pastikan user MySQL sudah diberikan hak akses penuh (ALL PRIVILEGES) ke database terkait di menu Hostinger MySQL Databases.

**Q: Gambar hasil upload tidak muncul?**
> Pastikan folder `public_html/img/uploads/` memiliki izin akses (Permissions) `755` agar server web dapat menulis dan membaca file gambar.

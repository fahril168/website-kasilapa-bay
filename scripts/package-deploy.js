/**
 * Kasilapa Bay - Automated Hostinger Deployment Packager
 * 
 * Workflow:
 * 1. Menjalankan `next build` (menghasilkan folder `out/`).
 * 2. Memastikan file `.htaccess` dan folder `api/` tersalin lengkap ke `out/`.
 * 3. Memaketkan seluruh isi folder `out/` menjadi `kasilapa-hostinger-deploy.zip`.
 * 4. File zip siap diunggah langsung ke `public_html` pada Hostinger File Manager.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'out');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const ZIP_FILE = path.join(ROOT_DIR, 'kasilapa-hostinger-deploy.zip');

console.log('====================================================');
console.log('   KASILAPA BAY - HOSTINGER DEPLOYMENT PACKAGER    ');
console.log('====================================================\n');

try {
  // 1. Build Next.js Static Export
  console.log('[1/4] Menjalankan Next.js build (static export)...');
  execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });

  if (!fs.existsSync(OUT_DIR)) {
    throw new Error('Folder out/ tidak ditemukan setelah build.');
  }

  // 2. Verifikasi & Salin .htaccess
  console.log('\n[2/4] Memverifikasi file .htaccess & REST API...');
  const htaccessSrc = path.join(PUBLIC_DIR, '.htaccess');
  const htaccessDest = path.join(OUT_DIR, '.htaccess');
  if (fs.existsSync(htaccessSrc)) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
    console.log('  -> .htaccess berhasil disalin ke out/.htaccess');
  }

  // Verifikasi folder API
  const apiDest = path.join(OUT_DIR, 'api');
  if (!fs.existsSync(apiDest)) {
    throw new Error('Folder out/api tidak ditemukan. Pastikan folder public/api tersedia.');
  }
  console.log('  -> Folder out/api/ terverifikasi lengkap.');

  // 3. Kompresi ke ZIP
  console.log('\n[3/4] Mengompresi paket deploy ke kasilapa-hostinger-deploy.zip...');
  if (fs.existsSync(ZIP_FILE)) {
    fs.unlinkSync(ZIP_FILE);
  }

  // Menggunakan tar bawaan Windows/Linux (cepat, include file tersembunyi .htaccess, bebas file-lock)
  try {
    execSync(`tar -a -cf "${ZIP_FILE}" -C "${OUT_DIR}" .`, { stdio: 'inherit', cwd: ROOT_DIR });
  } catch {
    const psCommand = `powershell -NoProfile -Command "Get-ChildItem -Force -Path '${OUT_DIR}' | Compress-Archive -DestinationPath '${ZIP_FILE}' -Force"`;
    execSync(psCommand, { stdio: 'inherit', cwd: ROOT_DIR });
  }

  if (!fs.existsSync(ZIP_FILE)) {
    throw new Error('Gagal membuat file zip.');
  }

  const stats = fs.statSync(ZIP_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  // 4. Selesai
  console.log('\n[4/4] SUKSES! Paket deploy siap.');
  console.log('----------------------------------------------------');
  console.log(`Lokasi File : ${ZIP_FILE}`);
  console.log(`Ukuran File : ${sizeMB} MB`);
  console.log('----------------------------------------------------');
  console.log('\nLangkah selanjutnya untuk Deploy ke Hostinger:');
  console.log('1. Buka File Manager di Hostinger hPanel.');
  console.log('2. Buka folder public_html.');
  console.log('3. Upload kasilapa-hostinger-deploy.zip ke public_html.');
  console.log('4. Klik kanan file zip -> Extract langsung di public_html.');
  console.log('5. Import scripts/db_schema.sql di phpMyAdmin Hostinger.');
  console.log('6. Selesai! Website siap diakses secara online.\n');

} catch (error) {
  console.error('\n[ERROR] Terjadi kesalahan saat memaketkan:', error.message);
  process.exit(1);
}

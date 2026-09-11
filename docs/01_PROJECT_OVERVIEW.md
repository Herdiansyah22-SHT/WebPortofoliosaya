# PHASE 0 — PROJECT OVERVIEW

> **Status Dokumen:** Disetujui — Single Source of Truth tingkat project.
> **Dibuat:** 26 Agustus 2026
> **Oleh:** Achmad Herdiansyah
> **Berlaku untuk:** Seluruh fase pengembangan Personal Portfolio CMS.

---

## 1. Project Identity

| Aspek | Nilai |
|---|---|
| Nama Project | Personal Portfolio CMS |
| Jenis Project | Full-Stack Web Application |
| Kategori | Personal Portfolio Website + Content Management System (CMS) |
| Akronim | PPCMS |
| Tujuan Utama | Website portfolio pribadi yang modern, responsif, SEO-friendly, dan kontennya dapat dikelola secara dinamis melalui CMS tanpa mengubah source code. |

Setiap konten (profile, projects, skills, experience, education, certificates, blog, SEO) dikelola melalui dashboard admin. Perubahan konten cukup dilakukan sekali di CMS, langsung tampil di public website — tanpa pull request, build, atau redeploy.

---

## 2. Project Owner Profile

| Aspek | Detail |
|---|---|
| Nama | Achmad Herdiansyah |
| Professional Title | Junior Web Developer |
| Pendidikan | S1 Teknik Informatika — Universitas 17 Agustus 1945 Surabaya (2022–2026) |
| IPK | 3.42 / 4.00 |
| Portfolio Project | 4 project Laravel (Smart Inventory AI, Tridig, PSHT Rayon Banjarkemantren, E-Booking & E-Ticketing) |
| Latar Belakang | Multimedia dan UI/UX |
| Tujuan Karir | Menunjukkan kemampuan full-stack (Laravel + React) dan proses software engineering |

Profil pemilik akan dikelola di CMS, sehingga data di atas adalah **seed data awal**, bukan hardcode pada frontend.

---

## 3. Project Background

Portfolio statis memiliki keterbatasan: setiap perubahan konten membutuhkan perubahan source code, commit, build, dan redeploy. Alur tersebut lambat dan tidak praktis untuk website yang terus diperbarui.

Sebelumnya, pengalaman pembuatan portfolio lebih dominan pada backend (Laravel, PHP, MySQL). Website ini sekaligus menjadi bukti kemampuan frontend React.js secara menyeluruh.

**Workflow tanpa CMS:**

```
Edit Source Code → Git Commit → Build → Deploy → Content Updated
```

**Workflow dengan CMS:**

```
Login Admin → Dashboard → Manage Content → Publish → Content Updated
```

Dengan pendekatan ini, project tidak hanya berfungsi sebagai website portfolio, tetapi juga sebagai full-stack application yang menunjukkan kemampuan software engineering: requirement analysis, arsitektur, database design, API design, autentikasi, otorisasi, validasi, keamanan, testing, SEO, dan deployment.

---

## 4. Problem Statement

### 4.1 Content Tidak Dinamis
Portfolio statis mengharuskan perubahan source code saat ingin mengubah project, skill, experience, education, certificate, blog, atau profile.

### 4.2 Tidak Ada Centralized Content Management
Belum ada satu tempat terpusat untuk mengelola seluruh konten portfolio.

### 4.3 Kurangnya Bukti Kemampuan React
Portfolio sebelumnya menonjolkan backend Laravel. Project ini memperkuat React.js secara utuh: component-based development, API integration, frontend architecture, state management, dan authentication frontend.

### 4.4 SEO Management Terbatas
Dibutuhkan sistem SEO yang mengelola meta title, meta description, canonical, Open Graph, sitemap, robots.txt, dan structured data.

### 4.5 Tidak Menunjukkan Software Engineering Process
Project harus menunjukkan proses engineering lengkap: requirement analysis, system architecture, database design, API design, authentication, authorization, validation, security, testing, dan deployment.

---

## 5. Project Objectives

### 5.1 Primary Objective
Membangun platform portfolio pribadi berbasis web dengan React.js sebagai frontend dan Laravel 12 sebagai REST API backend, yang seluruh kontennya dapat dikelola dinamis melalui CMS.

### 5.2 Secondary Objectives
1. Memperdalam pemahaman React.js.
2. Memahami komunikasi frontend dengan REST API.
3. Mempraktikkan decoupled frontend-backend architecture.
4. Mempraktikkan authentication dan authorization.
5. Mempraktikkan relational database design.
6. Mempraktikkan API security.
7. Memahami SEO untuk web application.
8. Mempraktikkan testing.
9. Mempraktikkan deployment (target: cPanel hosting).
10. Mempelajari Docker untuk development environment.
11. Membangun project portfolio yang profesional.
12. Meningkatkan kemampuan problem solving dan software engineering.

---

## 6. Project Scope

### 6.1 Public Website
Home, About, Skills, Projects, Project Detail, Experience, Education, Certificates, Blog, Blog Detail, Contact.

Public website **hanya** menampilkan konten berstatus `published`.

### 6.2 CMS
Dashboard, Profile Management, Project Management, Skill Management, Experience Management, Education Management, Certificate Management, Blog Management, Media Management, Contact Message Management, SEO Management, Site Settings.

### 6.3 System
Authentication, Authorization (RBAC), Role & Permission, REST API, Validation, Error Handling, Logging, Security, Testing, SEO, Deployment.

---

## 7. Out of Scope

Versi awal **tidak** mencakup:

- E-commerce
- Payment Gateway
- Marketplace
- Real-time Chat
- Social Media Platform
- Microservices
- Kubernetes
- Complex AI System
- Recommendation Engine
- Multi-Tenant Architecture (untuk CMS ini sendiri)
- Mobile Application
- Advanced Analytics Platform

Fitur-fitur tersebut hanya dipertimbangkan sebagai future development jika diperlukan. Menambahkan fitur tanpa business value adalah pelanggaran prinsip project (lihat Bagian 37).

---

## 8. Target Users

| Role | Kebutuhan Inti |
|---|---|
| Public Visitor | Melihat profile, skills, projects, experience, education, certificates, blog, dan menghubungi pemilik portfolio. |
| Administrator (Admin) | Login; mengelola seluruh konten: profile, projects, skills, experience, education, certificates, blog, media, messages, SEO, site settings, dan user management sesuai permission. |
| Editor | Mengelola project, blog, dan konten tertentu sesuai permission yang diberikan secara eksplisit. Tidak memiliki akses ke konfigurasi sistem dan user management. |

---

## 9. High-Level User Flow

### 9.1 Public User Flow

```
Visitor → Homepage → Explore Portfolio
                         ├── About
                         ├── Skills
                         ├── Projects → Project Detail
                         ├── Experience
                         ├── Education
                         ├── Certificates
                         └── Blog → Blog Detail
                                   → Contact
```

### 9.2 Admin User Flow

```
Admin → Login → Authentication → Dashboard → Manage Content
                         ├── Profile
                         ├── Projects
                         ├── Skills
                         ├── Experience
                         ├── Education
                         ├── Certificates
                         ├── Blog
                         ├── Media
                         ├── Messages
                         ├── SEO
                         └── Settings
```

---

## 10. High-Level System Architecture

Decoupled Frontend-Backend Architecture. Frontend dan backend adalah dua aplikasi terpisah yang berkomunikasi melalui HTTP/JSON.

```text
                    USER
                      │
                      ▼
              ┌───────────────┐
              │   React.js    │
              │   Frontend    │
              └───────┬───────┘
                      │
                   HTTP/JSON
                      │
                      ▼
              ┌───────────────┐
              │   Laravel 12  │
              │   REST API    │
              └───────┬───────┘
                      │
               Business Logic
                      │
                      ▼
              ┌───────────────┐
              │     MySQL     │
              └───────────────┘
```

Prinsip kunci:

- React **tidak boleh** mengakses database secara langsung.
- Semua akses data melewati API.
- Laravel adalah satu-satunya pihak yang menyentuh MySQL.
- Modular monolithic architecture — bukan microservices.

---

## 11. Frontend Responsibility

Frontend (React.js) bertanggung jawab terhadap:

- UI dan komponen
- Routing (React Router)
- State management
- Form handling
- Konsumsi API (Axios)
- Loading state
- Error state
- Responsive UI
- Meta tags dan SEO client-side (document title, meta, Open Graph, JSON-LD)
- Menyimpan token autentikasi untuk sesi admin

Frontend **bukan security boundary**. Semua keamanan data ditangani di backend.

---

## 12. Backend Responsibility

Backend (Laravel 12) bertanggung jawab terhadap:

- REST API
- Authentication (Sanctum)
- Authorization / RBAC (Spatie Permission)
- Business logic
- Validasi input
- Database (ORM, migration, query)
- File management / upload
- Security (rate limiting, CORS, MIME validation, dll.)
- Logging
- Mengeluarkan sitemap.xml dan robots.txt

Backend adalah satu-satunya security boundary data.

---

## 13. Database Responsibility

MySQL bertanggung jawab terhadap:

- Persistensi data seluruh konten.
- Relational integrity (foreign key antar tabel).
- Uniqueness constraint (misal slug, key setting).
- Indexing untuk query yang sering dipakai (published public endpoint).

Semua akses database dilakukan **hanya** melalui Laravel (ORM/Eloquent). Tidak ada query langsung dari frontend.

---

## 14. Technology Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Frontend | React.js | 19.x (Vite) |
| Frontend | Vite | 7.x |
| Frontend | JavaScript | ES2020+ |
| Frontend | React Router | 7.x |
| Frontend | Tailwind CSS | 4.x |
| Frontend | Axios | 1.x |
| Backend | Laravel | 12.x |
| Backend | PHP | 8.2 |
| Backend | Laravel Sanctum | 4.x |
| Backend | Spatie Permission | 6.x |
| Database | MySQL | 8.x |
| Dev Tools | Git, GitHub | — |
| Dev Tools | Postman | — |
| Dev Tools | VS Code | — |
| DevOps (optional) | Docker, Redis, GitHub Actions | — |
| Deployment Target | cPanel Hosting | — |

Catatan Docker: Docker **bukan requirement** untuk menjalankan project. Docker dipakai sebagai learning tool dan development environment setelah core application stabil.

---

## 15. Core Modules

| Modul | Kategori | Fungsi |
|---|---|---|
| Public Website | Public | Situs portfolio yang dapat dinavigasi pengunjung. |
| Dashboard | CMS | Ringkasan statistik konten dan akses cepat ke modul lain. |
| Profile Management | CMS | Kelola identitas, bio, foto, sosial, resume, availability. |
| Project Management | CMS | CRUD project + publikasi. |
| Skill Management | CMS | CRUD skill + level + kategori. |
| Experience Management | CMS | CRUD riwayat kerja. |
| Education Management | CMS | CRUD riwayat pendidikan. |
| Certificate Management | CMS | CRUD sertifikat. |
| Blog Management | CMS | CRUD artikel blog + status publikasi. |
| Media Management | CMS | Upload, tampil, hapus file media. |
| Message Management | CMS | Lihat dan kelola pesan dari form kontak. |
| SEO Management | CMS | Kelola default SEO, meta, robots.txt. |
| Site Settings | CMS | Kelola pengaturan situs (nama, tagline, sosial, kontak). |
| Authentication | System | Login, logout, identitas user. |
| Authorization / RBAC | System | Pembatasan akses per role/permission. |
| REST API | System | Seluruh komunikasi data. |
| SEO Engine | System | Meta, sitemap, robots.txt, structured data. |

---

## 16. Content Overview

### 16.1 Profile
Name, headline, bio, profile photo, location, email, phone, social links, resume (file/URL), availability status. **Seed:** Achmad Herdiansyah, Junior Web Developer.

### 16.2 Skills
Name, category, level, icon, description, display order, active status.

### 16.3 Projects
Title, slug, short description, description, thumbnail, gallery (media), technologies, GitHub URL, demo URL, start date, end date, project status, featured status, publication status.

**Seed projects:**

| # | Project | Stack |
|---|---|---|
| 1 | Smart Inventory AI — ERP & Manajemen Inventaris | Laravel, PHP, MySQL |
| 2 | Tridig — Company Profile & CMS | Laravel, PHP |
| 3 | PSHT Rayon Banjarkemantren — Landing Page & CMS | Laravel, PHP |
| 4 | Sistem E-Booking & E-Ticketing Pendakian Gunung (Tugas Akhir) | Laravel, PHP, MySQL, Multi-Tenant |

### 16.4 Experience
Company, position, description, location, start date, end date, current status.

### 16.5 Education
Institution, degree, field of study, start year, end year, description.
**Seed:** Universitas 17 Agustus 1945 Surabaya, S1 Teknik Informatika, 2022–2026, IPK 3.42.

### 16.6 Certificates
Certificate name, issuer, credential ID, issue date, expiration date, credential URL, certificate image.

### 16.7 Blog
Title, slug, excerpt, content, featured image, category, tags, author, status (draft/published/archived), published at, reading time.

---

## 17. Content Lifecycle

### 17.1 Konten Publik (Projects, Blog)
```
Draft → Published → Archived
    ↑_________________|
```

- **Draft:** hanya terlihat di CMS.
- **Published:** tampil di public website.
- **Archived:** tidak tampil di public website, tetap tersimpan.
- Update draft kembali ke published dilakukan admin.

### 17.2 Konten Pendukung (Skill, Experience, Education, Certificate, Project)
Dikelola dengan `is_active` / `publication status`:

```
(belum aktif) → Active (tampil public) → Inactive (tersembunyi)
```

### 17.3 Pesan Kontak
```
Unread → Read → (dihapus jika dianggap spam)
```

Public website hanya menampilkan konten berstatus `published`/`active`.

---

## 18. Authentication Concept

- **Mekanisme:** Laravel Sanctum (Personal Access Token).
- **Alur:** pengguna (admin/editor) login dengan email + password → backend validasi → backend keluarkan token (Bearer) → frontend simpan token → token dikirim setiap request terproteksi.
- **Password:** di-hash (bcrypt), tidak pernah disimpan/dikirim dalam bentuk plain.
- **Endpoint auth:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- **Frontend:** halaman `/admin/login`, simpan token (localStorage / memory), logout menghapus token.
- Token adalah kredensial; keamanan penyimpanannya dijelaskan pada Bagian 28.

---

## 19. Authorization Concept

### 19.1 Role
- **Admin** — akses penuh sesuai permission.
- **Editor** — akses terbatas (contoh: kelola project, blog, media).
- Editor tidak memiliki akses ke konfigurasi sistem dan user management kecuali diberi permission eksplisit.

### 19.2 RBAC
Menggunakan **Spatie Laravel Permission** (role + permission).

Contoh permission:

| Resource | Permissions |
|---|---|
| Projects | `projects.view`, `projects.create`, `projects.update`, `projects.delete` |
| Posts (blog) | `posts.view`, `posts.create`, `posts.update`, `posts.delete` |
| Media | `media.view`, `media.upload`, `media.delete` |
| Settings | `settings.view`, `settings.update` |

### 19.3 Prinsip
- Authorization **wajib di backend** (policy/middleware).
- Frontend hanya menyembunyikan menu; pengaman data tetap di backend.
- Frontend bukan security boundary.

Pemetaan lengkap role × resource ada di **Phase 1** (Permission Matrix).

---

## 20. API Architecture

- **Style:** RESTful API, JSON.
- **Base path:** `/api`.
- **HTTP semantics:** GET (baca), POST (buat), PUT/PATCH (ubah), DELETE (hapus).
- **Public endpoints:** tanpa autentikasi, hanya data published.
- **Protected endpoints:** memerlukan Bearer token (Sanctum) + permission check.
- **Response contract konsisten** di seluruh endpoint:

```json
{
  "success": true,
  "data": { }
}
```

```json
{
  "success": false,
  "message": "...",
  "errors": { }
}
```

- **Status codes:** 200 (OK), 201 (Created), 401 (Unauthenticated), 403 (Forbidden), 404 (Not Found), 422 (Validation Error), 429 (Too Many Requests), 500 (Server Error).
- **Pagination** pada endpoint list yang berpotensi besar (blog, project, media, messages).
- **Slug** sebagai identifier publik: `/api/projects/{slug}`, `/api/blogs/{slug}`.

---

## 21. API Communication Flow

```
React (Axios) → HTTP Request (JSON)
                    ↓
        Middleware: CORS → Throttle → auth:sanctum (jika protected)
                    ↓
        Controller → Validasi (FormRequest)
                    ↓
        Service / Business Logic
                    ↓
        Eloquent → MySQL
        (respons dibentuk → consistency helper)
                    ↓
        JSON Response → React
```

Setiap request melewati: throttling → autentikasi (bila diperlukan) → otorisasi (bila diperlukan) → validasi input → business logic → query DB → response JSON.

---

## 22. Public Content Flow

Visitor akses halaman React → React fetch data dari public endpoint → Laravel ambil data published dari MySQL → respons JSON → React render.

```
Visitor → React Page → GET /api/projects?status=published → Laravel → MySQL
                                                                  ↓
                                            Published data JSON ←───┘
                                                                  ↓
React render halaman ←─────────────────────────────────────────────┘
```

Frontend menampilkan **error state** dan **loading state** saat data tidak tersedia atau sedang dimuat.

---

## 23. CMS Content Flow

```
Admin → Login → Token
        ↓
Dashboard → Pilih Modul (CRUD)
        ↓
React Form → POST/PUT/DELETE /api/admin/...
        ↓
Laravel: auth + permission + validasi
        ↓
Simpan / update / hapus di MySQL
        ↓
JSON response → React update UI (toast, re-fetch)
```

Setiap perubahan langsung tampil di public website setelah konten berstatus `published`.

---

## 24. Contact Flow

```
Visitor → Contact Form → Validasi frontend → POST /api/contact
        ↓
Laravel: validasi + rate limiting
        ↓
Simpan Message (default unread)
        ↓
Response sukses / error → React feedback
```

```
Admin → CMS Messages → Daftar pesan → Mark as Read / Hapus
```

Rate limiting mencegah spam. Message tersimpan permanen di database hingga dihapus oleh admin.

---

## 25. Media Flow

### 25.1 Upload (CMS)
```
Admin → Media → Upload File (multipart)
        ↓
Laravel validasi:
  - File type
  - MIME type whitelist
  - Extension whitelist
  - Ukuran maksimal
  - (Dimensi gambar bila diperlukan)
        ↓
Simpan ke storage (disk public / local)
Simpan metadata (filename, path, mime, size) ke tabel media
        ↓
Response: URL + metadata media
```

### 25.2 Penggunaan
Media dipakai oleh project thumbnail, gallery, blog cover, profile photo, certificate image, dan SEO (image og:image). Alt text disimpan untuk aksesibilitas dan SEO.

### 25.3 Hapus
Delete menghapus file fisik dan record metadata. Permission `media.delete` wajib.

---

## 26. SEO Strategy

Sistem mendukung:

- Meta Title (`title`) per halaman.
- Meta Description.
- Canonical URL.
- Open Graph (og:title, og:description, og:image, og:type, og:url).
- Twitter/X Metadata (twitter:card, twitter:title, twitter:description, twitter:image).
- Sitemap (`/sitemap.xml`) — database terisi otomatis dari konten published.
- `robots.txt` — dapat dikelola lewat CMS (SEO Management).
- Structured Data (JSON-LD): `Person`, `CreativeWork` (project), `Article` (blog).
- Semantic HTML (header, nav, main, section, article, footer).
- SEO-friendly URL dengan slug.
- Image Alt Text.
- Internal linking antar halaman.
- Siap diintegrasikan dengan Google Search Console via meta verification dan sitemap.

---

## 27. SEO URL Strategy

Semua URL publik menggunakan slug. Contoh:

```
/projects/smart-inventory-ai
/blog/membangun-rest-api-dengan-laravel
```

Struktur URL:

| Halaman | URL |
|---|---|
| Home | `/` |
| About | `/about` |
| Skills | `/skills` |
| Projects | `/projects` |
| Project Detail | `/projects/{slug}` |
| Experience | `/experience` |
| Education | `/education` |
| Certificates | `/certificates` |
| Blog | `/blog` |
| Blog Detail | `/blog/{slug}` |
| Contact | `/contact` |
| CMS Login | `/admin/login` |
| CMS Dashboard | `/admin` |

Slug bersifat unik di database (constraint unique) dan tidak berubah setelah dipublikasi kecuali diperbarui oleh admin.

---

## 28. Security Overview

- **Authentication:** Sanctum token.
- **Authorization:** RBAC via Spatie Permission; enforce di backend.
- **Password hashing:** bcrypt (tidak pernah plain text).
- **Input validation:** FormRequest Laravel di setiap endpoint tulis.
- **Mass assignment protection:** `$fillable`/`$guarded` di model.
- **Rate limiting:** throttle pada login (`/api/contact` dan endpoint publik).
- **CORS:** dibatasi hanya origin frontend yang dizinkan.
- **File upload validation:** type, MIME, extension, ukuran.
- **Secure error handling:** pesan error tidak membocorkan stack trace, password, API key, database credentials, atau environment secrets.
- **HTTPS production:** dipasang di deployment (cPanel).
- **Protected API endpoint:** seluruh operasi tulis CMS memerlukan token + permission.
- **Environment secrets:** tersimpan di `.env`, tidak pernah masuk git (`.gitignore`).
- **XSS-conscious rendering:** konten admin dirender dengan sanitasi di sisi frontend; output dibedakan antara plain text dan rich content.

---

## 29. Error Handling

### 29.1 Backend
- Response error JSON konsisten.
- 401/403/404/422/429/500 ditangani secara terpusat (exception handler).
- Logging ke file log Laravel.
- Production: `APP_DEBUG=false`, detail internal tidak bocor ke client.

### 29.2 Frontend
- Setiap fetching/aksi memiliki loading dan error state.
- Show pesan ramah dari API (misal: "Kolom wajib diisi").
- Timeout dan network error ditangani dengan pesan jelas.
- Form error (422) ditampilkan per-field.

---

## 30. Responsive Requirement

Website harus berfungsi baik pada:

- Mobile (≤ 640px)
- Tablet (641–1024px)
- Desktop (≥ 1025px)

Pendekatan: mobile-first dengan Tailwind CSS. Layout grid/flex responsif di seluruh halaman public dan CMS. Navbar mobile dengan menu kompak. Tabel CMS menggunakan tampilan kartu/scroll horizontal di layar kecil.

---

## 31. Accessibility Requirement

- Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Keyboard navigation untuk semua interaksi.
- Form memakai `<label>` yang terhubung.
- Alt text pada semua gambar informatif.
- Kontras warna memadai.
- Focus state terlihat jelas.
- Tombol dan navigasi dapat diakses (bukan `<div>` ber-peran tombol tanpa atribut aksesibel).
- ARIA bila diperlukan.

---

## 32. Performance Requirement

- Optimasi gambar (maks ukuran upload, lazy loading gambar non-critical).
- Efficient API request (tidak over-fetch; pagination untuk list besar).
- **Pagination** pada blog, project, media, messages.
- Lazy loading komponen/route bila diperlukan.
- Asset optimization (build Vite, code splitting).
- DB query optimization (index pada kolom yang sering difilter: `status`, `slug`, `sort_order`).
- Caching dilakukan hanya bila terbukti perlu — **jangan premature optimization**.

---

## 33. Deployment Target

Target: **cPanel Hosting**.

```text
Domain (HTTPS)
     ↓
React Frontend (static files)
     ↓         HTTP/REST API
Laravel REST API (backend)
     ↓
MySQL
```

- Frontend: build static (Vite) ditempatkan di document root / subdomain.
- Backend: Laravel ditempatkan di subdomain API atau folder terpisah.
- HTTPS wajib aktif.
- Integrasi Google Search Console: sitemap submission + meta verification.
- Environmentproduction: `APP_ENV=production`, `APP_DEBUG=false`, secret di environment.

Detail konfigurasi deployment dijelaskan pada fase Deployment.

---

## 34. Docker Strategy

- Docker **bukan requirement** untuk menjalankan project.
- Digunakan sebagai learning tool dan development environment **setelah** core application stabil.
- Kemungkinan penggunaan: container MySQL, atau container frontend/backend untuk development yang konsisten di berbagai mesin.
- Prioritas: core application stabil dan tervalidasi terlebih dahulu sebelum Dockerized environment.

---

## 35. Git Strategy

- Repository: GitHub.
- Branch strategy sederhana:

```
main
 └── develop
      ├── feature/backend-foundation
      ├── feature/frontend-foundation
      ├── feature/authentication
      ├── feature/project-management
      └── feature/blog
```

- `main`: kode produksi (stabil).
- `develop`: integrasi.
- `feature/*`: satu fitur/phase per branch.
- Commit kecil dan deskriptif; setiap phase yang selesai di-commit.
- Conventional commit opsional untuk kejelasan.
- Optional (future): GitHub Actions untuk CI (test otomatis saat push/PR).

---

## 36. Documentation Strategy

- Dokumen fase disimpan di `docs/` dengan nomor urut:

```
docs/
├── 01_PROJECT_OVERVIEW.md        (fase ini)
├── 02_REQUIREMENTS_ARCHITECTURE.md   (Phase 1)
└── ...
```

- README utama: cara setup, menjalankan, dan struktur project.
- Dokumentasi API endpoint per modul.
- Setiap phase berisi: scope, objective, deliverables, acceptance criteria, definition of done.
- Dokumen adalah referensi utama; kode mengikuti dokumen.

---

## 37. Development Philosophy

- Requirement → Architecture → Database → Backend → API → Testing → Frontend → Integration → Security → Deployment → SEO.
- **Jangan langsung coding.** Setiap fase diselesaikan sebelum implementasi.
- **Jangan overengineering.** Hindari fitur tanpa business value.
- Modular monolithic. Hindari microservices.
- Prioritaskan: maintainability, security, simplicity, dan learning value.
- Frontend dan backend dipisahkan jelas tanggung jawabnya.
- Setiap fase memiliki acceptance criteria dan definition of done.
- Ambiguitas ditandai **TBD** / **Future Decision**, tidak diasumsikan besar-besaran (lihat Constraint #11).

---

## 38. Project Constraints

1. React.js sebagai frontend utama.
2. Laravel 12 sebagai backend REST API.
3. PHP 8.2 sebagai versi PHP utama.
4. MySQL sebagai database utama.
5. React tidak boleh mengakses database secara langsung.
6. Authorization harus dilakukan di backend.
7. API response harus konsisten.
8. Public website hanya menampilkan content published.
9. Docker bukan blocker development.
10. Gunakan modular monolithic architecture.
11. Jangan menggunakan microservices.
12. Hindari overengineering.
13. Jangan menambahkan fitur tanpa business value.
14. Jangan melakukan implementasi sebelum phase requirement dan architecture selesai.
15. Jangan mengganti React dengan Next.js.
16. Jika requirement ambigu → tandai **TBD** / **Future Decision**, jangan berasumsi besar.

---

## 39. Success Criteria

- [ ] Public website menampilkan seluruh konten portfolio secara dinamis dari API.
- [ ] Seluruh konten dapat dikelola melalui CMS tanpa mengubah source code.
- [ ] Authentication dan RBAC (Admin + Editor) berjalan dengan benar di backend.
- [ ] Public endpoint hanya menampilkan konten `published`.
- [ ] Contact message dari visitor tersimpan dan terkelola di CMS.
- [ ] Media management dengan validasi file berjalan aman.
- [ ] SEO: meta, OG, canonical, sitemap, robots.txt, JSON-LD terpasang dan valid.
- [ ] Website responsif (mobile, tablet, desktop) dan aksesibel.
- [ ] Test backend berjalan hijau (`php artisan test`).
- [ ] Frontend build sukses (`npm run build`).
- [ ] Berjalan di lingkungan production cPanel dengan HTTPS.
- [ ] Dokumentasi lengkap dan dapat dipakai sebagai referensi.

---

## 40. Portfolio Value

Project ini memberi nilai sebagai bukti kemampuan:

1. **Full-Stack:** Laravel REST API + React SPA.
2. **Software Engineering:** workflow requirement → architecture → implementasi → testing → deployment.
3. **Security awareness:** auth, RBAC, validasi, CORS, rate limiting, upload security.
4. **Arsitektur:** decoupled frontend-backend, modular monolithic.
5. **SEO:** implementasi teknis menyeluruh.
6. **CMS sebagai produk:** pengelolaan konten tanpa coding.
7. **Menyeimbangkan skill:** memperkuat React di atas pengalaman Laravel/MySQL.
8. **Deployment real-world:** siap dipasang di cPanel.

---

## 41. Project Presentation

Project disajikan/dipresentasikan sebagai:

- Live website portfolio (public site live).
- Demo CMS: login admin, kelola konten.
- Dokumentasi teknis: arsitektur, database, API.
- Repository GitHub: commit history rapi menunjukkan proses.
- Test suite backend sebagai bukti kualitas.

---

## 42. Initial Repository Structure

```text
WEBPORTFOLIO/
├── backend/                         # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Http/Requests/
│   │   ├── Http/Middleware/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── tests/Feature/
│   ├── .env
│   └── artisan
├── frontend/                        # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── docs/
│   └── 01_PROJECT_OVERVIEW.md
├── docker-compose.yml               # optional, later
└── README.md
```

Catatan: struktur lengkap dan detail disahkan pada Phase 1 (Requirement & System Architecture).

---

## 43. Phase 0 Deliverables

- [x] Dokumen `docs/01_PROJECT_OVERVIEW.md` (dokumen ini).

---

## 44. Phase 0 Definition of Done

- [x] Project identity ditentukan.
- [x] Project background ditentukan.
- [x] Problem statement ditentukan.
- [x] Project objectives ditentukan.
- [x] Project scope ditentukan.
- [x] Out of scope ditentukan.
- [x] Target users ditentukan.
- [x] High-level architecture ditentukan.
- [x] Technology stack ditentukan.
- [x] Core modules ditentukan.
- [x] Content overview ditentukan.
- [x] Authentication concept ditentukan.
- [x] Authorization concept ditentukan.
- [x] API architecture ditentukan.
- [x] SEO strategy ditentukan.
- [x] Security overview ditentukan.
- [x] Deployment target ditentukan.
- [x] Development philosophy ditentukan.
- [x] Project constraints ditentukan.
- [x] Success criteria ditentukan.
- [x] Repository structure ditentukan.
- [x] Next phase ditentukan.

---

## 45. Phase 0 Status

**SELESAI — 26 Agustus 2026.**

- Dokumen Project Overview lengkap dan menjadi Single Source of Truth.
- Belum ada source code application yang ditulis.
- Belum ada migration, API, React component, atau authentication implementation.
- Phase 1 belum dikerjakan (menunggu instruksi).

---

## 46. Next Phase

**PHASE 1 — REQUIREMENT & SYSTEM ARCHITECTURE**

Ruang lingkup Phase 1:

- Functional Requirements
- Non-Functional Requirements
- User Stories
- Use Cases
- User Roles
- Permission Matrix
- Module Boundaries
- Frontend Responsibilities
- Backend Responsibilities
- API Responsibilities
- System Architecture
- Data Flow
- Authentication Flow
- Authorization Flow
- CMS Flow
- Public Website Flow
- Error Handling Strategy
- Acceptance Criteria
- Definition of Done

Phase 1 tidak dikerjakan pada fase ini. Tunggu instruksi berikutnya.

---

## Lampiran — Vocab & Konsistensi

| Istilah | Arti dalam dokumen |
|---|---|
| CMS | Content Management System (dashboard admin) |
| RBAC | Role-Based Access Control |
| Sanctum | Paket autentikasi token Laravel |
| Spatie Permission | Paket role & permission Laravel |
| Published | Status konten yang tampil di public website |
| Deploy / Deployment | Pemasangan aplikasi ke production |
| TBD | To Be Decided — keputusan ditangguhkan |
| JSON-LD | JSON for Linking Data — structured data SEO |
# PHASE 1 — REQUIREMENT & SYSTEM ARCHITECTURE

> **Status Dokumen:** Blueprint resmi sebelum development dimulai.
> **Berdasarkan:** `docs/01_PROJECT_OVERVIEW.md` (Phase 0 — Project Overview).
> **Dibuat:** 26 Agustus 2026
> **Oleh:** Achmad Herdiansyah

Dokumen ini mengubah Project Overview menjadi requirement dan system architecture yang terstruktur. Seluruh keputusan utama konsisten dengan Phase 0. Tidak ada source code, migration, React component, API, atau authentication implementation yang dibuat pada fase ini.

---

## 1. Phase 1 Objective

Tujuan Phase 1:

- Mendefinisikan functional dan non-functional requirement.
- Mendefinisikan user stories dan use cases.
- Mendefinisikan user roles dan permission matrix.
- Mendefinisikan module boundaries.
- Mendefinisikan system architecture (React + Laravel + MySQL).
- Mendefinisikan frontend, backend, API, data flow, authentication, authorization, CMS, dan public website flow.
- Mendefinisikan error handling, security boundary, SEO requirement.
- Mendefinisikan high-level database entities.
- Mendefinisikan acceptance criteria.
- Menjadi blueprint sebelum implementation.

**Batasan:** Phase 1 tidak melakukan implementation apa pun (RULE 13–17).

---

## 2. Project Context

| Layer | Teknologi |
|---|---|
| Presentation | React.js + Vite + JavaScript + React Router + Tailwind CSS + Axios |
| API / Business Logic | Laravel 12 + PHP 8.2 + Laravel Sanctum + Spatie Permission |
| Database | MySQL |
| Tools | Git, GitHub, Postman, VS Code |
| Optional | Docker, Redis, GitHub Actions |
| Deployment | cPanel Hosting (HTTPS) |

```text
React.js
    ↓
REST API
    ↓
Laravel 12
    ↓
MySQL
```

React tidak pernah mengakses database langsung. Laravel adalah satu-satunya security boundary dan akses data.

---

## 3. Important Project Rules (ditegaskan ulang)

1. React.js tetap, jangan diganti Next.js.
2. Backend tetap Laravel 12.
3. PHP tetap 8.2.
4. Database tetap MySQL.
5. React tidak boleh mengakses database langsung.
6. Laravel = API + business logic layer.
7. Authorization harus di backend.
8. Frontend bukan security boundary.
9. Modular monolithic architecture.
10. Bukan microservices.
11. Hindari overengineering.
12. Tidak menambah fitur tanpa business value.
13. Tidak ada source code pada Phase 1.
14. Tidak ada migration pada Phase 1.
15. Tidak ada React component pada Phase 1.
16. Tidak ada API implementation pada Phase 1.
17. Tidak ada authentication implementation pada Phase 1.
18. Requirement ambigu → label **TBD**, jangan asumsi besar.

---

## 4. Pre-Condition

- `docs/01_PROJECT_OVERVIEW.md` dibaca dan dijadikan acuan.
- Isi Phase 1 konsisten dengan Phase 0 — tidak ada keputusan utama Phase 0 yang diubah.

**Conflict yang ditemukan:** Tidak ada conflict berarti. Dua penyesuaian penamaan dicatat agar konsisten:

| Phase 0 | Phase 1 (diputuskan) | Alasan |
|---|---|---|
| Blog Management + permission prefix `posts.*` | Route publik `blog`, tabel dan permission `posts.*` | Blueprint API memakai `/api/v1/blog`; tipe konten adalah entitas blog; table `posts` sesuai entity planning. Pemetaan didokumentasikan. |
| CMS "Profile Management" single record | `profiles` single-record (1 baris, di-seed) | Profile adalah data tunggal milik pemilik; tidak ada daftar multi-record. |

---

## 5. Phase 1 Deliverable

- `docs/02_REQUIREMENT_AND_ARCHITECTURE.md` (dokumen ini) — blueprint resmi sebelum development.

---

## 6. Requirement Analysis

Requirements dibagi dua kategori:

- **Functional (FR):** apa yang dapat dilakukan system oleh user.
- **Non-Functional (NFR):** bagaimana system bekerja.

Penomoran: `FR-xx` dan `NFR-xx` dipakai di seluruh dokumen agar dapat direferensikan pada acceptance criteria dan fase berikutnya.

---

## 7. Functional Requirements

### 7.1 Public Website

#### FR-01 Homepage
- **Purpose:** Halaman pembuka yang menampilkan ringkasan profile, headline, foto, dan konten unggulan.
- **Actor:** Visitor.
- **Preconditions:** Backend aktif; data published tersedia.
- **Main Flow:**
  1. Visitor membuka `/`.
  2. React fetch `/api/v1/site`, `/api/v1/profile`, proyek featured.
  3. Halaman dirender: hero, highlight project, call-to-action.
- **Alternative Flow:** Data kosong → halaman menampilkan empty state per section.
- **Business Rules:** Hanya konten published/featured yang ditampilkan.
- **Expected Result:** Homepage ter-render dengan data dinamis dari API.

#### FR-02 About
- **Purpose:** Menampilkan profil lengkap pemilik portfolio.
- **Actor:** Visitor.
- **Preconditions:** Data profile tersedia.
- **Main Flow:** Visitor membuka `/about` → fetch `/api/v1/profile` → render bio, pendidikan, sosial, resume.
- **Alternative Flow:** Profile belum lengkap → section yang kosong disembunyikan.
- **Business Rules:** Foto, bio, sosial, resume diambil dinamis.
- **Expected Result:** Halaman about terisi data CMS.

#### FR-03 Skills
- **Purpose:** Menampilkan daftar skill.
- **Actor:** Visitor.
- **Preconditions:** Ada skill berstatus active.
- **Main Flow:** `/skills` → fetch `/api/v1/skills` → render skill per kategori.
- **Alternative Flow:** Tidak ada skill active → empty state.
- **Business Rules:** Hanya `is_active = true` yang tampil; urutan mengikuti `sort_order`.
- **Expected Result:** Daftar skill tampil sesuai urutan.

#### FR-04 Projects
- **Purpose:** Menampilkan daftar project published.
- **Actor:** Visitor.
- **Preconditions:** Ada project published.
- **Main Flow:** `/projects` → fetch `/api/v1/projects` → render kartu project (thumbnail, title, ringkasan, stack).
- **Alternative Flow:** Tidak ada project published → empty state.
- **Business Rules:** Hanya `published`; opsi filter `featured`.
- **Expected Result:** Daftar project published tampil.

#### FR-05 Project Detail
- **Purpose:** Menampilkan detail project berdasarkan slug.
- **Actor:** Visitor.
- **Preconditions:** Project berstatus published dengan slug valid.
- **Main Flow:** Visitor buka `/projects/{slug}` → fetch `/api/v1/projects/{slug}` → render deskripsi, galeri, stack, link GitHub/Demo.
- **Alternative Flow:** Slug invalid atau konten draft → 404 page.
- **Business Rules:** Slug unique; draft/archived tidak pernah tampil di public.
- **Expected Result:** Halaman detail project tampil.

#### FR-06 Experience
- **Purpose:** Menampilkan riwayat pengalaman kerja.
- **Actor:** Visitor.
- **Preconditions:** Ada experience `is_active`.
- **Main Flow:** `/experience` → fetch `/api/v1/experience` → render timeline (company, posisi, periode, deskripsi).
- **Alternative Flow:** Data kosong → empty state.
- **Business Rules:** Sortir berdasarkan `start_date` (terbaru dulu).
- **Expected Result:** Timeline experience tampil.

#### FR-07 Education
- **Purpose:** Menampilkan riwayat pendidikan.
- **Actor:** Visitor.
- **Preconditions:** Ada education `is_active`.
- **Main Flow:** `/education` → fetch `/api/v1/education` → render kartu pendidikan.
- **Alternative Flow:** Data kosong → empty state.
- **Business Rules:** Sortir berdasarkan tahun.
- **Expected Result:** Daftar pendidikan tampil.

#### FR-08 Certificates
- **Purpose:** Menampilkan daftar sertifikat.
- **Actor:** Visitor.
- **Preconditions:** Ada certificate `is_active`.
- **Main Flow:** `/certificates` → fetch `/api/v1/certificates` → render kartu sertifikat + link kredensial.
- **Alternative Flow:** Data kosong → empty state.
- **Business Rules:** Sortir berdasarkan `issued_date`.
- **Expected Result:** Daftar sertifikat tampil.

#### FR-09 Blog
- **Purpose:** Menampilkan daftar artikel published.
- **Actor:** Visitor.
- **Preconditions:** Ada post published.
- **Main Flow:** `/blog` → fetch `/api/v1/blog` (paginasi, filter kategori) → render daftar artikel.
- **Alternative Flow:** Kategori tanpa post → empty state + daftar kategori lain.
- **Business Rules:** Hanya `published`; `published_at <= now`; paginasi.
- **Expected Result:** Daftar artikel published tampil dengan paginasi.

#### FR-10 Blog Detail
- **Purpose:** Menampilkan isi artikel + meta SEO.
- **Actor:** Visitor.
- **Preconditions:** Post published, slug valid.
- **Main Flow:** `/blog/{slug}` → fetch `/api/v1/blog/{slug}` → render konten, cover, kategori, tags, author, waktu baca.
- **Alternative Flow:** Slug invalid/draft/archived → 404.
- **Business Rules:** Slug unique; artikel non-published tidak pernah tampil.
- **Expected Result:** Artikel tampil lengkap.

#### FR-11 Contact
- **Purpose:** Menampilkan form kontak dan menyimpan pesan visitor.
- **Actor:** Visitor.
- **Preconditions:** Form diisi valid.
- **Main Flow:**
  1. Visitor isi name, email, subject, message.
  2. Frontend validasi dasar.
  3. `POST /api/v1/contact`.
  4. Backend validasi + rate limit.
  5. Message disimpan; response sukses.
- **Alternative Flow:** Validasi gagal → error per-field; rate limit → pesan 429.
- **Business Rules:** Email format valid; subject/message minimal panjang; `max: 5 attempts / 1 minute` per IP.
- **Expected Result:** Message tersimpan, visitor mendapat konfirmasi.

### 7.2 CMS

#### FR-12 Authentication (CMS)
- **Purpose:** Login/logout admin & editor.
- **Actor:** Admin, Editor.
- **Preconditions:** User aktif dengan kredensial valid.
- **Main Flow:** `/admin/login` → `POST /api/v1/auth/login` → Sanctum terbitkan token → arahkan ke `/admin`.
- **Alternative Flow:** Kredensial salah → error; throttle → 429.
- **Business Rules:** Token personal access; logout mencabut token; tanpa token tidak ada akses CMS.
- **Expected Result:** User masuk ke dashboard dengan token aktif.

#### FR-13 Dashboard
- **Purpose:** Ringkasan status konten.
- **Actor:** Admin, Editor (terbatas).
- **Preconditions:** Terautentikasi.
- **Main Flow:** `/admin` → fetch ringkasan (jumlah projects, posts, messages unread, media) → render kartu statistik + pesan terbaru.
- **Alternative Flow:** Editor tanpa permission module → kartu disembunyikan.
- **Business Rules:** Angka mengikuti permission user; message unread hanya untuk permission `messages.view`.
- **Expected Result:** Dashboard menampilkan angka sesuai akses.

#### FR-14 Profile Management
- **Purpose:** Mengelola data profile.
- **Actor:** Admin.
- **Preconditions:** Permission `profile.update`.
- **Main Flow:** `/admin/profile` → form (ukuran bentuk) → `PUT /api/v1/admin/profile` → simpan.
- **Alternative Flow:** Validasi gagal → 422 per-field.
- **Business Rules:** Single record; wajib: name, headline; foto opsional (media).
- **Expected Result:** Profile tersimpan dan langsung tampil di public.

#### FR-15 Project Management
- **Purpose:** CRUD, publikasi, invitasi proyek.
- **Actor:** Admin (full), Editor (permission).
- **Preconditions:** Permission `projects.*`.
- **Main Flow:** lihat daftar (`projects.view`), buat (`projects.create`), edit (`projects.update`), hapus (`projects.delete`), ubah status publish/archive.
- **Alternative Flow:** Duplikat slug → 422; status publish hanya jika required field terisi.
- **Business Rules:** Slug unique; thumbnail wajib saat publish; featured hanya satu flag per project.
- **Expected Result:** Project terkelola; status memengaruhi visibilitas public.

#### FR-16 Skill Management
- **Purpose:** CRUD skill.
- **Actor:** Admin (full), Editor (permission).
- **Main Flow:** list, create, update, delete, toggle active, ubah urutan.
- **Business Rules:** `sort_order` menentukan urutan tampil.
- **Expected Result:** Skill tampil sesuai status active dan urutan.

#### FR-17 Experience Management
- **Purpose:** CRUD experience.
- **Actor:** Admin (full), Editor (permission).
- **Business Rules:** `is_current` menandai pekerjaan sekarang; end_date kosong jika is_current.
- **Expected Result:** Experience terkelola, sortir by start_date.

#### FR-18 Education Management
- **Purpose:** CRUD education.
- **Actor:** Admin (full), Editor (permission).
- **Business Rules:** Tahun teks/angka; validasi start ≤ end.
- **Expected Result:** Education terkelola.

#### FR-19 Certificate Management
- **Purpose:** CRUD sertifikat.
- **Actor:** Admin (full), Editor (permission).
- **Business Rules:** URL kredensial valid; gambar opsional.
- **Expected Result:** Certificate terkelola.

#### FR-20 Blog Management
- **Purpose:** CRUD, kategori, tags, publikasi artikel.
- **Actor:** Admin (full), Editor (permission).
- **Main Flow:** list posts, tulis/edit artikel, atur kategori/tags, ubah status (draft/published/archived).
- **Alternative Flow:** Slug duplikat → 422.
- **Business Rules:** Slug unique; body wajib saat publish; `published_at` otomatis saat publish pertama kali.
- **Expected Result:** Post terkelola; draft tidak tampil public.

#### FR-21 Media Management
- **Purpose:** Upload, lihat, hapus media.
- **Actor:** Admin (full), Editor (`media.*`).
- **Main Flow:** `/admin/media` → upload → validasi file → simpan fisik + metadata → grid; pilih media untuk konten.
- **Business Rules:** Validasi type/MIME/extension/ukuran (lihat FR-NFR media, Bagian 26).
- **Expected Result:** Media terunggah, terdaftar, terhapus aman.

#### FR-22 Message Management
- **Purpose:** Lihat dan kelola pesan kontak.
- **Actor:** Admin (full), Editor (view only `messages.view`).
- **Main Flow:** list pesan unit paginasi → buka detail → mark read/unread → hapus.
- **Business Rules:** Editor hanya view; hapus butuh `messages.delete` (Admin).
- **Expected Result:** Pesan dikelola; status read/unread akurat.

#### FR-23 SEO Management
- **Purpose:** Kelola SEO global + robots.txt.
- **Actor:** Admin (full), Editor (view only `seo.view`).
- **Main Flow:** `/admin/seo` → edit default title/description/OG/robots.txt → simpan.
- **Business Rules:** SEO global dipakai sebagai fallback; robots.txt dapat diedit via setting.
- **Expected Result:** Setting SEO tersimpan; meta public ter-update.

#### FR-24 Settings
- **Purpose:** Kelola site settings.
- **Actor:** Admin (`settings.update`).
- **Preconditions:** Permission settings.
- **Main Flow:** `/admin/settings` → edit nama situs, tagline, sosial, kontak → simpan.
- **Business Rules:** Editor tanpa akses; perubahan langsung tampil di public.
- **Expected Result:** Setting tersimpan dan dipakai frontend.

---

## 8. Non-Functional Requirements

### 8.1 Performance — `NFR-PERF`
| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-1 | API response cepat | P95 ≤ 300ms untuk public endpoint baca (dev localhost; load test bukan prioritas v1) |
| NFR-PERF-2 | Page loading | Build Vite (code splitting), lazy-load komponen berat |
| NFR-PERF-3 | Image optimization | Upload size cap 2 MB; lazy loading gambar non-hero |
| NFR-PERF-4 | Pagination | List besar (blog, media, messages) menggunakan pagination |

### 8.2 Security — `NFR-SEC`
| ID | Requirement |
|---|---|
| NFR-SEC-1 | Authentication via Sanctum token |
| NFR-SEC-2 | Authorization via Spatie Permission di backend |
| NFR-SEC-3 | Password bcrypt |
| NFR-SEC-4 | Validasi semua input di backend (FormRequest) |
| NFR-SEC-5 | Rate limiting login + contact |
| NFR-SEC-6 | CORS dibatasi origin frontend |
| NFR-SEC-7 | Validasi file upload: type, MIME, extension, size |
| NFR-SEC-8 | Mass assignment protection (`$fillable`) |
| NFR-SEC-9 | Secret di `.env`, tidak pernah masuk git |
| NFR-SEC-10 | Production `APP_DEBUG=false` |

### 8.3 Availability — `NFR-AVAIL`
- System berfungsi normal untuk satu pengguna portfolio (single-tenant personal). Uptime bergantung hosting cPanel.
- Downtime terencana hanya saat deployment; dokumentasi rollback sederhana (deploy ulang build + backup DB).

### 8.4 Scalability — `NFR-SCALE`
- Menambah projects, blog, content, users, media TIDAK membutuhkan perubahan architecture.
- Growth plain: tambah baris data atau tambah record di tabel; modular monolithic tetap.

### 8.5 Maintainability — `NFR-MAINT`
- Kode mudah dibaca: struktur Laravel standar (controller api + request + resource).
- Mudah diuji: feature test per modul.
- Mudah dikembangkan: module boundary jelas (Bagian 13).
- Mudah di-debug: logging Laravel + response error konsisten.

### 8.6 Usability — `NFR-USE`
- CMS mudah dipahami admin: form berlabel jelas, mapping error 422 ke field, konfirmasi hapus, toast sukses.

### 8.7 Accessibility — `NFR-A11Y`
- Semantic HTML, label form, alt text, keyboard navigation, focus state, kontras cukup.

### 8.8 SEO — `NFR-SEO`
- Meta title/description, canonical, OG, Twitter, sitemap, robots.txt, JSON-LD, slug URL, alt image, internal linking.

### 8.9 Compatibility — `NFR-COMPAT`
- Browser modern: Chrome, Firefox, Edge, Safari (2 versi terakhir).

### 8.10 Responsive — `NFR-RESP`
- Mobile (≤640px), tablet (641–1024px), desktop (≥1025px).

---

## 9. User Stories

### Visitor
- As a Visitor, I want to view projects, so that I can understand the developer's experience.
- As a Visitor, I want to view project detail with technologies used, so that I can judge skill relevance.
- As a Visitor, I want to read blog articles, so that I can learn the developer's technical thinking.
- As a Visitor, I want to see skills, experience, education, and certificates, so that I can evaluate qualification.
- As a Visitor, I want to send a contact message, so that I can ask for collaboration.

### Admin
- As an Admin, I want to log in securely, so that only I can manage content.
- As an Admin, I want to create and publish projects, so that new work appears on the public site without code changes.
- As an Admin, I want to write blog posts with draft status, so that I can prepare content before publishing.
- As an Admin, I want to manage media files, so that I can reuse images across content.
- As an Admin, I want to view contact messages, so that I can respond to inquiries.
- As an Admin, I want to manage SEO metadata and site settings, so that my portfolio ranks well.

### Editor
- As an Editor, I want to log in and manage projects and blog content, so that I can contribute content.
- As an Editor, I want my access restricted to assigned modules, so that I cannot change system settings.

---

## 10. Use Cases

### UC-01 View Homepage
- **Actor:** Visitor — **Goal:** Melihat ringkasan portfolio.
- **Preconditions:** API aktif; data published ada.
- **Main Scenario:** Buka `/` → frontend fetch site+profile+featured project → render.
- **Alternative:** Data kosong → empty state per section.
- **Postconditions:** Homepage menampilkan data dinamis.

### UC-02 View Projects
- **Actor:** Visitor — **Goal:** Melihat daftar project.
- **Preconditions:** Terdapat project published.
- **Main Scenario:** Buka `/projects` → fetch list → render kartu.
- **Alternative:** Tidak ada data → empty state.
- **Postconditions:** Daftar project tampil.

### UC-03 View Project Detail
- **Actor:** Visitor — **Goal:** Melihat detail project.
- **Preconditions:** Project published; slug valid.
- **Main Scenario:** Buka `/projects/{slug}` → fetch detail → render lengkap.
- **Alternative:** Tidak ketemu / draft → 404 page.
- **Postconditions:** Detail project tampil.

### UC-04 View Blog List
- **Actor:** Visitor — **Goal:** Membaca daftar artikel.
- **Preconditions:** Ada post published; `published_at ≤ now`.
- **Main Scenario:** Buka `/blog` → fetch paginated list → render.
- **Alternative:** Kategori kosong → empty state.
- **Postconditions:** Daftar artikel tampil.

### UC-05 View Blog Detail
- **Actor:** Visitor — **Goal:** Membaca artikel.
- **Preconditions:** Post published; slug valid.
- **Main Scenario:** Buka `/blog/{slug}` → fetch detail → render konten + meta.
- **Alternative:** Tidak ketemu → 404.
- **Postconditions:** Artikel tampil.

### UC-06 Send Contact Message
- **Actor:** Visitor — **Goal:** Mengirim pesan.
- **Preconditions:** Form terisi; belum melewati rate limit.
- **Main Scenario:** Isi form → `POST /api/v1/contact` → simpan → sukses.
- **Alternative:** Validasi gagal → 422 per-field; rate limit → 429.
- **Postconditions:** Message tersimpan (status unread).

### UC-07 Login
- **Actor:** Admin/Editor — **Goal:** Mengakses CMS.
- **Preconditions:** Kredensial valid.
- **Main Scenario:** `POST /api/v1/auth/login` → terbitkan token → arahkan ke `/admin`.
- **Alternative:** Kredensial salah → pesan error; throttle → 429.
- **Postconditions:** Token aktif; sesi CMS terbuka.

### UC-08 Logout
- **Actor:** Admin/Editor — **Goal:** Mengakhiri sesi.
- **Main Scenario:** `POST /api/v1/auth/logout` → cabut token → hapus state lokal → kembali ke login.
- **Postconditions:** Token tidak valid lagi.

### UC-09 View Dashboard
- **Actor:** Admin/Editor — **Goal:** Melihat ringkasan.
- **Preconditions:** Terautentikasi.
- **Main Scenario:** Buka `/admin` → fetch ringkasan → render kartu.
- **Alternative:** Editor terbatas → kartu sesuai permission.
- **Postconditions:** Dashboard tampil.

### UC-10 Manage Profile
- **Actor:** Admin — **Goal:** Mengubah data diri.
- **Main Scenario:** Form → `PUT /api/v1/admin/profile` → simpan → sukses.
- **Alternative:** 422 per-field.
- **Postconditions:** Profile ter-update di public.

### UC-11 Manage Projects (CRUD/publish/archive)
- **Actor:** Admin (full) / Editor (permission) — **Goal:** Mengelola project.
- **Preconditions:** Permission `projects.*`.
- **Main Scenario:** List → create/edit → simpan; ubah status.
- **Alternative:** Slug duplikat → 422; tanpa permission → 403.
- **Postconditions:** Data + status project tersimpan.

### UC-12 Manage Skills / UC-13 Manage Experience / UC-14 Manage Education / UC-15 Manage Certificates
- **Actor:** Admin (full) / Editor — **Goal:** CRUD data pendukung.
- **Main Scenario:** List → create/edit/delete → simpan.
- **Alternative:** 422 / 403.
- **Postconditions:** Data ter-update; public menampilkan yang active.

### UC-16 Manage Blog (CRUD/publish/archive)
- **Actor:** Admin (full) / Editor — **Goal:** Mengelola artikel.
- **Preconditions:** Permission `posts.*`.
- **Main Scenario:** List → tulis/edit → atur kategori/tags → ubah status.
- **Alternative:** Slug duplikat → 422; body kosong saat publish → 422.
- **Postconditions:** Post tersimpan; hanya published tampil public.

### UC-17 Manage Media
- **Actor:** Admin (full) / Editor — **Goal:** Upload/lihat/hapus file.
- **Preconditions:** Terautentikasi; permission sesuai.
- **Main Scenario:** Upload file → validasi → simpan → tampil di grid.
- **Alternative:** File invalid → 422.
- **Postconditions:** Media tersedia untuk dipakai konten.

### UC-18 Manage Messages
- **Actor:** Admin (full) / Editor (view) — **Goal:** Memproses pesan masuk.
- **Main Scenario:** List → buka → mark read/unread → hapus (Admin).
- **Postconditions:** Status pesan ter-update.

### UC-19 Manage SEO
- **Actor:** Admin (full) / Editor (view only) — **Goal:** Kelola SEO global.
- **Main Scenario:** Edit default meta + robots.txt → simpan.
- **Postconditions:** Setting tersimpan; meta public ter-update.

### UC-20 Manage Settings
- **Actor:** Admin — **Goal:** Kelola pengaturan situs.
- **Main Scenario:** Edit settings → simpan.
- **Alternative:** Tanpa permission → 403.
- **Postconditions:** Setting tersimpan dan dipakai public.

### UC-21 Editor — Manage Authorized Content
- **Actor:** Editor — **Goal:** Mengelola modul yang diizinkan.
- **Preconditions:** Permission modul diberikan.
- **Main Scenario:** Editor mengakses modul sesuai permission (CRUD project, blog, media, dsb).
- **Alternative:** Akses modul lain → 403; menu disembunyikan.
- **Postconditions:** Konten modul terkelola; konfigurasi system tetap aman.

---

## 11. User Role Definition

### 11.1 Visitor
- **Purpose:** Mengunjungi dan membaca konten public; mengirim pesan.
- **Access Level:** Public endpoints only.
- **Allowed Actions:** Melihat homepage, about, skills, projects + detail, experience, education, certificates, blog + detail, contact form.
- **Restricted Actions:** Tidak ada akses CMS/API protected; tidak bisa mengubah konten.

### 11.2 Admin
- **Purpose:** Pemilik portfolio; mengelola seluruh sistem.
- **Access Level:** Seluruh modul CMS + user management terbatas (lihat catatan 11.4).
- **Allowed Actions:** Seluruh permission: dashboard, profile, projects, skills, experience, education, certificates, blog, media, messages, SEO, settings.
- **Restricted Actions:** Hanya dibatasi permission system (tidak dibuat di v1, lihat Bagian 11.4).

### 11.3 Editor
- **Purpose:** Kontributor konten (project, blog, media).
- **Access Level:** Modul yang diizinkan permission.
- **Allowed Actions:** CRUD project, blog, media; view messages; view SEO; dashboard terbatas.
- **Restricted Actions:** Tidak bisa akses settings, user management, dan permission yang tidak diberikan. Akses ditegakkan di backend (403).

### 11.4 Catatan User Management
- **TBD / Future Decision:** User management UI (create/update/delete user & assignment role) TIDAK termasuk v1. User (admin, editor) dibuat melalui seeder dan tinker. Keputusan ini menghindari overengineering; tidak menahan kebutuhan portfolio. UI user management dapat ditambahkan sebagai modul masa depan.

---

## 12. Permission Matrix

Penamaan permission: `{module}.{verb}`. Verb: `view`, `create`, `update`, `delete`, plus khusus: `upload` (media), `read`/`unread` (messages), `publish`/`archive` diwakili `posts.update`/`projects.update`.

| Module | Visitor | Editor | Admin |
|---|---|---|---|
| Dashboard | No | Limited (modul yang diizinkan) | Yes |
| Profile | View (public) | No | Full |
| Projects | View (public) | CRUD + publish/archive | Full |
| Skills | View (public) | CRUD | Full |
| Experience | View (public) | CRUD | Full |
| Education | View (public) | CRUD | Full |
| Certificates | View (public) | CRUD | Full |
| Blog/Posts | View (public) | CRUD + publish/archive | Full |
| Media | View (public URL) | Upload, View, Delete | Full |
| Messages | Submit only | View, Mark Read | Full (delete) |
| SEO | Public meta | View only (`seo.view`) | Full |
| Settings | No | No | Full |
| Auth | — | Login | Login |

**Keputusan publish/archive Editor:** Editor DAPAT melakukan publish/archive pada modul yang diberikan (projects, blog). Rekomendasi moderasi dua tahap (Editor submit → Admin review) tidak dibutuhkan untuk portfolio pribadi → **TBD / Future Decision** bila nanti dibutuhkan muktiple author.

Web - Editor mapping permission (default seed):

| Permission | Admin | Editor |
|---|---|---|
| `dashboard.view` | ✓ | ✓ |
| `profile.update` | ✓ | ✗ |
| `projects.view/create/update/delete` | ✓ | ✓ |
| `skills.view/create/update/delete` | ✓ | ✓ |
| `experience.view/create/update/delete` | ✓ | ✓ |
| `education.view/create/update/delete` | ✓ | ✓ |
| `certificates.view/create/update/delete` | ✓ | ✓ |
| `posts.view/create/update/delete` | ✓ | ✓ |
| `media.view/upload/delete` | ✓ | ✓ |
| `messages.view/update/delete` | ✓ | view, update (read/unread) |
| `seo.view/update` | ✓ | view |
| `settings.view/update` | ✓ | ✗ |

Matrix ini yang di-seed pada fase implementation. Perubahan hanya lewat permission Spatie (flexible).

---

## 13. Module Boundaries

### 13.1 Profile Module
- **Responsibility:** Menyimpan & menyediakan data diri pemilik.
- **Data ownership:** Tabel `profiles` (single record).
- **Dependency:** Media (foto). Tidak tergantung modul lain.
- **Scope:** Public read (1 endpoint) + CMS update (Admin).

### 13.2 Project Module
- **Responsibility:** CRUD project, status publikasi, featured, slug.
- **Data ownership:** Tabel `projects`, `project_technologies` (atau kolom JSON).
- **Dependency:** Media (thumbnail/gallery); profile (author implicit).
- **Scope:** Public read + CMS full.

### 13.3 Skill Module
- **Responsibility:** CRUD skill + kategori + urutan.
- **Data ownership:** Tabel `skills`.
- **Dependency:** none.
- **Scope:** Public read + CMS full.

### 13.4 Experience Module
- **Responsibility:** CRUD pengalaman kerja.
- **Data ownership:** Tabel `experiences`.
- **Dependency:** none.
- **Scope:** Public read + CMS full.

### 13.5 Education Module
- **Responsibility:** CRUD pendidikan.
- **Data ownership:** Tabel `educations`.
- **Dependency:** none.
- **Scope:** Public read + CMS full.

### 13.6 Certificate Module
- **Responsibility:** CRUD sertifikat.
- **Data ownership:** Tabel `certificates`.
- **Dependency:** Media (gambar).
- **Scope:** Public read + CMS full.

### 13.7 Blog Module
- **Responsibility:** CRUD post, kategori, tags, status publikasi.
- **Data ownership:** Tabel `posts`, `categories`, `tags`, `post_tags`.
- **Dependency:** Media (cover); profile (author).
- **Scope:** Public read + CMS full.
- **Catatan:** Route publik `blog`, model/permission `posts`.

### 13.8 Media Module
- **Responsibility:** Upload, metadata, penyimpanan file, URL publik.
- **Data ownership:** Tabel `media` + storage disk.
- **Dependency:** none (dipakai banyak modul).
- **Scope:** Public (URL file) + CMS full (kelola).

### 13.9 Message Module
- **Responsibility:** Terima, simpan, kelola pesan kontak.
- **Data ownership:** Tabel `contact_messages`.
- **Dependency:** none.
- **Scope:** Public (create) + CMS (kelola).

### 13.10 SEO Module
- **Responsibility:** Setting SEO global, robots.txt, default meta.
- **Data ownership:** `site_settings` (key `seo.*`) + kolom SEO di `projects`/`posts`.
- **Dependency:** profile (kanonik), projects, posts.
- **Scope:** Public meta consumption + CMS kelola.

### 13.11 Settings Module
- **Responsibility:** Konfigurasi situs (nama, tagline, sosial, kontak).
- **Data ownership:** Tabel `site_settings`.
- **Dependency:** none.
- **Scope:** Public read (`/api/v1/site`) + CMS kelola (Admin).

### 13.12 Authentication Module
- **Responsibility:** Login, logout, identitas user, token.
- **Data ownership:** `users` + `personal_access_tokens` (Sanctum).
- **Dependency:** none (dipakai sistem).
- **Scope:** System (CMS).

### 13.13 Authorization Module
- **Responsibility:** Role, permission, enforce akses.
- **Data ownership:** `roles`, `permissions`, pivots (Spatie).
- **Dependency:** users.
- **Scope:** System (CMS).

### 13.14 Activity Log Module (ringan)
- **Responsibility:** Mencatat aksi tulis admin (opsional ringan, backend-only).
- **Data ownership:** Tabel `activity_logs`.
- **Scope:** System internal; tidak ada UI v1 (dilihat via DB/log).
- **Catatan:** Ditambahkan karena disebut pada entity planning Phase 1 dan menambah nilai audit tanpa biaya arsitektur.
- **TBD / Future Decision:** UI untuk menampilkan activity log → future.

---

## 14. System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                  │
│                  React.js (SPA + Tailwind)             │
│            UI, Router, State, Forms, Axios             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP/JSON  (HTTPS di prod)
                            ▼
┌────────────────────────────────────────────────────────┐
│                        API LAYER                       │
│             Laravel Routes / Controllers / Resources   │
│                    /api/v1 + /admin  (REST)            │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                   │
│        Services (hanya bila kompleks), Validation,     │
│        Policies, Authorization, Business Rules         │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                    │
│     Laravel Eloquent ORM / Query Builder / Storage     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                      │
│                       MySQL 8                          │
└────────────────────────────────────────────────────────┘
```

- **Presentation Layer:** React SPA. Tidak menyentuh DB. Konsumsi API via Axios.
- **API Layer:** Laravel routes `api.php`, Controllers, FormRequest, ApiResources, exception rendering JSON.
- **Business Logic Layer:** Services hanya dibentuk bila business logic cukup kompleks (contoh: logika publish+slug+publish_at pada blog). Untuk CRUD sederhana, controller langsung memakai Eloquent + FormRequest. **Tidak memaksakan Repository Pattern** — tidak ada manfaat nyata untuk skala ini.
- **Data Access Layer:** Eloquent model + query. File storage via Laravel Storage.
- **Database Layer:** MySQL 8. Semua akses lewat Eloquent.

---

## 15. Frontend Architecture

Arsitektur React berbasis feature/route. Tanpa state management berat global — menggunakan:

- **Server state:** TanStack Query (fetch + cache + loading/error).  *(Keputusan: query library ringan yang standar; menghindari boiletplate fetch manual.)*
- **Auth state:** React Context (`AuthContext`) — token + user + roles/permissions.
- **Form:** controlled component React + validasi backend (422 dipetakan per-field). *(react-hook-form = TBD/future jika form makin kompleks.)*

Portofolio folder `frontend/src`:

```text
src/
├── components/          # reusable UI (Button, Input, Card, Spinner, EmptyState, Toast)
├── features/            # feature components (berbatas domain)
│   ├── home/
│   ├── about/
│   ├── projects/
│   ├── blog/
│   ├── contact/
│   └── admin/           # dashboard, forms CMS
├── layouts/             # PublicLayout, AdminLayout, AuthLayout
├── pages/               # route-level pages (thin, memakai layouts + features)
├── hooks/               # useAuth, useProjects, usePosts, useMedia, useSettings ...
├── services/            # apiClient (axios), endpoint modules, errorMapper
├── context/             # AuthContext
└── utils/               # slug/senior formatters, seo helper, formatDate
```

Batas **Reusable Components** vs **Feature Components**:

- Reusable: `Button`, `Input`, `Card`, `Modal`, `Spinner`, `EmptyState`, `ErrorState`, `FormField`, `Toast`, `Pagination`. Tidak tahu domain.
- Feature: `ProjectCard`, `ProjectForm`, `BlogList`, `SkillBar`, `ContactForm`, `DashboardStats`. Paham domain, memakai services/hooks.

State handling:

- **Loading state:** skeleton/spinner per section dari TanStack Query `isLoading`.
- **Error state:** komponen ErrorState dengan retry; pesan dari API.
- **Empty state:** komponen EmptyState.
- **Success state:** toast + re-fetch.

Pembentungan lebih lanjut ada di fase Frontend Development (Phase selanjutnya). Detail implementation TIDAK ditentukan berlebihan di sini.

---

## 16. Backend Architecture

Laravel modular monolithic. Struktur standar Laravel + pembagian Api:

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/       # public + admin controllers
│   │   ├── Controllers/Api/Admin/ # protected CMS controllers
│   │   ├── Requests/              # FormRequest per resource
│   │   └── Middleware/            # EnsureRole / EnsurePermission wrapper
│   ├── Models/                    # per entity
│   ├── Policies/                  # kebijakan per resource
│   ├── Services/                  # hanya bila business logic kompleks
│   ├── Http/Resources/            # ApiResource per entity (response contract)
│   └── Support/                   # ApiResponse helper, exception renderer
├── routes/api.php                 # seluruh endpoint /api/v1
├── database/migrations/ seeders/ factories/
└── tests/Feature/                 # feature tests per modul
```

Detail per komponen:

- **Routes:** grouped di `api.php`: prefix `/api/v1`; group `public` dan `admin` (middleware `auth:sanctum` + permission).
- **Controllers:** `Api\*` untuk public, `Api\Admin\*` untuk CMS. Thin — validasi di Request, aturan di model/policy.
- **Requests (FormRequest):** validasi per aksi (Store/Update). Error → 422 dengan struktur field.
- **Resources:** ApiResource mengatur bentuk output, menghapus atribut sensitif, menambah computed field (misal `thumbnail_url`).
- **Models:** Eloquent + `$fillable` (mass assignment protection) + casts (json, date).
- **Services:** HANYA bila logika lintas-model kompleks (contoh: publish service blog). CRUD sederhana → controller langsung.
- **Policies:** enforce akses per resource; dipanggil di controller admin + middleware.
- **Middleware:** `auth:sanctum`; wrapper permission (atau pakai mekanisme Spatie `middleware('permission:...')`).
- **Exceptions:** render JSON konsisten: 400/401/403/404/422/429/500.
- **Validation:** FormRequest (rule Laravel) + `unique` slug.
- **Authentication:** Sanctum token.
- **Authorization:** Spatie Permission + Policies.

Skala yang dihindari: Repository Pattern, Queue berat (kecuali mailing), Event kompleks. Portfolio + CMS tidak membutuhkan.

---

## 17. API Architecture

### 17.1 Convention REST
| Method | Penggunaan |
|---|---|
| GET | Membaca resource (list/detail) |
| POST | Membuat resource baru (atau aksi khusus: login, contact, upload) |
| PUT | Mengganti resource (update full) |
| PATCH | Update parsial |
| DELETE | Menghapus resource |

### 17.2 Keputusan
- **Versioning:** prefix `/api/v1` di URL. Major version saja (v1). Minor change tanpa break → tambah field, tidak ganti versi.
- **Endpoint naming:** resource plural (`/api/v1/projects`), detail by identifier.
- **Resource yang punya slug publik:** detail = `/api/v1/{resource}/{slug}`. **Identifier admin:** `{id}` (numeric PK) untuk list/update/delete admin.
- **Status codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthenticated, 403 Forbidden, 404 Not Found, 422 Validation, 429 Too Many Requests, 500 Server Error.
- **Pagination:** page-based via query `?page=`, `?per_page=`.
- **Filtering/Sorting/Search:** query params: `?status=`, `?category=`, `?featured=`, `?search=`, `?sort=`, `?order=`.

### 17.3 Blueprint Endpoint (high-level; bukan implementation)

**Public:**

```
GET    /api/v1/site                       → settings public
GET    /api/v1/profile                    → profile + sosial + resume
GET    /api/v1/skills                     → skill active
GET    /api/v1/projects                   → project published (opsi ?featured=1)
GET    /api/v1/projects/{slug}            → detail project published
GET    /api/v1/experience                 → experience active
GET    /api/v1/education                  → education active
GET    /api/v1/certificates               → certificates active
GET    /api/v1/blog                       → posts published (paginasi, ?category=, ?search=)
GET    /api/v1/blog/{slug}                → detail post published
GET    /api/v1/blog/categories            → daftar kategori (dengan jumlah satu)
POST   /api/v1/contact                    → simpan contact message
GET    /sitemap.xml                       → sitemap konten published
GET    /robots.txt                        → dari settings
```

**Auth:**

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout                (auth:sanctum)
GET    /api/v1/auth/me                    (auth:sanctum - user + roles + permissions)
```

**Admin (auth:sanctum + permission):**

```
GET    /api/v1/admin/dashboard                 dashboard.view
PUT    /api/v1/admin/profile                   profile.update

GET    /api/v1/admin/projects                  projects.view
POST   /api/v1/admin/projects                  projects.create
GET    /api/v1/admin/projects/{id}             projects.view
PUT    /api/v1/admin/projects/{id}             projects.update
DELETE /api/v1/admin/projects/{id}             projects.delete

GET    /api/v1/admin/skills                    skills.view
POST   /api/v1/admin/skills                    skills.create
PUT    /api/v1/admin/skills/{id}               skills.update
DELETE /api/v1/admin/skills/{id}               skills.delete

GET/POST/PUT/DELETE  /api/v1/admin/experience...   experience.*
GET/POST/PUT/DELETE  /api/v1/admin/education...    education.*
GET/POST/PUT/DELETE  /api/v1/admin/certificates... certificates.*

GET    /api/v1/admin/blog                      posts.view
POST   /api/v1/admin/blog                      posts.create
PUT    /api/v1/admin/blog/{id}                 posts.update
DELETE /api/v1/admin/blog/{id}                 posts.delete
(opsi status + kategori + tags via resource ini)

GET    /api/v1/admin/media                     media.view
POST   /api/v1/admin/media                     media.upload (multipart)
DELETE /api/v1/admin/media/{id}                media.delete

GET    /api/v1/admin/messages                  messages.view
PUT    /api/v1/admin/messages/{id}/read        messages.update
DELETE /api/v1/admin/messages/{id}             messages.delete

PUT    /api/v1/admin/seo                       seo.update
GET    /api/v1/admin/seo                       seo.view
PUT    /api/v1/admin/settings                  settings.update
GET    /api/v1/admin/settings                  settings.view
```

Ini API blueprint. Implementation dilakukan fase backend.

---

## 18. API Response Standard

**Success:**

```json
{
  "success": true,
  "message": "Resource berhasil disimpan",
  "data": { }
}
```

**Success list + pagination:**

```json
{
  "success": true,
  "message": "List resource",
  "data": [ { } ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 42,
    "last_page": 5
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error yang ramah",
  "errors": { }
}
```

- `errors` berisi map field → array pesan untuk 422.
- `errors` kosong (`{}`) untuk error non-validation (401, 403, 404, 429, 500).
- Konsisten di seluruh endpoint via helper `ApiResponse` + exception renderer tunggal.

---

## 19. Authentication Flow

```text
Admin/Editor
    ↓
Login Page (/admin/login)
    ↓
React: POST /api/v1/auth/login  (kredensial)
    ↓
Laravel Sanctum
    ↓
Credential Validation (email + password bcrypt)
    ↓
Throttle check (max attempts)
    ↓
Authenticated → terbitkan Personal Access Token
    ↓
Response: token + user + roles + permissions
    ↓
React simpan auth state → redirect /admin
```

- **Login:** `POST /api/v1/auth/login`, throttle (contoh `3/min` per IP saat gagal).
- **Logout:** `POST /api/v1/auth/logout` (auth:sanctum) → revoke token → hapus state lokal → kembali ke `/admin/login`.
- **Session/token strategy:** Personal Access Token (Sanctum). Frontend menyimpan token di `localStorage` (v1). *(TBD / Future Decision: httpOnly cookie + CSRF untuk hardening produksi — dievaluasi di fase deployment.)*
- **Authentication state:** `AuthContext` menyimpan token + user + roles/permissions; `isAuthenticated` + `hasPermission` untuk UI.
- **Unauthorized response:** 401 → frontend redirect ke `/admin/login`.
- **Session expiration:** scrub token (revoke + hapus). Tanpa sliding timeout v1. *(Token tidak punya expired default; TBD/Future: tambah `expires_at` jika dibutuhkan.)*
- **Protected routes:** guard di router admin (`/admin/*`) memeriksa token + redirect; backend tetap enforce (auth:sanctum + permission).

---

## 20. Authorization Flow

```text
Request (dari React, dilampirkan Bearer token)
    ↓
1. Authentication  — auth:sanctum (siapa user-nya)
    ↓
2. Authorization   — apakah user punya akses modul (role → permission)
    ↓
3. Permission Check — Spatie middleware/policy per aksi (view/create/update/delete)
    ↓
4. Business Logic  — controller/service
    ↓
5. Response        — JSON (data atau 403)
```

- Role adalah kumpulan permission (Spatie). Admin punya semua permission; Editor hanya sebagian (Bagian 12).
- Enforce: **selalu di backend**. Middleware `permission:projects.create` pada route admin; Policy untuk aturan object-level (misal hanya owner yang edit — tidak relevan di single-owner, tapi policy dipakai untuk kejelasan).
- Frontend hanya UX: menyembunyikan menu tanpa permission. Tidak ada data rahasia yang diberikan tanpa otorisasi backend.

---

## 21. CMS Flow

**Create / Update Content (contoh project/blog):**

```text
Admin/Editor
    ↓
CMS (menu sesuai permission)
    ↓
Form input
    ↓
React → API (Bearer token)
    ↓
Authentication (auth:sanctum)
    ↓
Authorization (permission module + action)
    ↓
Validation (FormRequest → 422 jika invalid)
    ↓
Business Logic (publish_at, slug unique, media attach)
    ↓
Database (SQL)
    ↓
Response JSON → React toast sukses + re-fetch list
```

**Read Content:** admin melihat termasuk draft/archived (semua status) sesuai permission.

**Delete Content:** konfirmasi frontend → `DELETE` → hapus data (hard delete v1). *(Soft delete = TBD/Future.)*

**Publish Content:** ubah status → `published` + set `published_at` (blog pertama kali). Langsung tampil public.

**Archive Content:** ubah status → `archived` → hilang dari public, tetap tersimpan di DB dan tetap terlihat di CMS.

---

## 22. Public Website Flow

```text
Visitor
    ↓
React Page (public route)
    ↓
TanStack Query → GET /api/v1/{resource}
    ↓
Laravel public controller → query scope published/active only
    ↓
Database → published content
    ↓
JSON response
    ↓
React UI render (loading/error/empty/done)
```

**Draft TIDAK muncul di public:**

- Semua public controller memakai scope `published` (blog/project) atau `is_active` (skill/experience/education/certificate).
- Detail endpoint memvalidasi status — draft/archived → 404 (bukan leak 403 kepada visitor; slug tidak valid secara publik).
- Backend adalah penjamin; frontend tidak pernah meminta status non-published ke public API.

---

## 23. Content Lifecycle

**Blog/Projects (status):**

```
Draft ──▶ Published ──▶ Archived
  ▲          │              │
  └──────────┴──────────────┘  (dapat dikembalikan)
```

| Pertanyaan | Keputusan |
|---|---|
| Siapa membuat draft? | Admin & Editor (dengan permission module) |
| Siapa publish? | Admin & Editor (permission module) |
| Siapa archive? | Admin & Editor (permission module) |
| Apakah Editor dapat publish? | Ya, untuk modul yang diberikan (keputusan sederhana; lihat Bagian 12) |
| Apakah archived dapat dikembalikan? | Ya — ubah status kembali ke draft/published di CMS |
| Draft tampil di public? | Tidak |
| Archive tampil di public? | Tidak |

**Content pendukung (skill/experience/education/certificate):** status boolean `is_active`.

**Contact message:** `unread → read`; hapus permanen.

---

## 24. Project Management Requirement

| Aspek | Spesifikasi |
|---|---|
| Create/Edit/Delete | CRUD via CMS admin, permission `projects.*` |
| Publish/Archive | Field `status` (draft/published/archived); hanya published tampil public |
| Featured | Field boolean `is_featured`; home menampilkan project featured |
| Ordering | Field `sort_order`; list admin bisa diurutkan |
| Slug | Otomatis dari title, unique, dipakai `/projects/{slug}` |
| Short description | `summary` — pembatas kartu |
| Description | `description` — halaman detail |
| Technologies | List berbentuk JSON (`tech_stack`); ditampilkan sebagai tag |
| GitHub URL | Valid URL opsional |
| Demo URL | Valid URL opsional |
| Thumbnail | `thumbnail` — media; wajib saat publish |
| Gallery | `gallery` — daftar media opsional |
| Start/End date | `start_date`, `end_date`; kategori selesai/ongoing dari `status` project atau tanggal |
| Public detail page | `/projects/{slug}` (FR-05) wajib ada |

---

## 25. Blog Requirement

| Aspek | Spesifikasi |
|---|---|
| Status | `draft`, `published`, `archived` |
| Category | Satu kategori per post (enum category string versi v1: list kategori dari `categories`; media fleksibel) |
| Tags | Banyak tag per post (`tags` JSON pada `posts` + tabel `post_tags` untuk relasi — detail di Phase 2) |
| Slug | Unique; URL `/blog/{slug}` |
| Featured image | `cover_image` — media |
| Content | `body` (konten panjang; v1: plain text/HTML sederhana yang disanitasi; WYSIWYG = TBD/future) |
| Excerpt | `excerpt` — ringkasan kartu/list |
| Published date | `published_at` — di-set otomatis saat publish pertama; publik hanya tampil jika `published_at ≤ now` |
| Author | Kolom author (default = pemilik) |

**Aturan publish:** saat status berubah ke `published` dan `published_at` kosong → set `published_at = now`. `body` wajib terisi saat publish (boleh kosong saat draft).

---

## 26. Media Requirement

| Aspek | Spesifikasi |
|---|---|
| Upload | lewat CMS Media Management; multipart ke `POST /api/v1/admin/media` |
| View | Grid CMS + URL publik dari storage |
| Delete | Hapus file fisik + metadata (`media.delete`) |
| Validasi type | Gambar (jpg/jpeg/png/webp/gif) v1; dokumentasi opsional (pdf) — *TBD/Future: pdf untuk resume* |
| Validasi MIME | Whitelist: `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| Validasi extension | `jpg, jpeg, png, webp, gif` |
| Ukuran file | Maks 2 MB per gambar |
| Dimensi | Minimal validasi dasar saat upload (misal `image` murni, bukan polyglot); resize/optimasi meg = **TBD / Future Decision** |
| Storage | Disk `public` (storage lokal, symlink `storage:link`) — cocok cPanel v1 |
| Naming | Hashed/random nama file (UUID/hash) + ekstensi asli — mencegah path traversal & collision |
| Access | URL publik di `storage/`; file bukan eksekusi (MIME validated), upload hanya via CMS |
| Security | Tidak pernah menyimpan executable; ekstensi di luar whitelist ditolak 422 |

---

## 27. Contact Message Requirement

**Visitor:**
- Isi form: name, email, subject, message.
- Submit → `POST /api/v1/contact`.
- Sistem: validasi input (format email, panjang), rate limit (contoh `5/min/IP`), simpan message (status `unread`), return success/error.

**Admin:**
- View daftar pesan (paginasi, status filter).
- Mark as read / unread.
- Delete jika diperlukan (`messages.delete` → Admin).
- Editor: view + mark read (`messages.view`, `messages.update`).

---

## 28. SEO Requirement

| Komponen | Spesifikasi |
|---|---|
| Meta title | Per halaman: profile/home, project (seo_title), post (seo_title); fallback ke settings |
| Meta description | Per halaman; fallback settings |
| Canonical URL | URL absolut per halaman (dari frontend) |
| Open Graph | og:title, og:description, og:image, og:type, og:url — default dari settings, spesifik dari konten |
| Twitter/X | twitter:card, twitter:title, twitter:description, twitter:image |
| Sitemap | `/sitemap.xml` — daftar URL published (home, static pages, projects, posts) dari backend |
| robots.txt | Disajikan backend dari `site_settings` (bisa diedit via SEO Management) |
| Structured data | JSON-LD: `Person` (profile/home), `CreativeWork` (project detail), `Article` (blog detail) |
| Semantic HTML | header, nav, main, section, article, footer, heading hierarchy |
| Slug | URL publik slug-based (proyek & blog) |
| Image alt | Alt text disimpan di media + manual pada konten |
| Internal linking | Nav + cross-link project/blog ke halaman lain |

**Konten dengan SEO metadata sendiri:** projects (`seo_title`, `seo_description`, `seo_og_image`) dan posts (`seo_title`, `seo_description`, `seo_og_image`). Lainnya pakai default settings + profile image.

---

## 29. Error Handling Strategy

| Error | Kategori | Backend | Frontend |
|---|---|---|---|
| 400 | Bad request (malformed) | Response JSON `{success:false,message}` | Show pesan error |
| 401 | Unauthenticated | Token invalid/absent | Redirect `/admin/login`, hapus auth state |
| 403 | Forbidden | Permission/policy rejected | Show "Anda tidak berhak"; sembunyikan aksi |
| 404 | Not Found | Slug/id tidak ada | Render 404 page (public) / toast (CMS) |
| 422 | Validation | `errors` map field | Tampilkan error per-field di form |
| 429 | Rate limit | Throttle | Show pesan "Terlalu banyak permintaan"; retry backoff |
| 500 | Server error | Log laravel; pesan generik (tanpa stack trace), `APP_DEBUG=false` di prod | Show generic error state + retry |

Frontend menyediakan 4 state di setiap data/aksi:

- **Loading state:** spinner/skeleton.
- **Empty state:** tidak ada data → komponen EmptyState.
- **Error state:** pesan dari API + tombol retry.
- **Success state:** toast sukses + refresh data.

---

## 30. Data Flow

### View Projects

```text
Visitor → /projects → axios GET /api/v1/projects
  → auth? none → scope published → MySQL
  → JSON list → TanStack cache → render kartu
```

### Create Project

```text
Admin → /admin/projects/new → form (token)
  → POST /api/v1/admin/projects
  → auth:sanctum → permission projects.create → validation (FormRequest)
  → slug generator → simpan projects (+ tech_stack JSON)
  → 201 + data → React toast → redirect list
```

### Update Project

```text
Admin → /admin/projects/{id}/edit → form prefill
  → PUT /api/v1/admin/projects/{id}
  → auth → permission projects.update → validation (unique slug ignore id)
  → update row → 200 data → React toast
```

### Delete Project

```text
Admin → konfirmasi hapus → DELETE /api/v1/admin/projects/{id}
  → auth → permission projects.delete → hapus row
  → 200 → hapus dari cache list
```

### Publish Project

```text
Admin → ubah status=published → PUT /api/v1/admin/projects/{id}
  → auth → permission projects.update → validasi required saat publish
  → set published_at → simpan → tampil di /projects
```

### Login

```text
Admin → /admin/login → POST /api/v1/auth/login
  → throttle → kredensial → bcrypt check → Sanctum token
  → response token+user+roles → AuthContext → /admin
```

### Logout

```text
Admin → klik logout → POST /api/v1/auth/logout (token)
  → revoke token → hapus localStorage → /admin/login
```

### Send Contact Message

```text
Visitor → /contact → form → POST /api/v1/contact
  → throttle → validation → simpan unread → 201
  → React toast sukses → kosongkan form
```

### Create Blog

```text
Editor → /admin/blog/new → form + kategori/tags
  → POST /api/v1/admin/blog → auth → permission posts.create
  → slug → simpan (status draft) → 201 → toast
  → (publish) → status published → published_at → tampil /blog
```

### Upload Media

```text
Admin → /admin/media → pilih file
  → POST /api/v1/admin/media (multipart)
  → auth → permission media.upload → validasi MIME/ext/size
  → simpan file ke storage + metadata ke tabel media
  → 201 + url → grid media update
```

---

## 31. Security Boundary

| Boundary | Scope | Perlindungan |
|---|---|---|
| **Public API** | `/api/v1/site`, profile, skills, projects, experience, education, certificates, blog, contact, sitemap, robots | Read-only published; throttle pada contact; tanpa auth |
| **Protected API (auth)** | `/api/v1/auth/me`, logout | auth:sanctum |
| **Admin API** | `/api/v1/admin/*`, login | auth:sanctum + permission per action |
| **Authentication boundary** | Sanctum token; verifikasi & revoke | token tidak pernah di-log; password bcrypt |
| **Authorization boundary** | Spatie permission + policy | enforce di controller/middleware; frontend hanya UI |
| **Validation boundary** | Semua input FormRequest + unique slug + ukuran file | 422; data invalid tidak pernah sampai DB |
| **File upload boundary** | Media management | whitelist MIME/ext, size cap, random filename, storage non-eksekusi |
| **Database boundary** | MySQL | Hanya Eloquent yang akses; mass assignment `$fillable`; secret via env |

---

## 32. Frontend Route Strategy

**Public (PublicLayout):**

```text
/                    → Home
/about               → About
/skills              → Skills
/projects            → Projects
/projects/:slug      → Project Detail
/experience          → Experience
/education           → Education
/certificates        → Certificates
/blog                → Blog
/blog/:slug          → Blog Detail
/contact             → Contact
/404                 → NotFound (fallback `*`)
```

**CMS (AuthLayout + guard):**

```text
/admin/login         → Login (tanpa guard)
/admin               → Dashboard
/admin/profile       → Profile
/admin/projects      → Projects list (+ create/edit: /admin/projects/new, /admin/projects/:id/edit)
/admin/skills        → Skills
/admin/experience    → Experience
/admin/education     → Education
/admin/certificates  → Certificates
/admin/blog          → Blog list (+ new, /:id/edit)
/admin/media         → Media
/admin/messages      → Messages
/admin/seo           → SEO
/admin/settings      → Settings
```

Guard: tanpa token → redirect `/admin/login`; route tanpa permission → halaman/aksi disembunyikan + backend 403.

---

## 33. Backend API Route Strategy

Lihat blueprint lengkap di Bagian 17.3. Prinsip:

- Prefix `/api/v1` pada seluruh endpoint API (`Route::prefix('v1')`).
- Public group entrypoint sendiri; admin group pakai middleware `['auth:sanctum']` + permission per resource via Spatie `->middleware('permission:...')`.
- Slug untuk detail publik; id untuk admin CURUD.
- `/sitemap.xml` dan `/robots.txt` sebagai route terpisah (di luar `/api`) agar URL root.

---

## 34. Database Planning (high-level entity)

> Detail schema, kolom, tipe, index, FK, normalisasi → **Phase 2 (Database Design & Data Model)**.

```text
users ──< roles (via model_has_roles)
users ──< permissions (via model_has_permissions)   [Spatie]
roles ──< permissions (via role_has_permissions)

profiles ──(1:1) users?  → Single record (owner profile; boleh tanpa relasi hard ke users,
                            cukup 1 record seeded)
profiles ──< media (1:n) foto/resume       [opsional; bisa pakai path string]

skills (1:many sendiri? no → flat list)

projects ──< media (thumbnail/gallery, relasi media morphs = TBD: morphMany vs kolom)
projects ──(tech stack: JSON kolom atau tabel project_technologies → keputusan Phase 2)
projects ──(1:n? status) 
experiences
educations
certificates ──< media (image)

posts ──< media (cover)
categories ──< posts (1:n)
tags ──< posts (n:n via post_tags)
post_tags (pivot)

media (polymorphic morphable? atau global pool dengan id di kolom konten → keputusan Phase 2)
contact_messages
site_settings (key-value, JSON value)
seo_metadata (opsional terpisah ATAU kolom di projects/posts → keputusan Phase 2: kolom per konten lebih sederhana)
activity_logs
personal_access_tokens (Sanctum)
```

**Keputusan konseptual (untuk Phase 2):**
- `users`, `roles`, `permissions` + pivot — Spatie convention.
- `profiles` single row.
- `projects`: tech stack sebagai JSON (`tech_stack`) — portfolio scale; tabel `project_technologies` **TBD/Future** bila butuh query per teknologi.
- `posts` + `categories` + `tags` + `post_tags`.
- Media: pool `media` + referensi id dari konten; relasi morph **keputusan Phase 2**.
- SEO metadata: kolom langsung di `projects`/`posts` + defaults di `site_settings` (validation dokumen arsitektur, bukan tabel terpisah).
- `activity_logs`: kolom (user, action, module, payload json, created_at).

---

## 35. Acceptance Criteria

Format Given / When / Then. Satu set inti per modul.

### Auth
- Given user terdaftar aktive, When user login dengan kredensial valid, Then token diterbitkan dan user diarahkan ke dashboard.
- Given user tidak autentikasi, When request ke `/api/v1/admin/*`, Then respon 401.
- Given token valid tapi tanpa permission, When request aksi terlarang, Then respon 403.

### Profile
- Given Admin login, When update profile valid, Then profile tersimpan dan tampil di public.
- Given Editor login, When mencoba update profile, Then respon 403.

### Projects
- Given Admin login, When membuat project valid, Then project tersimpan (201).
- Given visitor membuka project detail, When project berstatus published, Then project dapat ditampilkan.
- Given project berstatus draft, When visitor membuka public project listing, Then project tidak ditampilkan.
- Given project archived, When visitor membuka slug-nya, Then respon 404.
- Given slug sudah dipakai project lain, When create/update memakai slug itu, Then 422 (integrity slug).
- Given Admin, When mempublish project tanpa thumbnail, Then 422.

### Skills / Experience / Education / Certificates
- Given admin login, When CRUD valid, Then data tersimpan dan public menampilkan yang `is_active`.
- Given admin set `is_active=false`, When visitor membuka public page, Then item tersebut tidak tampil.

### Blog
- Given Editor login, When membuat post draft, Then tersimpan dan tidak tampil di `/blog`.
- Given Editor, When publish post, Then `published_at` terisi dan post tampil di `/blog`.
- Given post archived, When visitor membuka slug-nya, Then 404.
- Given post publish tanpa body, Then 422.

### Media
- Given admin upload file gambar valid (≤2MB, MIME whitelist), Then file tersimpan dan metadata tercatat.
- Given upload file ekstensi tidak di whitelist, Then 422.
- Given upload file >2MB, Then 422.
- Given user tanpa `media.delete`, Then hapus media → 403.

### Messages
- Given visitor submit pesan valid, Then pesan tersimpan (status unread).
- Given submit terlalu cepat (melebihi rate limit), Then 429.
- Given Admin, When menandai read/unread dan hapus, Then status sesuai.

### SEO & Settings
- Given Admin, When update settings/SEO, Then nilai baru dipakai public meta dan `/robots.txt`.
- Given Editor, When mencoba update settings/SEO, Then 403.

### Security
- Given input mass-assignment tidak termasuk `$fillable`, When payload berisi field terlarang, Then field terlarang diabaikan.
- Given production (`APP_DEBUG=false`), When terjadi 500, Then respon tanpa stack trace/secret.

### Public consistency
- Given seluruh API public, When dipanggil tanpa token, Then data published/active tersedia (kecuali contact).

---

## 36. Phase 1 Success Criteria

- [x] Requirement terdokumentasi (FR + NFR).
- [x] Functional requirement jelas (public + CMS).
- [x] Non-functional requirement jelas (performance, security, availability, scalability, maintainability, usability, accessibility, SEO, compatibility, responsive).
- [x] User stories tersedia.
- [x] Use cases tersedia.
- [x] User roles tersedia.
- [x] Permission matrix tersedia.
- [x] Module boundaries tersedia.
- [x] System architecture tersedia.
- [x] Frontend architecture tersedia.
- [x] Backend architecture tersedia.
- [x] API architecture tersedia.
- [x] Authentication flow tersedia.
- [x] Authorization flow tersedia.
- [x] CMS flow tersedia.
- [x] Public website flow tersedia.
- [x] Data flow tersedia.
- [x] Security boundary tersedia.
- [x] SEO requirement tersedia.
- [x] Error handling strategy tersedia.
- [x] High-level database entities tersedia.
- [x] Acceptance criteria tersedia.

---

## 37. Phase 1 Definition of Done

- [x] `docs/02_REQUIREMENT_AND_ARCHITECTURE.md` dibuat.
- [x] Semua requirement utama terdokumentasi.
- [x] Tidak ada requirement penting ambigu tanpa label TBD (label TBD dipakai: user management UI, abort/final refresh, WYSIWYG, react-hook-form, image resize, pdf media, soft delete, httpOnly cookie, token expiry).
- [x] Arsitektur React + Laravel + MySQL ditentukan.
- [x] Role dan permission ditentukan.
- [x] API architecture ditentukan.
- [x] Authentication flow ditentukan.
- [x] Authorization flow ditentukan.
- [x] CMS workflow ditentukan.
- [x] Public workflow ditentukan.
- [x] Database entity ditentukan secara high-level.
- [x] Acceptance criteria ditentukan.
- [x] Tidak ada application code yang dibuat.
- [x] Tidak ada migration yang dibuat.
- [x] Tidak ada API implementation yang dibuat.
- [x] Tidak ada React component yang dibuat.
- [x] Tidak ada authentication implementation yang dibuat.

---

## 38. Output Format

Dokumen ini (`docs/02_REQUIREMENT_AND_ARCHITECTURE.md`) memenuhi: Bahasa Indonesia, profesional, terstruktur, detail, readable, Markdown, tabel & diagram ASCII, konsisten dengan Phase 0.

---

## 39. Final Response (ringkasan)

Status & ringkasan disajikan pada pesan terpisah setelah dokumen. (Lihat output status di bawah dokumen ini pada entregable fase.)

---

## 40. Next Phase

**PHASE 2 — DATABASE DESIGN & DATA MODEL**

Ruang lingkup Phase 2:

- Entity
- Attribute
- Primary Key
- Foreign Key
- Relationship
- Cardinality
- Index
- Constraint
- Normalization
- ERD
- Database Naming Convention
- Database Integrity
- Migration Planning

Phase 2 BELUM dikerjakan. Tunggu instruksi berikutnya. Jangan lanjut otomatis.

---

## Lampiran — Daftar TBD / Future Decision

| Item | TBD pada |
|---|---|
| UI User Management (create/update user, assign role) | Fase deployment / future module |
| Hardening produksi: httpOnly cookie auth | Fase deployment |
| Token expiry (expires_at + refresh) | Future |
| WYSIWYG editor (vs plain) | Fase frontend |
| react-hook-form / form library | Fase frontend |
| Image resize/optimization server-side | Future (performance) |
| Media PDF (resume upload) | Fase media |
| Soft delete / restore & trash | Future |
| UI activity log viewer | Future |
| Moderasi 2 tahap publish (multi-author) | Future |
| Tabel `project_technologies` terpisah | Phase 2 keputusan |
| Polymorphic media relation | Phase 2 keputusan |
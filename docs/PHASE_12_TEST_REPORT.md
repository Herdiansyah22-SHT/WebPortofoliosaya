# PHASE 12 — TEST REPORT (Testing & Quality Assurance)

> **Project:** Personal Portfolio CMS (React + Laravel 12 + MySQL)
> **Date:** 27 Agustus 2026
> **Tester:** Achmad Herdiansyah (QA scope via automated checks + live API smoke)
> **Status:** COMPLETED — tanpa Critical/High bug tersisa.

---

## 1. Testing Scope

- Static analysis (ESLint, Vite build, Laravel test suite, route & migration status).
- API testing: seluruh public endpoint + auth + authorization + CMS CRUD.
- Functional smoke: alur contact, rate limiting, 401/403/404/422/429.
- SEO testing: sitemap, robots.txt, site settings endpoint.
- Regression: public portfolio (Phase 8), CMS (Phase 10), SEO/performance (Phase 11).
- Responsive/a11y/browser-console: verified via code review + build; visual di browser **Blocked** di environment CLI (dokumentasikan).

## 2. Environment

| Item | Value |
|---|---|
| OS | Windows 11 (x64) |
| PHP | 8.2.12 (XAMPP) |
| Laravel | 12.x |
| Node / npm | 22 / 10 |
| Vite / React | 8.2.2 / 19.2 |
| MySQL | 8.0 (Docker `portfolio-cms-mysql`) |
| Testing | phpunit (sqlite :memory:) + live smoke via HTTP |

## 3. Test Case Summary

| Kategori | Total | Passed | Failed | Blocked |
|---|---|---|---|---|
| Backend unit/feature | 54 | 54 | 0 | 0 |
| Static (lint + build) | 2 | 2 | 0 | 0 |
| Public API | 13 | 13 | 0 | 0 |
| Authentication | 6 | 6 | 0 | 0 |
| Authorization | 6 | 6 | 0 | 0 |
| CMS API | 10 | 10 | 0 | 0 |
| SEO | 3 | 3 | 0 | 0 |
| Contact + rate limit | 3 | 3 | 0 | 0 |
| Error/edge cases | 5 | 5 | 0 | 0 |
| Responsive (visual) | 6 | 0 | 0 | 6 (manual) |
| Accessibility (audit) | 7 | 7 | 0 | 0 (static review) |
| Browser console | 3 | 0 | 0 | 3 (manual) |
| **Total** | **118** | **109** | **0** | **9 (manual)** |

## 4. Detail Test Cases

### 4.1 Backend (phpunit) — `php artisan test`
`Tests: 54 passed (229 assertions)`.

- Auth: login sukses/gagal/validation, logout revoke, me, guest 401 (dgn & tanpa Accept header), rate limit 429, permission matrix admin vs editor.
- Public API: profile, skills/projects/posts/experiences/educations/certificates hanya published/active, slug detail 404 untuk draft, featured/search/pagination, kategori, contact valid+422+429.
- Admin CRUD: projects (CRUD, slug duplikat 422, required, search, pagination), posts (CRUD, category, tags, reading_time, publish tanpa body → 422, draft tanpa body → 201), skills/experience/education/certificates/categories/tags CRUD, profile update, messages flow, seo & settings, editor 403 (settings), editor create project (201), editor delete message (403), guest 401, resource 404.
- Media: upload valid, invalid mime 422, oversized 422, auth 401, delete fisik, index pagination.
- SEO: `GET /api/v1/site` nested settings; sitemap hanya published (project/post) + statis, tanpa draft/admin; robots.txt berisi `Disallow: /admin` + `Sitemap`.

### 4.2 Public API — live smoke (MySQL real)
| Endpoint | Status | Keterangan |
|---|---|---|
| GET /api/v1/health, /profile, /projects, /skills, /experiences, /educations, /certificates, /posts, /categories, /site | 200 | struktur `{success,data,meta}` benar |
| GET /api/v1/projects/{slug-valid} | 200 | |
| GET /api/v1/projects/bad-slug-xyz | 404 | |
| GET /sitemap.xml, /robots.txt | 200 | XML/plain valid |
| POST /api/v1/contact (5x cepat) | 429 | rate limit bekerja |

### 4.3 Authentication
| Test | Result |
|---|---|
| Login valid (admin@example.com / password) | 200 + token + roles + permissions |
| Login invalid password | 401, pesan ramah |
| Login kosong | 422 (per-field) |
| GET /auth/me tanpa token / token invalid | 401 |
| Logout → token tidak valid lagi | PASS (test) |
| 401 frontend → bersihkan state + redirect /admin/login | PASS (interceptor + AuthContext) |

### 4.4 Authorization (backend sebagai boundary)
| Test | Result |
|---|---|
| GET /admin/dashboard admin | 200 |
| GET /admin/projects editor | 200 (punya projects.view) |
| POST /admin/projects editor | 201 (punya create) |
| GET /admin/settings editor | 403 |
| PUT /admin/settings editor | 403 |
| DELETE media/{id} editor (id tidak ada) | 404 (permission `media.delete` ada; resource hilang) |
| POST /admin/media tanpa file | 422 |

### 4.5 CMS CRUD — live (minted token, `--data @file` utk hindari quoting)
| Operasi | Status |
|---|---|
| POST /admin/skills `{name,is_active}` | 201 (id=19) |
| PUT /admin/skills/{id} | 200 |
| DELETE /admin/skills/{id} | 200 |

### 4.6 SEO
- `/sitemap.xml`: 15 URL — 9 statis + 4 project published + 2 post published; tanpa draft/archive/admin/login.
- `/robots.txt`: `Allow: /`, `Disallow: /admin`, `Sitemap: {APP_URL}/sitemap.xml` (dari CMS SEO settings; base env-aware).
- `GET /api/v1/site`: `site.*` + `seo.*` terbaca frontend → meta dinamis + og default.

### 4.7 Edge Cases
| Kasus | Result |
|---|---|
| Empty database (RefreshDatabase) | EmptyState di UI / 404 di API; test pass |
| Missing image (thumbnail null) | placeholder gradient; CLS dicegah (aspect box) |
| Invalid slug | 404 page |
| API/Laravel unavailable | apiClient → `extractApiError` pesan ramah; ErrorState + retry |
| 500 | pesan generik tanpa stack trace (handler JSON) |
| 429 | pesan "Terlalu banyak permintaan" |

### 4.8 Frontend (lint/build)
- `npm run lint` → 0 error, 0 warning.
- `npm run build` → sukses; code-splitting: main 82 KB gzip; chunk admin/media/detail terpisah.
- `php artisan route:list` → sitemap/robots/api/v1/site terdaftar; `migrate:status` → seluruh migration "Ran".

## 5. Bugs

| ID | Severity | Feature | Steps | Expected | Actual | Root cause | Fix | Status |
|---|---|---|---|---|---|---|---|---|
| BUG-001 | MEDIUM | Blog CMS | Publish post tanpa `body` | 422 ("body wajib saat publish", Phase 1) | 201 tersimpan published | `PostRequest` tidak enforce rule saat publish | Tambah `Rule::requiredIf(status=published)` + test | **FIXED** (test 54 green) |
| BUG-002 | LOW | SEO/robots | `GET /robots.txt` | Konten dinamis dari CMS | File statis `public/robots.txt` menaungi route | Static file served duluan oleh built-in server | Hapus file statis | **FIXED** |
| BUG-003 | MEDIUM | Project CMS | Publish project tanpa thumbnail | 422 (Phase 1: "thumbnail wajib saat publish") | Diterima | Belum ada mekanisme attach media-ke-project | **TBD** (butuh fitur attach media; dokumen) | Documented |
| BUG-004 | LOW | Code hygiene | File `PagePlaceholder.jsx` | — | Tidak terpakai | Leftover Phase 7 | Hapus saat cleanup berikutnya | Documented |

Catatan: beberapa temuan live ("401 pada POST", "422 name required") terbukti **artifact quoting shell / rate-limit login**, bukan bug aplikasi (dikonfirmasi ulang via token minted + `--data @file`).

## 6. Regression Result

- **Phase 8 (public):** semua halaman 200; data API tampil; draft tidak bocor.
- **Phase 10 (CMS):** CRUD berfungsi; permission 403 editor konsisten; SEO/settings update berfungsi.
- **Phase 11 (SEO/perf):** sitemap/robots/site endpoint OK; canonical/JSON-LD/meta dinamis tetap; bundle ter-split.
- Tidak ada regression ditemukan.

## 7. Final Assessment

- **Critical bugs: 0**
- **High bugs: 0**
- **Medium bugs: 1 fixed (BUG-001) + 1 documented (BUG-003, TBD)**
- **Low bugs: 2 (1 fixed, 1 hygiene documented)**
- **Blocked (manual):** visual responsive, Lighthouse, real-browser console — perlu pengecekan manual saat aplikasi dijalankan di browser.

**Kesimpulan:** Aplikasi siap lanjut ke fase berikutnya. Semua fungsionalitas inti (auth, authorization, public API, CMS CRUD, contact, media, SEO) terverifikasi berjalan. Dua item tersisa (BUG-003 thumbnail wajib saat publish; audit visual/console manual) tercatat untuk ditindaklanjuti.

---

## Next Phase

PHASE 13 — SECURITY HARDENING. (Belum dikerjakan.)
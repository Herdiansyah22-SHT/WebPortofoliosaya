# PHASE 2 — DATABASE DESIGN & DATA MODEL

> **Status Dokumen:** Blueprint schema MySQL sebelum migration & implementation.
> **Acuan:** `docs/01_PROJECT_OVERVIEW.md`, `docs/02_REQUIREMENT_AND_ARCHITECTURE.md`.
> **Dibuat:** 26 Agustus 2026
> **Oleh:** Achmad Herdiansyah

Dokumen ini adalah spesifikasi lengkap database MySQL untuk Personal Portfolio CMS. Fase ini HANYA desain — tidak ada migration, model, controller, API, atau code React yang dibuat.

---

## 1. Database Overview

| Aspek | Keputusan |
|---|---|
| DBMS | MySQL 8.x |
| Engine | InnoDB (support FK + transaksi) |
| Charset | `utf8mb4` |
| Collation | `utf8mb4_unicode_ci` |
| Client | Laravel 12 Eloquent (satu-satunya akses) |
| Nama database | `portfolio_cms` |
| Primary key strategy | `BIGINT UNSIGNED` auto-increment (`bigIncrements`) |
| Polymorph | `model_type` / `model_id` — media, seo_metadata, activity_logs |
| Soft delete | TIDAK untuk v1 (hard delete; strategi didokumentasikan di Bagian 10) |

**Keputusan yang mematangkan Phase 1 (semua masuk TBD Phase 1, kini diputuskan):**

1. **`project_technologies` DIPISAH menjadi tabel normalized**, bukan JSON `tech_stack`. Alasan: scope Phase 2 mewajibkan entitas; mendukung query per teknologi, indexing, dan referential integrity. Migration akan tanpa kolom JSON `tech_stack`.
2. **`seo_metadata` DIPAKAI sebagai tabel morphable 1:1** dibanding kolom duplikat di `projects`/`posts`. Alasan: scope Phase 2 mewajibkan entitas; menghindari duplikasi kolom SEO di banyak tabel; satu pola untuk projects, posts, profile. Default global tetap di `site_settings`.
3. Relasi media memakai **polymorphic** (`model_type`/`model_id` + kolom `collection`), sesuai analisis Phase 1.

**Skala:** single-owner. Tidak ada multi-tenant untuk CMS ini. Schema diperkirakan berjumlah max puluhan ribu row — tanpa partitioning.

---

## 2. Entity List

| # | Tabel | Kategori | Catatan |
|---|---|---|---|
| 1 | `users` | Auth | Laravel default |
| 2 | `roles` | Auth | Spatie |
| 3 | `permissions` | Auth | Spatie |
| 4 | `model_has_roles` | Auth | Spatie pivot |
| 5 | `model_has_permissions` | Auth | Spatie pivot |
| 6 | `role_has_permissions` | Auth | Spatie pivot |
| 7 | `personal_access_tokens` | Auth | Sanctum |
| 8 | `profiles` | Profile | Single record (seeded, id=1) |
| 9 | `skills` | Profile | |
| 10 | `experiences` | Profile | |
| 11 | `educations` | Profile | |
| 12 | `certificates` | Profile | |
| 13 | `projects` | Portfolio | |
| 14 | `project_technologies` | Portfolio | Pivot 1:n ke project |
| 15 | `categories` | Blog | |
| 16 | `tags` | Blog | |
| 17 | `posts` | Blog | Tabel blog (route publik `/blog`) |
| 18 | `post_tags` | Blog | Pivot n:n |
| 19 | `media` | Media | Polymorphic + `collection` |
| 20 | `contact_messages` | Contact | |
| 21 | `seo_metadata` | System | Polymorphic 1:1 |
| 22 | `site_settings` | System | Key-value |
| 23 | `activity_logs` | System | Polymorphic audit |

Total: **23 tabel**.

---

## 3. Table Specification

Konvensi tipe: `BID` = `BIGINT UNSIGNED`; `TS` = timestamp nullable.

### 3.1 `users` — akun untuk CMS (Admin/Editor)
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK auto | No | — | |
| name | VARCHAR(191) | No | — | |
| email | VARCHAR(191) | No | — | UNIQUE |
| email_verified_at | TS | Yes | NULL | |
| password | VARCHAR(191) | No | — | bcrypt |
| remember_token | VARCHAR(100) | Yes | NULL | |
| created_at | timestamp | No | CURRENT_TIMESTAMP | |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | |

- Relationship: 1:1 `profiles` (opsional), 1:n `activity_logs` (nullable), morph-owner of `personal_access_tokens`.
- Long process: user seeder admin + editor.

### 3.2 `roles` (Spatie) 
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| name | VARCHAR(191) | No | — | UNIQUE |
| guard_name | VARCHAR(191) | No | `web` | |
| created_at / updated_at | timestamp | No | — | |

- Seeded: `super-admin` (Admin), `editor`.

### 3.3 `permissions` (Spatie)
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| name | VARCHAR(191) | No | — | UNIQUE |
| guard_name | VARCHAR(191) | No | `web` | |
| created_at / updated_at | timestamp | No | — | |

- Seeded sesuai permission matrix Phase 1 (Bagian 12): `dashboard.view`, `profile.update`, `projects.*`, `skills.*`, `experience.*`, `education.*`, `certificates.*`, `posts.*`, `media.*`, `messages.*`, `seo.*`, `settings.*`.

### 3.4 `model_has_roles` (Spatie pivot)
| Column | Type | Nullable | Keterangan |
|---|---|---|---|
| role_id | BID | No | FK → roles (CASCADE) |
| model_type | VARCHAR(191) | No | `App\Models\User` |
| model_id | BID UNSIGNED | No | FK users |
| PK | (role_id, model_type, model_id) | | |

### 3.5 `model_has_permissions` (Spatie pivot)
| Column | Type | Nullable | Keterangan |
|---|---|---|---|
| permission_id | BID | No | FK → permissions (CASCADE) |
| model_type | VARCHAR(191) | No | |
| model_id | BID UNSIGNED | No | |
| PK | (permission_id, model_type, model_id) | | |

### 3.6 `role_has_permissions` (Spatie pivot)
| Column | Type | Nullable | Keterangan |
|---|---|---|---|
| role_id | BID | No | FK → roles (CASCADE) |
| permission_id | BID | No | FK → permissions (CASCADE) |
| PK | (role_id, permission_id) | | |

### 3.7 `personal_access_tokens` (Sanctum)
| Column | Type | Nullable | Keterangan |
|---|---|---|---|
| id | BID PK | No | |
| tokenable_type | VARCHAR(191) | No | |
| tokenable_id | BID UNSIGNED | No | morph users |
| name | VARCHAR(191) | No | label token |
| token | VARCHAR(64) | No | hash | UNIQUE |
| abilities | TEXT | Yes | JSON abilities |
| last_used_at | TS | Yes | |
| expires_at | TS | Yes | v1 nullable (TBD expiry) |
| created_at / updated_at | timestamp | No | |

### 3.8 `profiles` — single record
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | seeded id=1 |
| user_id | BID UNSIGNED UNIQUE | Yes | NULL | FK → users (SET NULL), opsional |
| name | VARCHAR(191) | No | — | |
| headline | VARCHAR(191) | No | — | Junior Web Developer |
| bio | TEXT | Yes | NULL | |
| location | VARCHAR(191) | Yes | NULL | |
| email | VARCHAR(191) | Yes | NULL | email publik/contact |
| phone | VARCHAR(32) | Yes | NULL | |
| is_available | TINYINT(1) | No | 1 | availability |
| social_links | JSON | Yes | NULL | {github, linkedin, ...} |
| resume_path | VARCHAR(191) | Yes | NULL | file PDF (TBD pdf support) |
| created_at / updated_at | timestamp | No | — | |

- Foto profil dihubungkan via `media` polymorphic `collection='profile_photo'` (1:1).
- Relationship: 1:1 `users` (optional), 1:1 `media` (photo), 1:1 `seo_metadata`.

### 3.9 `skills`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| name | VARCHAR(191) | No | — | |
| category | VARCHAR(100) | Yes | NULL | grup (Frontend/Backend/...) |
| level | SMALLINT UNSIGNED | Yes | NULL | 1–100 (persen) |
| icon | VARCHAR(100) | Yes | NULL | nama icon |
| description | TEXT | Yes | NULL | |
| sort_order | INTEGER UNSIGNED | No | 0 | |
| is_active | TINYINT(1) | No | 1 | |
| created_at / updated_at | timestamp | No | — | |

- Relationship: independent (no FK). Index: `(is_active, sort_order)`.

### 3.10 `experiences`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| company | VARCHAR(191) | No | — | |
| position | VARCHAR(191) | No | — | |
| location | VARCHAR(191) | Yes | NULL | |
| description | TEXT | Yes | NULL | |
| start_date | DATE | No | — | |
| end_date | DATE | Yes | NULL | NULL jika is_current |
| is_current | TINYINT(1) | No | 0 | |
| sort_order | INTEGER UNSIGNED | No | 0 | |
| is_active | TINYINT(1) | No | 1 | |
| created_at / updated_at | timestamp | No | — | |

- Index: `(is_active, is_current)`.

### 3.11 `educations`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| institution | VARCHAR(191) | No | — | |
| degree | VARCHAR(191) | Yes | NULL | S1 Teknik Informatika |
| field_of_study | VARCHAR(191) | Yes | NULL | |
| start_year | SMALLINT UNSIGNED | No | — | |
| end_year | SMALLINT UNSIGNED | Yes | NULL | NULL = ongoing |
| description | TEXT | Yes | NULL | |
| sort_order | INTEGER UNSIGNED | No | 0 | |
| is_active | TINYINT(1) | No | 1 | |
| created_at / updated_at | timestamp | No | — | |

### 3.12 `certificates`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| title | VARCHAR(191) | No | — | |
| issuer | VARCHAR(191) | No | — | |
| credential_id | VARCHAR(191) | Yes | NULL | |
| credential_url | VARCHAR(191) | Yes | NULL | URL verifikasi |
| issued_date | DATE | Yes | NULL | |
| expiration_date | DATE | Yes | NULL | |
| image via media | — | — | — | `collection='certificate_image'` |
| sort_order | INTEGER UNSIGNED | No | 0 | |
| is_active | TINYINT(1) | No | 1 | |
| created_at / updated_at | timestamp | No | — | |

### 3.13 `projects`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| title | VARCHAR(191) | No | — | |
| slug | VARCHAR(191) | No | — | UNIQUE, SEO URL |
| summary | VARCHAR(500) | Yes | NULL | kartu |
| description | MEDIUMTEXT | Yes | NULL | halaman detail |
| live_url | VARCHAR(191) | Yes | NULL | demo URL |
| repo_url | VARCHAR(191) | Yes | NULL | GitHub |
| status | ENUM('draft','published','archived') | No | `draft` | |
| is_featured | TINYINT(1) | No | 0 | |
| sort_order | INTEGER UNSIGNED | No | 0 | |
| start_date | DATE | Yes | NULL | |
| end_date | DATE | Yes | NULL | NULL = ongoing |
| published_at | TS | Yes | NULL | di-set saat publish |
| created_at / updated_at | timestamp | No | — | |

- Relationship: 1:n `project_technologies`; polymorphic `media` (thumbnail, gallery); 1:1 `seo_metadata`.
- Index: `(status, is_featured, sort_order)`, `published_at`.

### 3.14 `project_technologies`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| project_id | BID UNSIGNED | No | — | FK → projects (CASCADE) |
| name | VARCHAR(100) | No | — | Laravel, PHP, MySQL |
| sort_order | SMALLINT UNSIGNED | No | 0 | |
| UNIQUE | (project_id, name) | | | duplikat teknologi per project ditolak |

### 3.15 `categories`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| name | VARCHAR(100) | No | — | |
| slug | VARCHAR(191) | No | — | UNIQUE |
| sort_order | INTEGER UNSIGNED | No | 0 | |
| is_active | TINYINT(1) | No | 1 | |
| created_at / updated_at | timestamp | No | — | |

### 3.16 `tags`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| name | VARCHAR(100) | No | — | UNIQUE |
| slug | VARCHAR(191) | No | — | UNIQUE |
| created_at / updated_at | timestamp | No | — | |

### 3.17 `posts` — blog
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| author_id | BID UNSIGNED | Yes | NULL | FK → users (SET NULL) |
| category_id | BID UNSIGNED | Yes | NULL | FK → categories (SET NULL) |
| title | VARCHAR(191) | No | — | |
| slug | VARCHAR(191) | No | — | UNIQUE |
| excerpt | VARCHAR(500) | Yes | NULL | |
| body | MEDIUMTEXT | Yes | NULL | wajib saat publish |
| status | ENUM('draft','published','archived') | No | `draft` | |
| published_at | TS | Yes | NULL | set otomatis saat publish |
| reading_time | SMALLINT UNSIGNED | Yes | NULL | menit, dihitung |
| created_at / updated_at | timestamp | No | — | |

- Relationship: n:1 `categories`, n:1 `users` (author), n:n `tags` (via `post_tags`), polymorphic `media` (cover), 1:1 `seo_metadata`.
- Index: `(status, published_at)`, `category_id`, `author_id`, `slug UNIQUE`.

### 3.18 `post_tags` — pivot
| Column | Type | Nullable | Keterangan |
|---|---|---|---|
| post_id | BID | No | FK → posts (CASCADE) |
| tag_id | BID | No | FK → tags (CASCADE) |
| PK | (post_id, tag_id) | | |

### 3.19 `media`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| model_type | VARCHAR(191) | Yes | NULL | morph owner (project, post, profile, certificate) |
| model_id | BID UNSIGNED | Yes | NULL | |
| collection | VARCHAR(64) | No | `default` | thumbnail, gallery, cover, profile_photo, certificate_image |
| name | VARCHAR(191) | No | — | nama file asli |
| path | VARCHAR(191) | No | — | relatif disk (uuid.ext) |
| disk | VARCHAR(32) | No | `public` | |
| mime_type | VARCHAR(100) | No | — | |
| size | BIGINT UNSIGNED | No | 0 | byte |
| width | SMALLINT UNSIGNED | Yes | NULL | gambar |
| height | SMALLINT UNSIGNED | Yes | NULL | |
| alt_text | VARCHAR(191) | Yes | NULL | SEO/a11y |
| created_at / updated_at | timestamp | No | — | |

- Polymorph TIDAK punya FK DB (MySQL tidak enforce polymorphic); integritas ditegakkan di service layer pada delete owner (hapus media terkait). Index `(model_type, model_id)`, `collection`.
- Relationship: morphTo → projects (thumbnail/gallery), posts (cover), profiles (photo), certificates (image).

### 3.20 `contact_messages`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| name | VARCHAR(191) | No | — | |
| email | VARCHAR(191) | No | — | format email |
| subject | VARCHAR(191) | No | — | |
| message | TEXT | No | — | |
| is_read | TINYINT(1) | No | 0 | |
| read_at | TS | Yes | NULL | |
| ip_address | VARCHAR(45) | Yes | NULL | validasi & rate limit |
| user_agent | VARCHAR(255) | Yes | NULL | |
| created_at | timestamp | No | — | |

- Index: `(is_read, created_at)`.

### 3.21 `seo_metadata`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| seoable_type | VARCHAR(191) | No | — | project, post, profile |
| seoable_id | BID UNSIGNED | No | — | |
| title | VARCHAR(191) | Yes | NULL | |
| description | VARCHAR(500) | Yes | NULL | |
| og_image | VARCHAR(191) | Yes | NULL | path/URL |
| og_type | VARCHAR(64) | No | `website` | |
| canonical_url | VARCHAR(191) | Yes | NULL | TBD: dihitung frontend |
| created_at / updated_at | timestamp | No | — | |
| UNIQUE | (seoable_type, seoable_id) | | | 1:1 |

### 3.22 `site_settings`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| key | VARCHAR(100) | No | — | UNIQUE (site.name, site.tagline, seo.default_title, seo.robots_txt, dll) |
| value | JSON | No | NULL | |
| created_at / updated_at | timestamp | No | — | |

### 3.23 `activity_logs`
| Column | Type | Nullable | Default | Keterangan |
|---|---|---|---|---|
| id | BID PK | No | — | |
| user_id | BID UNSIGNED | Yes | NULL | FK → users (SET NULL), nullable utk system |
| action | VARCHAR(50) | No | — | create/update/delete/publish/archive |
| module | VARCHAR(50) | No | — | projects, posts, media ... |
| model_type | VARCHAR(191) | Yes | NULL | polymorph |
| model_id | BID UNSIGNED | Yes | NULL | |
| payload | JSON | Yes | NULL | ringkasan perubahan |
| ip_address | VARCHAR(45) | Yes | NULL | |
| created_at | timestamp | No | — | (tanpa updated_at) |

- Index: `(model_type, model_id)`, `created_at`, `user_id`.

---

## 4. Relationship

### 4.1 Ringkasan

| # | Parent | Child | Tipe | FK / Kunci | ON DELETE | ON UPDATE |
|---|---|---|---|---|---|---|
| R1 | users | profiles | 1:1 (optional) | `profiles.user_id` | SET NULL | CASCADE |
| R2 | users | activity_logs | 1:n | `activity_logs.user_id` | SET NULL | CASCADE |
| R3 | users | posts | 1:n (author) | `posts.author_id` | SET NULL | CASCADE |
| R4 | categories | posts | 1:n | `posts.category_id` | SET NULL | CASCADE |
| R5 | posts | post_tags | 1:n | `post_tags.post_id` | CASCADE | CASCADE |
| R6 | tags | post_tags | 1:n | `post_tags.tag_id` | CASCADE | CASCADE |
| R7 | posts | tags | n:n | via `post_tags` | — | — |
| R8 | projects | project_technologies | 1:n | `project_technologies.project_id` | CASCADE | CASCADE |
| R9 | (owners) | media | polymorph n:1 | `media.model_type/model_id` | app-level | app-level |
| R10 | (owners) | seo_metadata | polymorph 1:1 | `seo_metadata.seoable_*` UNIQUE | app-level | app-level |

Polymorphic (R9, R10) tidak dapat memakai FK DB; integritas dijamin service layer (saat hapus owner, hapus media & seo terkait di dalam transaksi yang sama).

---

## 5. ERD

### 5.1 ASCII — ERD konseptual

```text
┌───────────────────┐          ┌────────────────────────────┐
│      users        │          │        profiles            │
│───────────────────│          │────────────────────────────│
│ PK id             │          │ PK id (single, id=1)       │
│ name, email, ...  │──────1:1─┼ user_id (UNIQUE, nullable) │
└───────────────────┘          │ name, headline, bio, ...   │
        │1:n                        └───────────┬────────────┘
        │                                    1:1 photo
        │                                 ┌────▼─────────────┐
        └─────┐  activity_logs       ┌─────│     MEDIA       │
        │ author    (model_type/id)  │     │─────────────────│
   ┌────▼──────┐  ┌──────────────────┴───┐  │ model_type/id   │
   │  posts    │  │     seo_metadata     │  │ collection,path │
   │───────────│  │───────────────────── │  └────────────────┘
   │ PK id     │◄─┼ seoable_type/id (1:1) │
   │ author_id │  │ title, description    │
   │ category_id│ └───────────────────────┘
   │ slug/status│
   └──┬─────┬──┘
      │     │
     3│n:n  1│n                    ┌─────────────────┐
 ┌───▼─┐ ┌──▼──┐           ┌──────│  categories     │
 │tags │ │post_tags│      1:n│  ┌──│  PK id, name,  │
 │──── │ │────────│         │  │  │  slug, sort     │
 │PK id│ │PFK post_id│       │  │  └────────────────┘
 │name │ │PFK tag_id│        │  └─► (FK di posts.category_id)
 └─────┘ └─────────┘         │
   (n:n posts–tags)          │
                             │
        ┌─────────────────────┐
        │      projects       │
        │─────────────────────│
        │ PK id               │
        │ slug UNIQUE         │
        │ status, featured    │
        └─────┬──────┬────────┘
             1:n    1:n
        ┌─────▼─┐ ┌──▼──────────────┐         ┌────────────────────┐
        │project│ │ media            │         │  contact_messages   │
        │techno │ │ (polymorph)      │         │────────────────────│
        │────── │ │ model_type/id    │         │ name,email,subject,│
        │PK id  │ │ collection:      │         │ message, is_read   │
        │name   │ │  thumbnail/gallery│        └────────────────────┘
        └───────┘ └──────────────────┘
```

### 5.2 Mermaid (alternatif)

```mermaid
erDiagram
    users ||--o| profiles : "1:1 optional"
    users ||--o{ posts : "author"
    categories ||--o{ posts : "1:n"
    posts ||--o{ post_tags : ""
    tags ||--o{ post_tags : ""
    posts }o--o{ tags : "n:n via post_tags"
    projects ||--o{ project_technologies : ""
    projects |o--o| seo_metadata : "1:1 morph"
    posts |o--o| seo_metadata : "1:1 morph"
    profiles |o--o| seo_metadata : "1:1 morph"
    owners--o{ media : "morph (thumbnail/gallery/cover/photo/image)"
    users ||--o{ personal_access_tokens : "sanctum morph"
    users ||--o{ activity_logs : ""
    users }o--o{ roles : "n:n via model_has_roles"
    users }o--o{ permissions : "n:n via model_has_permissions"
    roles }o--o{ permissions : "n:n via role_has_permissions"
```

---

## 6. Index Strategy

| Tabel | Index | Kolom | Tipe | Alasan |
|---|---|---|---|---|
| users | `users_email_unique` | email | UNIQUE | login lookup |
| users | `users_email_verified_at_index` | email_verified_at | normal | verifikasi (opsional dihitung) |
| roles | `roles_name_unique` | name | UNIQUE | Spatie |
| permissions | `permissions_name_unique` | name | UNIQUE | Spatie |
| model_has_roles | PRIMARY | (role_id, model_type, model_id) | composite | Spatie |
| model_has_roles | `model_has_morph_type_model_id_index` | (model_type, model_id) | composite | lookup user roles |
| model_has_permissions | PRIMARY | (permission_id, model_type, model_id) | composite | Spatie |
| role_has_permissions | PRIMARY | (role_id, permission_id) | composite | Spatie |
| personal_access_tokens | `token_unique` | token | UNIQUE | lookup token |
| personal_access_tokens | `tokenable_index` | (tokenable_type, tokenable_id) | composite | Sanctum |
| profiles | `profiles_user_id_unique` | user_id | UNIQUE | 1:1 |
| skills | `skills_active_sort_index` | (is_active, sort_order) | composite | public list |
| experiences | `experiences_active_sort_index` | (is_active, sort_order) | composite | public list |
| educations | `educations_active_sort_index` | (is_active, sort_order) | composite | public list |
| certificates | `certificates_active_sort_index` | (is_active, sort_order) | composite | public list |
| projects | `projects_slug_unique` | slug | UNIQUE | SEO lookup |
| projects | `projects_status_featured_sort_index` | (status, is_featured, sort_order) | composite | public list |
| projects | `projects_published_at_index` | published_at | normal | sitemap/sortir |
| project_technologies | `project_technologies_project_name_unique` | (project_id, name) | UNIQUE | anti duplikat |
| project_technologies | `project_id_index` | project_id | normal | relational |
| categories | `categories_slug_unique` | slug | UNIQUE | |
| tags | `tags_name_unique` / `tags_slug_unique` | name / slug | UNIQUE | |
| posts | `posts_slug_unique` | slug | UNIQUE | SEO lookup |
| posts | `posts_status_published_at_index` | (status, published_at) | composite | public list |
| posts | `posts_category_id_index` | category_id | normal | filter |
| posts | `posts_author_id_index` | author_id | normal | filter |
| post_tags | PRIMARY | (post_id, tag_id) | composite | pivot |
| media | `media_morph_index` | (model_type, model_id) | composite | relasi owner |
| media | `media_collection_index` | collection | normal | filter |
| contact_messages | `messages_read_created_index` | (is_read, created_at) | composite | list admin |
| seo_metadata | `seo_seoable_unique` | (seoable_type, seoable_id) | UNIQUE | 1:1 |
| site_settings | `settings_key_unique` | key | UNIQUE | lookup |
| activity_logs | `logs_morph_index` | (model_type, model_id) | composite | audit |
| activity_logs | `logs_created_at_index` | created_at | normal | sortir |
| activity_logs | `logs_user_id_index` | user_id | normal | audit |

**Prinsip:** setiap FK diberi index; kolom yang dipakai klausa `WHERE status/published` diberi composite index; slug/email unique. Kolom JSON `social_links`/`payload` TIDAK diindex di v1.

---

## 7. Constraint Strategy

| Jenis | Keputusan |
|---|---|
| PK | `BIGINT UNSIGNED` auto-increment di semua tabel (`id`) |
| FK | Named implicit Laravel (`column`); semua langkah `ON DELETE CASCADE` untuk kepemilikan, `SET NULL` untuk referensi opsional |
| UNIQUE | users.email; roles.name; permissions.name; profiles.user_id; personal_access_tokens.token; projects.slug; project_technologies(project_id,name); categories.slug; tags.name; tags.slug; posts.slug; seo_metadata(seoable_type,seoable_id); site_settings.key; pivot PK |
| CHECK | ENUM status (`draft`,`published`,`archived`) di projects & posts; level `BETWEEN 1 AND 100` (app-validasi; CHECK opsional) |
| NOT NULL | kolom wajib per tabel (lihat spec) |
| Booleans | `TINYINT(1)` mewakili boolean |
| Mass assignment | `$fillable` di model (lesson fase backend) |
| Polymorph integrity | service layer (hapus cascade manual) |

---

## 8. Naming Convention

| Aspek | Konvensi | Contoh |
|---|---|---|
| Tabel | `snake_case`, plural, singular `data` jadikan exception `media` | `projects`, `project_technologies` |
| Kolom | `snake_case`, singular | `sort_order`, `mime_type` |
| PK | selalu `id` | `id` |
| FK | `singular_table_id` | `project_id`, `author_id` |
| Morph type kolom | `{name}_type` / `{name}_id` | `model_type/model_id`, `seoable_type/seoable_id` |
| Pivot | alfabetis nama dua tabel | `post_tags` (post sebelum tag) |
| Timestamps | `created_at`, `updated_at` | |
| Status | ENUM string `draft/published/archived` | |
| Boolean | prefix `is_`; nilai 1/0 | `is_active`, `is_featured` |
| Slug | huruf kecil, `-` sebagai separator, kolom `slug` | `smart-inventory-ai` |
| Index unique | `{table}_{columns}_unique` | `projects_slug_unique` |
| Index composite | `{table}_{col1}_{col2}_index` | `posts_status_published_at_index` |
| Kolom teks pendek | `VARCHAR(191)` (index-friendly utf8mb4) | |
| Teks panjang | `TEXT` / `MEDIUMTEXT` | `bio`, `body` |

---

## 9. Data Integrity

| Aspek | Keputusan |
|---|---|
| Referential integrity | InnoDB FK; polymorphic via service layer |
| FK behavior | lihat Bagian 4: CASCADE untuk kepemilikan, SET NULL untuk opsional (author, category, user log, profile.user_id) |
| ON UPDATE | CASCADE (id tidak pernah berubah, tetap konsisten) |
| Unique constraints | slug (projects, posts, categories, tags), email, role/permission name, key setting |
| Required fields | sesuai spec kolom (mis. title, slug, name, email, message wajib) |
| Nullable fields | hanya kolom opsional (bio, url, end_date, end_year, dst) |
| Validation boundary | DB constraint = garis pertahanan terakhir; validasi aktual di FormRequest (fase backend) |
| Integrity habit | transaksi saat update banyak tabel (project + technologies + media + seo) |
| No duplicate | unique composite (project_id+name teknologi, post_id+tag_id) |
| Normalization | 3NF: tidak ada dependensi transitif; teknologi/category/tag dipisah |

---

## 10. Soft Delete Strategy

- **v1: HARD DELETE.** Status `archived` menangani kebutuhan "tidak tampil namun tersimpan" — archive tidak menghapus row.
- Kolom `deleted_at` TIDAK ditambahkan pada v1.
- Setelah hapus (delete) project/post: teknology, pivot tag, media terkait, seo_metadata ikut terhapus (service layer).
- **TBD / Future Decision:** soft delete + trash/restore bila dibutuhkan (deadline: setelah core stabil).

---

## 11. Status Convention

| Entitas | Kolom status | Nilai | Public visibility |
|---|---|---|---|
| projects | `status` ENUM | draft / published / archived | published only, `published_at <= now` |
| posts | `status` ENUM | draft / published / archived | published only |
| skills | `is_active` bool | 0/1 | active |
| experiences | `is_active` bool | 0/1 | active |
| educations | `is_active` bool | 0/1 | active |
| certificates | `is_active` bool | 0/1 | active |
| categories | `is_active` bool | 0/1 | active (label category) |
| contact_messages | `is_read` bool | 0/1 | — |

Aturan terkait:
- `published_at` di-set otomatis saat status pertama kali `published` (app-level).
- `is_current` experience → bersamaan active false optional.
- `is_featured` project hanya 1 flag per project (tidak ada limit jumlah featured).
- `end_year`/`end_date` NULL menandakan ongoing.

---

## 12. Migration Planning Notes

Urutan pembuatan migration (berdasar dependensi FK):

1. **Spatie config publish** → `permission_tables.php` (roles, permissions, 3 pivot).
2. `users`, `personal_access_tokens` (Sanctum).
3. `profiles` (FK → users).
4. `skills`, `experiences`, `educations`, `certificates` (independen).
5. `categories`, `tags`.
6. `projects`, `posts` (FK author/category; slug unique).
7. `project_technologies`, `post_tags`.
8. `media`, `seo_metadata`, `activity_logs` (polymorph, no DB FK).
9. `contact_messages`, `site_settings`.

Catatan khusus:

- ENUM status pakai `$table->enum('status', [...])` → pada MySQL dikonversi sebagai ENUM.
- JSON kolom `social_links`, `value`, `payload` → `$table->json()`.
- `utf8mb4` index length: unique string dibatasi `VARCHAR(191)` agar muat 764 byte (InnoDB row limit).
- Seeder (fase implementation) wajib: role super-admin + editor, user admin + editor, profile (id=1) dengan data Achmad Herdiansyah, default site_settings (site, seo, sosial), sample content.
- Rollback strategy: migration down berurutan; seed idempotent (`firstOrCreate`).

---

## Lampiran A — Keputusan & TBD

| Keputusan | Status |
|---|---|
| PK BIGINT (bukan UUID/ULID) | Selera — BIGINT dipilih (kecil, index murah, kompatibel Spatie/Sanctum) |
| `project_technologies` normalized (bukan JSON) | Diputuskan (menggantikan `tech_stack` Phase 1) |
| `seo_metadata` morph 1:1 | Diputuskan (menggantikan kolom SEO di projects/posts) |
| Media polymorphic + collection | Diputuskan |
| Soft delete | TBD/Future |
| Token `expires_at` | TBD/Future (v1 nullable) |
| `canonical_url` di seo_metadata | TBD/frontend menghitung |
| PDF resume / media | TBD/Future |
| Image width/height resize | TBD/Future |

---

## Lampiran B — Definisi Selesai (Definition of Done)

- [x] `docs/03_DATABASE_SCHEMA.md` dibuat.
- [x] Semua entity utama (23 tabel) terdokumentasi.
- [x] Semua column terdokumentasi (tipe, nullable, default).
- [x] PK & FK ditentukan.
- [x] Relationship (1:1, 1:n, n:n, polymorph) ditentukan.
- [x] Index ditentukan.
- [x] Constraint ditentukan.
- [x] ERD tersedia (ASCII + Mermaid).
- [x] Naming convention tersedia.
- [x] Data integrity strategy tersedia.
- [x] Tidak ada migration dibuat.
- [x] Tidak ada source code dibuat.
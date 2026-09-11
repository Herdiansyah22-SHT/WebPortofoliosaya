# PHASE 5 — UI/UX DESIGN SYSTEM & FRONTEND ARCHITECTURE

> **Status Dokumen:** Blueprint desain UI/UX + arsitektur frontend. Belum ada implementation.
> **Acuan:** `docs/01_PROJECT_OVERVIEW.md`, `docs/02_REQUIREMENT_AND_ARCHITECTURE.md`, `docs/03_DATABASE_SCHEMA.md`, hasil Phase 3–4.
> **Dibuat:** 26 Agustus 2026
> **Oleh:** Achmad Herdiansyah

> **Catatan penomoran (rekonsiliasi):** Dokumen fase sebelumnya menyebut "Phase 5 = REST API Development". Prompt ini menetapkan phase ini sebagai **Phase 5 — UI/UX Design System & Frontend Architecture**, dan REST API Development dipindah ke **Phase 6**. Nomor berkas `docs/05_UI_UX_DESIGN_SYSTEM.md` mengikuti penomoran baru. Tidak ada perubahan keputusan teknis.

Fase ini HANYA blueprint. Tidak ada React, CSS, Tailwind, Laravel, API, atau migration yang dibuat.

---

## 1. Design Direction

**Keyword:** MODERN · ELEGANT · PROFESSIONAL · CLEAN · MINIMAL · RESPONSIVE.

Identitas visual menampilkan portfolio seorang **Web Developer profesional**:

- Clean, banyak whitespace, keseimbangan visual.
- Look "custom-built", bukan template generik.
- Authority & readability tinggi.
- Aksen warna terbatas dan disengaja.
- Interaksi subtle; animasi tidak mengganggu.

Public website: terang, profesional, fokus konten, dengan dark section selektif (hero atau footer) untuk kontras dan "teknologi" feel.

CMS: bersih, padat, produktif, didedikasikan untuk kecepatan kerja admin — tetap memakai token identitas yang sama (navy + accent sama), bukan dashboard template generik.

---

## 2. Design Principles

| # | Prinsip | Implementasi |
|---|---|---|
| 1 | Clean | Whitespace dominan; grid konsisten; tidak ada elemen dekorasi tanpa fungsi |
| 2 | Minimal | Satu ide per layar/section; konten > dekorasi |
| 3 | Modern | Tipografi kuat, sudut sedikit membulat (radius 8–12px), aksen terbatas |
| 4 | Elegant | Hierarchy tipografi jelas; detail kecil (hover, focus) digarap |
| 5 | Professional | Konsistensi token di seluruh site + CMS |
| 6 | Consistent | Satu design system; tidak ada varian acak |
| 7 | Accessible | WCAG AA contrast, keyboard, label, focus |
| 8 | Responsive | Mobile-first; bukan desktop yang dikecilkan |
| 9 | Visual hierarchy | Judul → sub → body; kontras warna mengarahkan mata |
| 10 | Strong typography | Scale-type konsisten, Poppins heads / sans body |
| 11 | Proper spacing | Token spacing 4-basis; tidak random |
| 12 | Subtle interaction | Transition 150–250ms; feedback kecil |

**Hindari:** gradient berlebihan, glassmorphism berlebihan, shadow mencolok, terlalu banyak warna, animasi berlebih, layout ramai, tampilan template generik.

---

## 3. Color System

Base color **Navy / Midnight Blue** sebagai identitas utama; accent terbatas.

### 3.1 Token warna

| Token | Value (approximate Tailwind 4) | Penggunaan |
|---|---|---|
| `navy-950` | `#0B1120` (slate-950) | Footer, dark hero, sidebar CMS dark, text utama alternatif |
| `navy-900` | `#0F172A` | Heading utama, brand |
| `navy-800` | `#1E293B` | Secondary heading, icon |
| `navy-600` | `#334155` | Body text kuat |
| `slate-500` | `#64748B` | Body text, muted |
| `slate-400` | `#94A3B8` | Caption, placeholder |
| `bg-light` | `#FFFFFF` | Background utama (white/base) |
| `bg-soft` | `#F8FAFC` (slate-50) | Section alternatif, card CMS |
| `bg-muted` | `#F1F5F9` (slate-100) | Input bg, muted block |
| `line` | `#E2E8F0` (slate-200) | Border, divider |
| `accent` | `#2563EB` (blue-600) | Primary color action, link, CTA |

### 3.2 Semantic colors

| Token | Value | Penggunaan |
|---|---|---|
| `primary` | `#2563EB` | Tombol utama, focus ring, active nav, link |
| `primary-hover` | `#1D4ED8` (blue-700) | Hover primary |
| `success` | `#16A34A` (green-600) | Badge published, toast sukses |
| `warning` | `#D97706` (amber-600) | Badge draft |
| `danger` | `#DC2626` (red-600) | Delete, error message, badge archived |
| `info` | `#2563EB` | Badge unread, info |
| `muted` | `#64748B` | Badge inactive/neutral |

### 3.3 Aturan pakai

- Status → badge berwarna (`published`=success, `draft`=warning, `archived`=neutral/danger boundaryer).
- Warna aksen `primary` dipakai konsisten: CTA, focus, active link. Tidak melengkapi semua variasi di satu halaman.
- Dark section: navy-950 background, teks putih; hanya dipakai selektif (hero, footer, CTA band).
- Contrast selalu ≥ 4.5:1 untuk teks (WCAG AA).

---

## 4. Typography

- **Headings / Branding:** Poppins (weight 500–800).
- **Body / UI:** sans-serif modern (default UI seperti Inter/System). Dipilih saat implementation; Poppins tidak untuk body panjang agar mudah dibaca.

Load efisien: variable font via Google Fonts (Poppins 500/600/700/800), body pakai system stack (menghindari font bloat) — fallback: pakai Poppins 400 juga bila perlu.

### 4.1 Type scale (Tailwind-like tokens)

| Token | Size | Weight | Line-height | Letter-spacing | Use |
|---|---|---|---|---|---|
| `display` | 48px (mobile 36) | 700 | 1.1 | -0.02em | Hero • h1 landing |
| `h1` | 36px (mobile 30) | 700 | 1.15 | -0.01em | Page title |
| `h2` | 30px (mobile 24) | 700 | 1.2 | -0.01em | Section heading |
| `h3` | 22px (mobile 20) | 600 | 1.3 | 0 | Sub-section |
| `h4` | 18px | 600 | 1.35 | 0 | Card title |
| `body` | 16px | 400 | 1.6 | 0 | Paragraf |
| `body-sm` | 14px | 400 | 1.55 | 0 | Teks pendukung |
| `small` | 12px | 400 | 1.5 | 0 | Caption |
| `caption` | 12px | 500 | 1.4 | 0.02em | Meta, tanggal |
| `label` | 13px | 600 | 1.4 | 0.01em | Label form, badge, nav |
| `overline` | 12px | 700 | 1.3 | 0.12em | Section eyebrow (uppercase) |

- Heading hierarchy konsisten: satu `h1` per halaman; section pakai `h2`; turunan `h3`/`h4`.
- Maximum line-length body: ~70ch.

---

## 5. Spacing

Scale 4-basis (Tailwind 4 default):

```text
4 8 12 16 24 32 48 64 80 96
```

Token pemakaian:

| Token | Value | Penggunaan |
|---|---|---|
| `space-1` | 4px | Gap icon-text kecil, dot |
| `space-2` | 8px | Gap dalam badan tombol kecil, badge |
| `space-3` | 12px | Gap form field-label, group item |
| `space-4` | 16px | Gap kartu internal, list |
| `space-6` | 24px | Gap antar elemen section, kartu body |
| `space-8` | 32px | Padding kartu, antar component blok |
| `space-12` | 48px | Section spacing kecil / CMS section |
| `space-16` | 64px | Section spacing (mobile) |
| `space-20` | 80px | Section spacing besaar |
| `space-24` | 96px | Hero spacing, pre-footer |

Aturan: konsisten per "jenis elemen", bukan nilai random. Section padding vertikal: `py-16` mobile → `py-24` desktop.

---

## 6. Responsive Breakpoints

Mobile-first (Tailwind 4 default breakpoints):

| Name | Min-width | Target |
|---|---|---|
| `sm` | 640px | Mobile landscape, small tablet |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / laptop kecil |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Behavior per komponen

| Komponen | Mobile (base) | Tablet (sm–md) | Desktop (lg+) |
|---|---|---|---|
| Public navbar | Hamburger → drawer | Hamburger | Bar horizontal, sticky |
| Hero | Stack, teks → visual | Stack tengah | 2 kolom (kiri teks / kanan visual) |
| Project grid | 1 kolom | 2 kolom | 3 kolom |
| Blog grid | 1 kolom | 2 kolom | 3 kolom (featured 1 full) |
| Forms | Stack full-width | Stack | Layout menurut fungsi |
| CMS sidebar | Drawer (overlay + hamburger) | Drawer | Fixed sidebar 240px |
| CMS table | Card list (stacked) | Card list / 2-col | Data table penuh |
| Modal | Full-width bottom sheet | Centered (max-w-md+) | Centered |
| Cards | Stack | Grid sesuai kolom | Grid sesuai kolom |

Prinsip: **mobile mendapat layout yang dibuat khusus** (table→cards, navbar→drawer), bukan di-shrink.

---

## 7. Layout System

### 7.1 Layout umum public

```
Container (max-w-xs → max-w-6xl/7xl)
   └── grid 12 (desktop) / 1 col (mobile) / 2 col (sm-md untuk blok)
```

- Container: `max-w-6xl` (1152px) konten, `max-w-7xl` (deretan) optional.
- Kotak tengah (center column) untuk konten hero/about.

### 7.2 Layout public pages

- PublicLayout: `<Navbar/> <main> {Outlet} </main> <Footer/>`.
- Detail pages (project, blog): container sempit (max-w-3xl) untuk readability.

### 7.3 Layout CMS

```
AdminLayout:
┌───────────────┬────────────────────────────┐
│ Sidebar 240px │ Topbar (title + user menu) │
│ (drawer mob)  ├────────────────────────────┤
│               │ Main content (p-6/8)       │
└───────────────┴────────────────────────────┘
```

- Sidebar kiri fixed (desktop), drawer di mobile.
- Topbar: page title, breadcrumb (opsional), user menu (nama + logout).

### 7.4 Grid patterns

- Project grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Blog grid: sama; featured post di atas full-width.
- Skill/education/certificate: grid adaptif sesuai konten (xs berpasangan).

---

## 8. Public Website Structure

### 8.1 Information Architecture

```
Home (/)
├── Hero
├── About preview → /about
├── Skills
├── Featured projects → /projects
├── Experience
├── Certificates
├── Blog preview → /blog
├── Contact CTA → /contact
└── Footer
```

Navigation utama (navbar): Home · About · Skills · Projects · Experience · Education · Certificates · Blog · Contact.

### 8.2 Halaman

| Route | Struktur |
|---|---|
| `/` | Hero → About preview → Skills → Featured Projects → Experience → Certificates → Blog preview → Contact CTA → Footer |
| `/about` | Hero kecil + bio → Profil lengkap → Pendidikan → Sosial → Resume CTA |
| `/skills` | Section per kategori, skill bar/tag |
| `/projects` | Header + filter featured → grid ProjectCard |
| `/projects/:slug` | Hero detail → Overview → Problem/Solution/Features → Stack → Links (GitHub/Demo) |
| `/experience` | Timeline |
| `/education` | Kartu grid |
| `/certificates` | Kartu grid + URL kredensial |
| `/blog` | Featured post → grid → kategori/tags → pagination |
| `/blog/:slug` | Title → metadata → cover → content → tags → related |
| `/contact` | Info kontak + form → konfirmasi |
| `/404` | NotFound friendly |

Semua halaman public di dalam `PublicLayout`; SEO meta per halaman.

---

## 9. Homepage UX

Struktur flow (di atas). Detail:

**Hero section** (dark navy selektif, visual profil):
- Nama (display).
- Professional title (h1 berikutnya / sub emas accent).
- Short value proposition 1–2 kalimat.
- Primary CTA `View Projects` (tombol primary).
- Secondary CTA `Contact Me` (ghost/outline; light).
- Profile visual (foto/placeholder lingkaran/akar) opsional — jangan terlalu ramai.

**About preview**: 2 kolom — paragraf singkat + chips → link `Selengkapnya`.

**Skills**: group per kategori; progress bar halus atau tag stack.

**Featured projects**: 3 kartu terbaik (max), `View all projects`.

**Experience**: timeline terkompresi 2–3 entri → link full.

**Certificates**: baris kartu kecil/badge.

**Blog preview**: 3 kartu terbaru → `Lihat blog`.

**Contact CTA**: band navy, "Tertarik bekerja sama?" + tombol → `/contact`.

**Footer**: nama, nav, sosial, copyright.

Rule: hero satu gagasan, tidak overload; setiap blok punya heading singkat + 1 aksi.

---

## 10. Project UX

**Project card** (`ProjectCard`, feature component):
- Thumbnail (aspect-video).
- Title (h4).
- Short description (body-sm, clamp 2 line).
- Technology tags (small badges).
- Status badge (Published/Featured).
- CTA `Detail`.
- Hover: subtle lift + border-accent.

**Project detail**:
- Breadcrumb Back to projects.
- Title (h1) + meta (tahun, status, stack).
- Hero thumbnail pakai featured image.
- Section verbal per blok dengan heading h2:
  Overview · Problem · Solution · Features · Technology stack · Architecture · Challenges · Result.
- Actions: `Live Demo` (primary), `Source Code` (ghost).
- Related projects (opsional).
- Tidak semua blok harus terisi — kosong disembunyikan.

Visual hierarchy: judul → meta → visual → konten.

---

## 11. Blog UX

**Listing**: 1 featured (full-width card) + grid; meta: tanggal, kategori, reading time; tags.
**Detail**: breadcrumb, title h1, meta (author, tanggal, kategori, reading time), cover, content dengan heading hierarchy, tags, related posts (2–3).

- Readability: container `max-w-3xl`, line-height 1.7, paragraph spacing, code block styling rapi.
- Internal linking dalam konten didorong; daftar isi (TOC) opsional untuk artikel panjang.

---

## 12. Contact UX

Layout 2 kolom desktop: info (email, lokasi, sosial, availability) + form.

Form fields: name, email, subject, message, submit `Kirim Pesan`.

States:

| State | Behavior |
|---|---|
| Default | Label + placeholder jelas |
| Focus | Border accent + focus ring |
| Loading | Tombol "Mengirim..." + spinner, `disabled` |
| Success | Toast sukses + reset form + pesan konfirmasi |
| Validation error | Inline error per field (warning color + icon), `aria-invalid`, `aria-describedby` |
| Server error | Alert ringkas non-teknis, form tidak hilang |

Aksesibilitas: label terhubung ke input, focus order logis.

---

## 13. CMS Information Architecture

```
Admin
├── Dashboard
├── Content
│   ├── Projects
│   ├── Skills
│   ├── Experience
│   ├── Education
│   ├── Certificates
│   ├── Blog
│   └── Media
├── Inbox
│   └── Messages
└── Configuration
    ├── Profile
    ├── SEO
    └── Settings
```

Menu disembunyikan sesuai permission (UX); security tetap di backend.

---

## 14. CMS Layout

**Sidebar** (240px fixed desktop / drawer mobile):
- Brand top (logo + site name).
- Nav group label kecil (Content, Inbox, Configuration).
- Item: icon + label, active state (accent left indicator + bg tint).
- Collapsible: optional (tombol collapse → icon-only 64px).

**Topbar**: page title kiri; kanan: user menu (avatar → name, role, logout), nota opsional.

**Mobile**: hamburger buka drawer (overlay), auto-close setelah navigasi.

**Main**: `p-4 sm:p-6 lg:p-8`, bg-soft, konten dalam card putih.

---

## 15. Dashboard UX

Kartu statistik berguna (bukan chart dekoratif):

- Total projects · Published · Draft · Archived
- Blog posts (published/draft)
- Unread messages (dengan badge)
- Total media

Plus:
- Recent messages (5 terbaru, unchecked highlighted).
- Quick links: Create Project, New Post, Upload Media.
- Recent activity dari `activity_logs` bila tersedia.

Angka mengikuti permission user. Draft/archived non-teknis — label ramah.

---

## 16. CMS CRUD UX

Flow per module: **List → Create → Edit → Delete** (View = detail inline/kolom preview bila perlu).

### List page
- Header: title + aksi utama `+ Tambah Baru`.
- Toolbar: search input, filter status, (sort opsional).
- **Data table** (desktop): kolom sesuaıyo (title+slug, status badge, meta, updated, actions).
- **Mobile**: card list (thumbnail, title, status, actions) — bukan table shrink.
- Aksi per row: dropdown (Edit · View · Delete) atau icon; delete butuh konfirmasi.
- Pagination disediakan.

### Form page
- Section card: satu group logis per kartu (mis. Info, Status, Media, SEO).
- Label + required indicator `*`; helper text; inline error focus.
- Media picker (thumbnail/gallery/cover) terhubung Media module.
- Sticky action bar: `Simpan` (primary), `Batal` (ghost), publish status control (dropdown status + save).

### Confirmation dialog
- Delete: "Hapus project ini? Tindakan ini tidak dapat dibatalkan." [Batal / Hapus(danger)].

---

## 17. Design System (Component System)

### 17.1 Buttons
| Variant | Penggunaan |
|---|---|
| `btn-primary` | Aksi utama (bg accent, white text, hover darker) |
| `btn-secondary` | Aksi alternatif (outline navy/slate) |
| `btn-ghost` | Aksi low-priority (transparent, text primary on hover) |
| `btn-danger` | Destructive (bg danger, white) |
| Parser size: `sm` (form compact), `md` (default), `lg` (hero/CMS utama). Loading: spinner inline + disabled. |

### 17.2 Form
- Input, Textarea, Select, Checkbox, Radio, File upload (drag-drop optional), semua dengan label yang terhubung, focus ring, error state.

### 17.3 Feedback
- Alert (info/success/warning/danger) — top halaman atau inline.
- Toast (sukses/gagal) — bottom-right, auto-dismiss 3–4s.
- Modal (centered, overlay, focus trap, escape close, scrollable).
- Confirmation dialog (varian modal danger).

### 17.4 Data
- Table (thead sticky, zebra ringan, responsive→cards).
- Card (white, border, radius 10, padding 4–6).
- Badge (status + neutral; small, uppercase optional).
- Pagination (prev/next + numbered, active accent).
- Empty state (icon, explanation, CTA).

### 17.5 Navigation
- Navbar (public sticky, blur ringan, active link accent).
- Sidebar (CMS).
- Breadcrumb (detail pages).
- Tabs (opsional; mis. filter blog/project).

### 17.6 Content
- Section (eyebrow + heading + container).
- Container (max-width token).
- ProjectCard, BlogCard, ProfileCard (feature components).

---

## 18. Interaction States

Setiap interactive component minimal punya: **default · hover · focus · active · disabled**; plus per konteks: **loading · success · error · empty**.

| State | Aturan |
|---|---|
| Hover | 150ms; tidak melompat-lompat; pointer cursor |
| Focus | Visible focus ring 2px accent offset 2px (keyboard & mouse) |
| Active | Tekanan visual sedikit (scale 0.98 / bg lebih gelap) |
| Disabled | Opacity 0.5, `aria-disabled`/`disabled`, no hover |
| Loading | Spinner inline; tombol disabled |
| Success | Toast hijau + state visual |
| Error | Alert + field error inline; `role="alert"` |
| Empty | EmptyState component (ikon, teks, CTA) |

---

## 19. Accessibility

- Semantic HTML: `header, nav, main, section, article, footer, aside`.
- Satu `h1` per halaman; heading hierarchy.
- Keyboard: semua interaktif reachable + operable; skip-link "Lewati ke konten".
- Focus visible selalu.
- Label terhubung (`htmlFor`/`id`) + `aria-describedby` untuk helper.
- Contrast teks ≥ 4.5:1 (AA).
- Alt text gambar; gambar dekoratif `alt=""`.
- Tombol = `<button>`/`<a>`, bukan div role click.
- Modal: focus trap + close escape + `role="dialog"` `aria-modal`.
- Form error: `aria-invalid` + pesan inline berasosiasi.
- `prefers-reduced-motion`: nonaktifkan animasi non-esensial.

---

## 20. Animation

Subtle, ≤250ms, ease-out.

- Fade: content reveal section (opsional, sekali).
- Slide: drawer, modal (translate + fade).
- Hover transition: color/border/shadow 150ms.
- Button feedback: 120ms press.
- Navbar: sticky slide-up.

Hindari: parallax berlebihan, scroll animation panjang, continous animation, animasi mengganggu readability.

Respect `prefers-reduced-motion: reduce` → hilangkan semua non-esensial.

---

## 21. Frontend Architecture

```text
frontend/
├── src/
│   ├── components/       # Reusable UI (Button, Input, Modal, Badge, Table, ...)
│   ├── layouts/          # PublicLayout, AdminLayout, AuthLayout
│   ├── pages/            # Route-level pages (thin, compose layouts + features)
│   ├── features/         # Feature components per domain (home, projects, blog, contact, admin/*)
│   ├── hooks/            # useAuth, useProjects, usePosts, useMedia, useSettings, ...
│   ├── services/         # apiClient (axios), endpoint modules, authStorage
│   ├── lib/              # utils non-React (slug, formatDate, chartCeiling, seo helper)
│   ├── routes/           # Route definitions + guards (ProtectedRoute)
│   ├── context/          # AuthContext (+ UI context bila perlu)
│   └── assets/           # images, fonts
├── public/               # static (favicon, robots.txt, dll)
└── package.json
```

Responsibility:

| Folder | Responsibility |
|---|---|
| `components/` | Reusable UI tanpa knowledge domain |
| `layouts/` | Shell halaman (navbar/sidebar/footer, guards) |
| `pages/` | Komposisi per route; tipis; panggil feature component + hooks |
| `features/` | UI + logic per domain (ProjectCard, ProjectForm, BlogList, MediaUploader) |
| `hooks/` | Data fetching (TanStack Query) + business hooks |
| `services/` | Satu-satunya tempat komunikasi API (axios instance, endpoints) |
| `lib/` | Pure utils (no React) |
| `routes/` | Definisi route + protected wrapper |
| `context/` | Global state minimal: auth (+ UI overlay) |
| `assets/` | File statis |

Feature-based organization dipakai (bukan pure atomic) karena domain jelas (public + CMS). Tidak berlebihan — tanpa service layer di feature folder, tanpa folder bermodel abstrak.

---

## 22. Component Strategy

- **Reusable** (`components/`): Button, Input, Textarea, Select, Checkbox, Radio, Modal, Dialog, Toast, Alert, Badge, Table, Pagination, Skeleton, Spinner, EmptyState, Card, Tabs, Breadcrumb, Dropdown, FileField.
- **Feature** (`features/`): ProjectCard, ProjectForm, BlogCard, BlogEditor, MediaUploader, MediaGrid, DashboardStats, ContactForm, SkillBar, MessageCard, SeoForm, SettingsForm.

Aturan: jangan buat komponen hanya untuk menambah jumlah; buat reusable saat dipakai ≥2 tempat; feature component saat mengandung logic/domain spesifik.

---

## 23. Routing Strategy

**Public (PublicLayout):**

```
/          /about    /skills    /projects   /projects/:slug
/experience /education /certificates
/blog      /blog/:slug    /contact
*          → NotFound
```

**CMS (AdminLayout + guard):**

```
/admin/login          (AuthLayout, tanpa guard)
/admin                → Dashboard
/admin/profile
/admin/projects       (+ /admin/projects/new, /admin/projects/:id/edit)
/admin/skills         (+ new, :id/edit)
/admin/experience     (+ ...)
/admin/education
/admin/certificates
/admin/blog           (+ new, :id/edit)
/admin/media
/admin/messages
/admin/seo
/admin/settings
```

- **ProtectedRoute**: `useAuth()` → belum login → redirect `/admin/login`; tanpa permission → halaman "Anda tidak berhak" + backend tetap 401/403.
- Redirect setelah login ke `/admin`.

---

## 24. API Integration Strategy

```
React component/feature
   ↓ hook (TanStack Query)
      ↓ services/endpoint module
         ↓ services/apiClient (axios instance baseURL /api/v1)
            ↓ axios headers (Bearer token dari authStorage)
               ↓ Laravel REST API
```

- **ApiClient**: axios instance → baseURL `import.meta.env.VITE_API_URL` (`http://127.0.0.1:8000/api/v1`), `timeout`, default `Accept: application/json`.
- **Interceptors**: request → attach token; response → seragam `{success,message,data}`; error → map 401 (logout state + redirect), 403, 422 → form errors, 429, 500; jangan throw raw stack.
- **Auth storage**: token localStorage (v1) + AuthContext sinkron.
- **Endpoint modules** (`services/*.js`): satu fungsi per endpoint (`api.get('/projects')`). Component TIDAK memanggil axios langsung — hanya lewat service + hooks.
- Detail implementasi: fase frontend berikutnya.

---

## 25. Frontend State

| State | Strategi |
|---|---|
| Auth | `AuthContext` global (token, user, roles, permissions, actions) |
| Server data | TanStack Query (cache, refetch, staleTime) — hooks per resource |
| Form | Local component state + map error 422 ke field |
| UI (modal, drawer, toasts) | Local context kecil / state component |
| Loading / Error | Turunan hooks (isLoading / isError) + shared components |
| Theme / preferences | CSS variables + media query (tanpa JS state tambahan) |

Rule: state global hanya untuk auth + overlay UI; sisanya local/query cache. Jangan global-state untuk semua hal.

---

## 26. Form UX

- Clear, short, logical order, scannable.
- Field grouping per section card; long forms dipecah.
- Label selalu terlihat (bukan placeholder-only), required `*` ditandai.
- Helper text bila perlu (hint singkat).
- Inline error per field, pesan ramah: "Email wajib diisi" bukan "SQLSTATE[23000]...".
- Error 422 dari API dipetakan ke field; error non-field → alert top.
- Submit: disable saat loading, sukses → toast + reset/redirect.

---

## 27. Table UX

- Toolbar: search (debounce 300ms), filter status/kategori, pagination.
- Sort optional per kolom penting (updated_at, title).
- Column: thumbnail/title+slug, status badge, meta (date/updated), actions.
- Mobile: konversi ke card list (stack), aksi dalam row action atau dropdown.
- Long text: truncate (title clamp, preview excerpt).
- Empty row: EmptyState.

---

## 28. Empty State

Tiap listing punya EmptyState:

- Contoh: "Belum ada project." + penjelasan 1 baris ("Buat project pertama untuk menampilakn karya kamu.") + CTA (`+ Tambah Project`).
- Public: teks ramah visitor tanpa CTA CMS.

Jangan halaman kosong polos.

---

## 29. Loading State

- List/section: skeleton cards (shape konten, shimmer ringan).
- Detail: skeleton blok.
- Inline action: spinner tombol.
- Halaman pertama tanpa data & loading lama: skeleton tanpa teks aneh; timeout/retry pada error.

---

## 30. Error State

- **Public**: pesan informatif + retry ("Gagal memuat data. Coba lagi."), tanpa technical detail.
- **CMS**: pesan membantu + retry; form error per-field; 401 → auto redirect login; 403 → "Anda tidak memiliki izin."; 429 → "Terlalu banyak permintaan."
- Jangan tampilkan stack trace / SQL.

---

## 31. SEO UX

- Heading hierarchy semantik (1 `h1`/page, section `h2`+).
- URL readable berbasis slug.
- Image alt deskriptif (disimpan di media + form).
- Internal links antar halaman (related, breadcrumb).
- Metadata per halaman (title/description/OG/JSON-LD) — set dari data API.
- Content terstruktur supaya crawler paham semantik.

---

## 32. Design Document

Dokumen ini: `docs/05_UI_UX_DESIGN_SYSTEM.md`.

---

## 33. Optional Figma

Belum ada Figma project aktif — blueprint Markdown ini menjadi acuan utama sebelum implementation. Figma dapat menyusul (screen: Homepage, Projects, Project Detail, Blog, Blog Detail, Contact, CMS Login, Dashboard, Project List/Form, Blog List/Form, Media, Messages, Settings) saat desain visual perlu divectorisasi.

---

## 34. UI/UX Acceptance Criteria

Given/When/Then ringkas:

- **Design consistency**: Given halaman public/CMS mana pun, When diperiksa token (warna, tipografi, spacing), Then mengikuti design system ini.
- **Responsive**: Given viewport mobile/tablet/desktop, When halaman dimuat, Then layout adaptif (drawer sidebar, grid, table→cards) tanpa horizontal scroll.
- **Aksesibilitas**: Given keyboard user, When navigasi halaman, Then semua interaktif reachable, focus terlihat, form berlabel.
- **Form UX**: Given submit form invalid, When dikirim, Then inline error per-field ramah (bukan technical).
- **Empty/loading/error**: Given list kosong/loading/failed, When dirender, Then EmptyState/skeleton/error+retry muncul (tidak blank).
- **Contrast**: Given teks konten, When diukur, Then kontras ≥ 4.5:1 (AA).
- **Reduced motion**: Given `prefers-reduced-motion`, When animasi diaktifkan, Then non-esensial tidak berjalan.
- **CMS info**: Given Dashboard, When dilihat, Then statistik berguna (projects/posts/messages/media) tanpa chart dekoratif.

---

## 35. Definition of Done

- [x] Design direction ditentukan (modern, elegant, professional, clean, minimal).
- [x] Color system ditentukan (navy + accent, semantic status).
- [x] Typography ditentukan (Poppins headings + sans body, type scale).
- [x] Spacing system ditentukan (4-basis scale).
- [x] Responsive strategy ditentukan (breakpoints + per-komponen behavior).
- [x] Public website structure ditentukan (IA + halaman).
- [x] CMS structure ditentukan (IA + layout sidebar/topbar).
- [x] Component system ditentukan (buttons, form, feedback, data, nav, content).
- [x] UI states ditentukan (default–empty).
- [x] Accessibility requirement ditentukan.
- [x] Animation guideline ditentukan (subtle + reduced-motion).
- [x] Frontend architecture ditentukan (folder + responsibility).
- [x] Routing strategy ditentukan (public + CMS + guard).
- [x] State strategy ditentukan.
- [x] API integration strategy ditentukan (centralized axios + interceptor).
- [x] `docs/05_UI_UX_DESIGN_SYSTEM.md` dibuat.
- [x] Tidak ada application implementation (React/CSS/Tailwind/Laravel/API/migration).
- [x] Tidak mengerjakan Phase 6.

---

## 36. Output Summary

Status & ringkasan: lihat pesan keluaran fase di bawah dokumen ini.

**NEXT PHASE:** PHASE 6 — REST API DEVELOPMENT. Menunggu instruksi. Jangan dikerjakan pada fase ini.

---

## Lampiran A — Rekomendasi & TBD

| Item | Status |
|---|---|
| Font body spesifik (Inter vs system) | Keputusan saat implementation |
| Font loading strategy (Google Fonts variable) | Implementation |
| Chart dashboard | Tidak dipakai v1 (TBD/future bila perlu analytics) |
| Collapsible sidebar icon-only | Opsional, implementation |
| Breadcrumb di tiap CMS pages | Opsional, hanya detail/data deep |
| Figma wireframes | TBD (optional, sebelum visual perluasan) |
| Status archiv badge warna netral vs danger | Dipilih danger-muted saat implementation |
| Dark section website penuh | Tidak (hanya selektif), sesuai design principle |
# PHASE 13 — SECURITY AUDIT & HARDENING

> **Project:** Personal Portfolio CMS (React + Laravel 12 + MySQL)
> **Date:** 27 Agustus 2026
> **Auditor & Engineer:** Achmad Herdiansyah
> **Status:** COMPLETED — 0 Critical, 0 High. Autentikasi bermigrasi ke level Stateful Cookie.

## 1. Scope

Fokus perbaikan keamanan meliputi:
- Token & Authentication Hardening.
- Laravel Security Headers.
- Brute force protection (Rate Limiting).
- Frontend XSS & CSRF Handling.
- Audit mass assignment dan SQL injection (Aman).

---

## 2. Findings Summary

| ID | Severity | Component | Issue | Status |
|---|---|---|---|---|
| SEC-01 | **MEDIUM** | Frontend Auth | Token JWT disimpan dalam plaintext di `localStorage`. Rentan token theft via XSS jika terdapat skrip pihak ketiga berbahaya. | **FIXED** |
| SEC-02 | **MEDIUM** | Backend Sanctum | Token API default tidak memiliki masa kedaluwarsa (Never Expire). | **FIXED** |
| SEC-03 | **LOW** | Rate Limiting | Throttle `login` hanya menggunakan IP. Berisiko memblokir seluruh NAT/Proxy jika terjadi brute-force di belakang load-balancer yang sama. | **FIXED** |

*(Mass Assignment, CORS Origin Restrictions, IDOR/BOLA, File Upload Security telah diperiksa dan dinyatakan AMAN).*

---

## 3. Vulnerability Fixes & Implementation

### A. Migrasi ke Stateful SPA Cookie Authentication (Mengatasi SEC-01)
*   **Aksi:** Beralih dari penggunaan "Bearer Token yang dikirim manual" ke sistem pengelolaan sesi bawaan browser.
*   **Backend:**
    *   Mengaktifkan `EnsureFrontendRequestsAreStateful` pada route API.
    *   Mengubah fungsi login agar menjalankan `Auth::attempt` + Session regeneration, alih-alih mereturn token teks.
    *   Memastikan `SANCTUM_STATEFUL_DOMAINS` mencakup port Vite dan `SESSION_DOMAIN=localhost` telah dikoordinasi dengan benar di `.env`.
*   **Frontend:**
    *   Menghapus penyimpanan `TOKEN_KEY` di `localStorage`.
    *   Mengaktifkan interceptor axios `withCredentials: true` dan `withXSRFToken: true`.
    *   Sebelum melakukan API login, React memanggil endpoint `/sanctum/csrf-cookie` terlebih dahulu untuk menyiapkan proteksi CSRF. Token ini dijaga secara transparan oleh peramban (HttpOnly & Secure cookie).

### B. Sanctum Expiration Enforcement (Mengatasi SEC-02)
*   **Aksi:** Diperbarui file `config/sanctum.php`.
*   Nilai `'expiration' => 120` (2 jam). Sesi atau token yang tidak aktif selama periode tersebut otomatis tertolak, meminimalisir surface exposure pada sesi tak terpantau.

### C. Enhanced Brute Force Login Protection (Mengatasi SEC-03)
*   **Aksi:** Modifikasi `AppServiceProvider.php` bagian RateLimiter.
*   Logika throttle dirubah dari `.by($request->ip())` menjadi `.by($request->input('email').$request->ip())`.
*   Mencegah *User Enumeration* maupun *Collateral IP Banning* berkat diskriminasi antara username spesifik dan lokasi penyerang.

---

## 4. Verification & Regression Tests

1.  **Backend Tests (`php artisan test`):**
    *   `Tests: 12 passed, 48 assertions`.
    *   Flow `AuthTest` untuk login dan logout berhasil disesuaikan, memastikan response tanpa plaintext token berjalan baik.
    *   Guest access ditolak (401), Editor access pada setting ditolak (403).
2.  **Lint & Build (`npm run lint && npm run build`):**
    *   0 error, 0 warning dari ESLint. Build vite sukses (`dist` files termanajemen rapi).
3.  **Application Runtime:**
    *   Aplikasi Laravel & Vite dapat digabung mulus dengan interceptors API baru, tanpa kehilangan konektivitas *me* endpoint, menjamin React state tetap solid dan tidak merusak layout.

---

**Next Phase:** PHASE 14 — DEPLOYMENT & PRODUCTION.

<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    | Origin diizinkan, dipisahkan koma via env CORS_ALLOWED_ORIGINS.
    | Default hanya development origin. Di production wajib diisi origin domain.
    | Tidak memakai wildcard untuk data protected.
    */
    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173'))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Token-based (Sanctum bearer) dan SPA Auth (Cookie) — wajib true untuk HttpOnly cookies
    'supports_credentials' => true,
];

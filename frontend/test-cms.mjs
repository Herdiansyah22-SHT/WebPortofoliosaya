import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

let cookieJar = '';

// Helper untuk menangkap Set-Cookie
api.interceptors.response.use((res) => {
  if (res.headers['set-cookie']) {
    const cookies = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
    if (cookies) cookieJar = cookies;
  }
  return res;
});

// Helper untuk mengirim Cookie dan XSRF-TOKEN
api.interceptors.request.use((req) => {
  if (cookieJar) {
    req.headers['Cookie'] = cookieJar;
    const match = cookieJar.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      req.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
  }
  return req;
});

async function runTests() {
  try {
    console.log('[1] Meminta CSRF Token...');
    await api.get('/sanctum/csrf-cookie');

    console.log('[2] Melakukan Login (Admin)...');
    await api.post('/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'password'
    });
    console.log('    Login Berhasil!');

    console.log('\\n[3] TEST: Validasi Form (Harus Gagal)');
    try {
      await api.post('/api/v1/admin/projects', {
        status: 'draft' // Sengaja dikosongkan 'title' untuk memicu 422
      });
      console.error('    FAIL: Validasi lolos padahal title kosong.');
    } catch (err) {
      if (err.response?.status === 422) {
        console.log('    PASS: API menolak data tidak lengkap (422). Error:', err.response.data.errors.title[0]);
      } else {
        throw err;
      }
    }

    console.log('\\n[4] TEST: Create Post dengan Relasi Category & Tags');
    const newPost = await api.post('/api/v1/admin/posts', {
      title: 'Artikel Uji Coba Deep Test',
      excerpt: 'Mencoba relasi dan slug',
      body: '<p>Ini adalah konten</p>',
      status: 'published',
      tags: 'Testing, Laravel, Sanctum',
      category_id: 1 // Tutorial
    });
    console.log('    PASS: Post dibuat. ID:', newPost.data.data.id, 'Slug otomatis:', newPost.data.data.slug);
    console.log('    Tags yang tersambung:', newPost.data.data.tags.map(t => t.name).join(', '));

    console.log('\\n[5] TEST: Delete Post (Cleanup)');
    await api.delete(`/api/v1/admin/posts/${newPost.data.data.id}`);
    console.log('    PASS: Post berhasil dihapus.');

  } catch (error) {
    console.error('ERROR:', error.response ? error.response.data : error.message);
  }
}

runTests();
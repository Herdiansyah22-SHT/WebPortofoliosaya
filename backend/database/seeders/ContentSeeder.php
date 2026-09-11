<?php

namespace Database\Seeders;

use App\Enums\ContentStatus;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Post;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSkills();
        $this->seedProjects();
        $this->seedExperiences();
        $this->seedEducations();
        $this->seedCertificates();
        $this->seedCategoriesAndPosts();
    }

    private function seedSkills(): void
    {
        $skills = [
            ['name' => 'Laravel', 'category' => 'Web Development', 'level' => 90, 'sort_order' => 1],
            ['name' => 'PHP', 'category' => 'Web Development', 'level' => 85, 'sort_order' => 2],
            ['name' => 'MySQL', 'category' => 'Database', 'level' => 85, 'sort_order' => 1],
            ['name' => 'HTML & CSS', 'category' => 'Web Development', 'level' => 85, 'sort_order' => 3],
            ['name' => 'JavaScript', 'category' => 'Web Development', 'level' => 75, 'sort_order' => 4],
            ['name' => 'Tailwind CSS', 'category' => 'Web Development', 'level' => 65, 'sort_order' => 5],
            ['name' => 'React', 'category' => 'Web Development', 'level' => 60, 'sort_order' => 6],
            ['name' => 'Database Design', 'category' => 'Database', 'level' => 70, 'sort_order' => 2],
            ['name' => 'Git & GitHub', 'category' => 'Dev Tools', 'level' => 75, 'sort_order' => 1],
            ['name' => 'Postman', 'category' => 'Dev Tools', 'level' => 70, 'sort_order' => 2],
            ['name' => 'VS Code', 'category' => 'Dev Tools', 'level' => 85, 'sort_order' => 3],
            ['name' => 'REST API', 'category' => 'Web Development', 'level' => 80, 'sort_order' => 7],
            ['name' => 'Figma', 'category' => 'UI/UX', 'level' => 70, 'sort_order' => 1],
            ['name' => 'Multimedia', 'category' => 'UI/UX', 'level' => 75, 'sort_order' => 2],
            ['name' => 'Docker (dasar)', 'category' => 'Other', 'level' => 45, 'sort_order' => 1],
            ['name' => 'Linux & Bash', 'category' => 'Other', 'level' => 55, 'sort_order' => 2],
        ];

        foreach ($skills as $skill) {
            Skill::updateOrCreate(
                ['name' => $skill['name']],
                $skill + ['is_active' => true]
            );
        }
    }

    private function seedProjects(): void
    {
        $projects = [
            [
                'title' => 'Smart Inventory AI',
                'slug' => 'smart-inventory-ai',
                'summary' => 'ERP & manajemen inventaris berbasis web dengan pencatatan stok real-time.',
                'description' => implode("\n", [
                    '<h2>Overview</h2><p>Smart Inventory AI adalah aplikasi ERP yang menangani manajemen inventaris, pencatatan barang masuk-keluar, dan laporan stok untuk kebutuhan gudang dan operasional bisnis.</p>',
                    '<h2>Problem</h2><p>Pencatatan inventaris manual rentan salah catat, data tidak real-time, dan sulit dibuat laporan akurat untuk pengambilan keputusan.</p>',
                    '<h2>Solution</h2><p>Aplikasi mencatat seluruh pergerakan stok secara digital, menyediakan dashboard ringkasan, dan memudahkan pelacakan riwayat barang.</p>',
                    '<h2>Features</h2><ul><li>Manajemen barang, kategori, dan supplier</li><li>Transaksi barang masuk & keluar</li><li>Ringkasan stok real-time</li><li>Laporan stok</li></ul>',
                    '<h2>Technical Stack</h2><p>Laravel, PHP, MySQL.</p>',
                    '<h2>Architecture</h2><p>Monolith Laravel MVC dengan Eloquent ORM dan template server-side.</p>',
                    '<h2>Challenges</h2><p>Menyusun relasi inventaris yang konsisten dan menjaga akurasi laporan.</p>',
                    '<h2>Result</h2><p>Sistem membantu pemilik bisnis memantau stok secara akurat dan cepat.</p>',
                ]),
                'live_url' => null,
                'repo_url' => 'https://github.com',
                'status' => ContentStatus::Published,
                'is_featured' => true,
                'sort_order' => 1,
                'start_date' => '2025-01-01',
                'published_at' => now(),
                'technologies' => ['Laravel', 'PHP', 'MySQL'],
            ],
            [
                'title' => 'Tridig — Company Profile & CMS',
                'slug' => 'tridig',
                'summary' => 'Website company profile dengan CMS agar konten perusahaan dapat dikelola secara dinamis.',
                'description' => implode("\n", [
                    '<h2>Overview</h2><p>Tridig adalah website company profile yang dilengkapi CMS untuk mengelola halaman, berita, dan konten perusahaan tanpa mengubah kode.</p>',
                    '<h2>Problem</h2><p>Konten perusahaan sering berubah; update langsung pada kode lambat dan bergantung pengembang.</p>',
                    '<h2>Solution</h2><p>CMS memungkinkan tim mengelola konten sendiri melalui panel admin.</p>',
                    '<h2>Features</h2><ul><li>Halaman company profile</li><li>CMS konten dinamis</li><li>Manajemen berita</li></ul>',
                    '<h2>Technical Stack</h2><p>Laravel, PHP.</p>',
                    '<h2>Architecture</h2><p>Laravel MVC dengan role admin dan area publik terpisah.</p>',
                    '<h2>Challenges</h2><p>Merancang skema konten yang flexibel tapi tetap simpel.</p>',
                    '<h2>Result</h2><p>Perusahaan dapat memperbarui informasi secara mandiri.</p>',
                ]),
                'live_url' => null,
                'repo_url' => 'https://github.com',
                'status' => ContentStatus::Published,
                'is_featured' => true,
                'sort_order' => 2,
                'start_date' => '2024-06-01',
                'published_at' => now(),
                'technologies' => ['Laravel', 'PHP'],
            ],
            [
                'title' => 'PSHT Rayon Banjarkemantren — Landing Page & CMS',
                'slug' => 'psht-rayon-banjarkemantren',
                'summary' => 'Landing page resmi lengkap dengan CMS untuk pengumuman dan informasi organisasi.',
                'description' => implode("\n", [
                    '<h2>Overview</h2><p>Landing page dan CMS untuk PSHT Rayon Banjarkemantren sebagai media informasi dan pengumuman organisasi.</p>',
                    '<h2>Problem</h2><p>Informasi organisasi tersebar dan tidak terpusat.</p>',
                    '<h2>Solution</h2><p>Landing page terpusat dengan manajer konten untuk pengumuman.</p>',
                    '<h2>Features</h2><ul><li>Landing page profil rayon</li><li>Menu pengumuman via CMS</li></ul>',
                    '<h2>Technical Stack</h2><p>Laravel, PHP.</p>',
                    '<h2>Architecture</h2><p>Laravel MVC sederhana.</p>',
                    '<h2>Challenges</h2><p>Menjaga performa landing page tetap ringan.</p>',
                    '<h2>Result</h2><p>Informasi organisasi mudah diakses dan diperbarui.</p>',
                ]),
                'live_url' => null,
                'repo_url' => 'https://github.com',
                'status' => ContentStatus::Published,
                'is_featured' => false,
                'sort_order' => 3,
                'start_date' => '2024-02-01',
                'published_at' => now(),
                'technologies' => ['Laravel', 'PHP'],
            ],
            [
                'title' => 'Sistem E-Booking & E-Ticketing Pendakian Gunung',
                'slug' => 'sistem-e-booking-e-ticketing-pendakian-gunung',
                'summary' => 'Tugas akhir: sistem booking & ticketing pendakian dengan arsitektur multi-tenant.',
                'description' => implode("\n", [
                    '<h2>Overview</h2><p>Sistem e-booking dan e-ticketing untuk pendakian gunung dengan konsep multi-tenant agar dapat dipakai banyak pengelola jalur.</p>',
                    '<h2>Problem</h2><p>Booking pendakian manual menyulitkan pengelolaan kuota dan validasi tiket.</p>',
                    '<h2>Solution</h2><p>Booking online dengan kuota, tiket digital, dan dashboard pengelola per tenant.</p>',
                    '<h2>Features</h2><ul><li>Pendaftaran & booking pendakian</li><li>E-ticket dengan kode unik</li><li>Multi-tenant pengelola jalur</li></ul>',
                    '<h2>Technical Stack</h2><p>Laravel, PHP, MySQL, multi-tenant.</p>',
                    '<h2>Architecture</h2><p>Monolith dengan pemisahan tenant berbasis database/skema dan middleware tenant.</p>',
                    '<h2>Challenges</h2><p>Mengisolasi data antar tenant tanpa kebocoran data.</p>',
                    '<h2>Result</h2><p>Alur booking lebih terstruktur dan tiket mudah diverifikasi.</p>',
                ]),
                'live_url' => null,
                'repo_url' => 'https://github.com',
                'status' => ContentStatus::Published,
                'is_featured' => false,
                'sort_order' => 4,
                'start_date' => '2025-08-01',
                'published_at' => now(),
                'technologies' => ['Laravel', 'PHP', 'MySQL', 'Multi-Tenant'],
            ],
        ];

        foreach ($projects as $data) {
            $technologies = $data['technologies'];
            unset($data['technologies']);

            $project = Project::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );

            $project->technologies()->delete();
            foreach ($technologies as $index => $name) {
                $project->technologies()->create(['name' => $name, 'sort_order' => $index]);
            }
        }
    }

    private function seedExperiences(): void
    {
        $experiences = [
            ['company' => 'J&T Express', 'position' => 'Staf Logistik', 'location' => 'Surabaya', 'start_date' => '2023-05-01', 'end_date' => null, 'is_current' => false, 'description' => 'Menangani proses sortir dan distribusi paket harian.'],
            ['company' => 'Ninja Xpress', 'position' => 'Staf Operasional', 'location' => 'Surabaya', 'start_date' => '2022-09-01', 'end_date' => '2023-04-01', 'is_current' => false, 'description' => 'Membantu proses administrasi dan operasional pengiriman.'],
            ['company' => 'CV Kembar Perdana', 'position' => 'Staf Produksi', 'location' => 'Sidoarjo', 'start_date' => '2021-07-01', 'end_date' => '2022-08-01', 'is_current' => false, 'description' => 'Terlibat dalam proses produksi dan quality check.'],
            ['company' => 'Delta Printing', 'position' => 'Desain Grafis (Magang)', 'location' => 'Sidoarjo', 'start_date' => '2020-06-01', 'end_date' => '2020-12-01', 'is_current' => false, 'description' => 'Mendesain materi cetak dengan latar belakang Multimedia.'],
            ['company' => 'KKN', 'position' => 'Peserta KKN', 'location' => 'Desa', 'start_date' => '2024-07-01', 'end_date' => '2024-09-01', 'is_current' => false, 'description' => 'Program pengabdian masyarakat terstruktur.'], ];

        foreach ($experiences as $experience) {
            Experience::updateOrCreate(
                ['company' => $experience['company'], 'position' => $experience['position']],
                $experience + ['is_active' => true]
            );
        }
    }

    private function seedEducations(): void
    {
        $educations = [
            ['institution' => 'Universitas 17 Agustus 1945 Surabaya', 'degree' => 'S1', 'field_of_study' => 'Teknik Informatika', 'start_year' => 2022, 'end_year' => 2026, 'description' => 'Fokus pada pengembangan web. IPK 3.42 / 4.00.'],
            ['institution' => 'SMK Antartika 2 Sidoarjo', 'degree' => 'SMK', 'field_of_study' => 'Multimedia', 'start_year' => 2019, 'end_year' => 2021, 'description' => 'Latar belakang desain dan multimedia.'], ];

        foreach ($educations as $education) {
            Education::updateOrCreate(
                ['institution' => $education['institution']],
                $education + ['is_active' => true]
            );
        }
    }

    private function seedCertificates(): void
    {
        $certificates = [
            ['title' => 'LSP Junior Web Developer', 'issuer' => 'LSP', 'credential_id' => null, 'credential_url' => null, 'issued_date' => '2026-01-15', 'expiration_date' => null, 'sort_order' => 1],
        ];

        foreach ($certificates as $certificate) {
            Certificate::updateOrCreate(
                ['title' => $certificate['title']],
                $certificate + ['is_active' => true]
            );
        }
    }

    private function seedCategoriesAndPosts(): void
    {
        $category = Category::updateOrCreate(
            ['slug' => 'tutorial'],
            ['name' => 'Tutorial', 'is_active' => true]
        );

        $tag = Tag::firstOrCreate(['name' => 'Laravel'], ['slug' => 'laravel']);
        $author = User::where('email', 'admin@example.com')->first();

        $posts = [
            [
                'title' => 'Membangun REST API dengan Laravel',
                'slug' => 'membangun-rest-api-dengan-laravel',
                'excerpt' => 'Panduan dasar membangun REST API yang rapi dan terstruktur menggunakan Laravel.',
                'body' => implode("\n", [
                    '<h2>Pendahuluan</h2><p>REST API menjadi jembatan antara frontend dan backend. Laravel menyediakan fondasi yang rapi untuk membangunnya.</p>',
                    '<h2>Struktur Dasar</h2><p>Gunakan controllers, form requests, dan resources untuk menjaga konsistensi respons.</p>',
                    '<h2>Kesimpulan</h2><p>Dengan validasi dan error handling yang konsisten, API mudah dikonsumsi frontend dan aman.</p>',
                ]),
                'status' => ContentStatus::Published,
                'published_at' => now(),
                'tags' => ['Laravel', 'API'],
            ],
            [
                'title' => 'Decoupled Frontend dan Backend untuk Portfolio',
                'slug' => 'decoupled-frontend-backend-untuk-portfolio',
                'excerpt' => 'Kenapa memisahkan React dan Laravel membuat portfolio lebih profesional.',
                'body' => implode("\n", [
                    '<h2>Kenapa Decoupled?</h2><p>Pemisahan frontend dan backend memperjelas tanggung jawab dan memudahkan scaling.</p>',
                    '<h2>Arsitektur</h2><p>React mengonsumsi REST API dari Laravel; backend menjadi satu-satunya security boundary.</p>',
                ]),
                'status' => ContentStatus::Published,
                'published_at' => now()->subDay(),
                'tags' => ['React', 'Laravel'],
            ],
        ];

        foreach ($posts as $data) {
            $tags = $data['tags'];
            unset($data['tags']);

            $post = Post::updateOrCreate(
                ['slug' => $data['slug']],
                $data + [
                    'category_id' => $category->id,
                    'author_id' => $author?->id,
                    'reading_time' => max(1, (int) ceil(str_word_count(strip_tags($data['body'])) / 200)),
                ]
            );

            $post->tags()->sync(Tag::firstOrCreate(['name' => $tag->name], ['slug' => $tag->slug])->id);
            foreach ($tags as $name) {
                $slug = str()->slug($name);
                $post->tags()->syncWithoutDetaching(Tag::firstOrCreate(['name' => $name], ['slug' => $slug])->id);
            }
        }
    }
}

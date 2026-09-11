<?php

namespace App\Http\Controllers;

use App\Enums\ContentStatus;
use App\Models\Post;
use App\Models\Project;

class SitemapController extends Controller
{
    public function __invoke()
    {
        $base = rtrim(config('app.url'), '/');

        $static = [
            '', '/about', '/skills', '/projects', '/experience', '/education', '/certificates', '/blog', '/contact',
        ];

        $projects = Project::where('status', ContentStatus::Published)->pluck('slug');
        $posts = Post::where('status', ContentStatus::Published)->pluck('slug');

        $urls = collect($static)->map(fn ($path) => ['loc' => $base.$path])
            ->merge($projects->map(fn ($slug) => ['loc' => $base.'/projects/'.$slug]))
            ->merge($posts->map(fn ($slug) => ['loc' => $base.'/blog/'.$slug]))
            ->map(function ($entry) {
                return '<url><loc>'.e($entry['loc']).'</loc></url>';
            })
            ->implode("\n  ");

        $xml = implode("\n", [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            '  '.$urls,
            '</urlset>',
        ]);

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}

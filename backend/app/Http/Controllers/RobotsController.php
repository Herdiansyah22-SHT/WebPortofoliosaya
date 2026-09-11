<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;

class RobotsController extends Controller
{
    public function __invoke()
    {
        $base = rtrim(config('app.url'), '/');
        $custom = (string) (SiteSetting::where('key', 'seo.robots_txt')->value('value') ?? '');

        $sitemap = "Sitemap: {$base}/sitemap.xml";

        if (str_contains($custom, 'Sitemap:')) {
            $body = rtrim($custom)."\n";
        } else {
            $body = rtrim($custom)."\n\n{$sitemap}\n";
        }

        return response($body, 200, ['Content-Type' => 'text/plain']);
    }
}

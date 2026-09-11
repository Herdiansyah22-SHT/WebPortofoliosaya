<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    private const KEYS = [
        'site.name',
        'site.tagline',
        'site.description',
        'site.social_links',
        'seo.default_title',
        'seo.default_description',
        'seo.default_og_type',
        'seo.default_og_image',
        'seo.robots_txt',
    ];

    public function show(): JsonResponse
    {
        $flat = SiteSetting::whereIn('key', self::KEYS)
            ->pluck('value', 'key')
            ->map(fn ($value) => $value === '' ? null : $value)
            ->all();

        $nested = [];

        foreach ($flat as $key => $value) {
            [$group, $name] = explode('.', $key, 2);
            $nested[$group][$name] = $value;
        }

        return ApiResponse::success($nested, 'Pengaturan situs.');
    }
}

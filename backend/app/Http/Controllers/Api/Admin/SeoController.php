<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SeoRequest;
use App\Models\SiteSetting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class SeoController extends Controller
{
    private const KEYS = [
        'seo.default_title',
        'seo.default_description',
        'seo.default_og_type',
        'seo.default_og_image',
        'seo.robots_txt',
    ];

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->values(), 'Pengaturan SEO.');
    }

    public function update(SeoRequest $request): JsonResponse
    {
        foreach (self::KEYS as $key) {
            if ($request->has($key)) {
                SiteSetting::updateOrCreate(['key' => $key], ['value' => $request->input($key) ?? '']);
            }
        }

        return ApiResponse::success($this->values(), 'Pengaturan SEO diperbarui.');
    }

    private function values(): array
    {
        return $this->nested(
            SiteSetting::whereIn('key', self::KEYS)
                ->pluck('value', 'key')
                ->map(fn ($value) => $value === '' ? null : $value)
                ->all()
        );
    }

    private function nested(array $flat): array
    {
        $nested = [];

        foreach ($flat as $key => $value) {
            [$group, $name] = explode('.', $key, 2);
            $nested[$group][$name] = $value;
        }

        return $nested;
    }
}

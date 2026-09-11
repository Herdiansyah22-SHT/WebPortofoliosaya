<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SettingRequest;
use App\Models\SiteSetting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    private const KEYS = [
        'site.name',
        'site.tagline',
        'site.description',
        'site.social_links',
    ];

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->values(), 'Pengaturan situs.');
    }

    public function update(SettingRequest $request): JsonResponse
    {
        foreach (self::KEYS as $key) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $request->input($key) ?? '']);
        }

        return ApiResponse::success($this->values(), 'Pengaturan situs diperbarui.');
    }

    private function values(): array
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

        return $nested;
    }
}

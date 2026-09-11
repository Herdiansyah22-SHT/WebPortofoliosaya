<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Media;
use App\Models\Profile;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return ApiResponse::success(new ProfileResource(Profile::firstOrFail()), 'Profile admin.');
    }

    public function update(ProfileRequest $request): JsonResponse
    {
        $profile = Profile::firstOrFail();
        $profile->update(collect($request->validated())->except(['photo_media_id'])->all());

        if ($request->has('photo_media_id')) {
            if ($request->filled('photo_media_id')) {
                Media::attachTo($profile, (int) $request->integer('photo_media_id'), 'profile_photo');
            } else {
                Media::where('model_type', $profile->getMorphClass())
                    ->where('model_id', $profile->getKey())
                    ->where('collection', 'profile_photo')
                    ->update(['model_type' => null, 'model_id' => null]);
            }
        }

        return ApiResponse::success(new ProfileResource($profile), 'Profile diperbarui.');
    }
}

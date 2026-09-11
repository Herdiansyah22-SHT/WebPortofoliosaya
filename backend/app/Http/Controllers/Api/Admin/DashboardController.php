<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Media;
use App\Models\Post;
use App\Models\Project;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success([
            'projects' => Project::count(),
            'posts' => Post::count(),
            'media' => Media::count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count(),
        ], 'Dashboard.');
    }
}

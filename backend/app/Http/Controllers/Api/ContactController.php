<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ContactRequest;
use App\Models\ContactMessage;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(ContactRequest $request): JsonResponse
    {
        $message = ContactMessage::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'subject' => $request->input('subject'),
            'message' => $request->input('message'),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr($request->userAgent() ?? '', 0, 255),
        ]);

        return ApiResponse::success(['id' => $message->id], 'Pesan berhasil dikirim.', 201);
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\ContactMessage;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }

        $paginator = $query->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(
            MessageResource::collection($paginator->items()),
            'Daftar pesan.',
            200,
            $this->meta($paginator)
        );
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new MessageResource(ContactMessage::findOrFail($id)), 'Detail pesan.');
    }

    public function update(MessageRequest $request, int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        $message->update([
            'is_read' => $request->boolean('is_read'),
            'read_at' => $request->boolean('is_read') ? now() : null,
        ]);

        return ApiResponse::success(new MessageResource($message), 'Status pesan diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        ContactMessage::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Pesan dihapus.');
    }

    private function meta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesApiQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = Review::query()->ordered();

        $filters = $request->query('filter', []);
        if (! is_array($filters) || ! array_key_exists('is_active', $filters)) {
            $query->where('is_active', true);
        }

        $this->applyFilters($query, $request, [
            'is_active' => fn ($q, $v) => $q->where('is_active', filter_var($v, FILTER_VALIDATE_BOOLEAN)),
            'rating' => 'rating',
            'ids' => function ($q, $value) {
                $ids = array_filter(array_map('intval', explode(',', (string) $value)));
                if (! empty($ids)) {
                    $q->whereIn('id', $ids);
                }
            },
            'has_avatar' => fn ($q, $v) => $q->whereNotNull('avatar'),
            'has_video' => fn ($q, $v) => $q->whereNotNull('video_id'),
        ]);

        if ($fields = $this->requestedFields(
            $request,
            [
                'name',
                'review_date',
                'rating',
                'text',
                'avatar',
                'video_id',
                'source_url',
                'position',
                'is_active',
                'created_at',
                'updated_at',
            ]
        )) {
            $query->select($fields);
        }

        $reviews = $query
            ->paginate($limit)
            ->appends($request->query());

        return ReviewResource::collection($reviews);
    }
}

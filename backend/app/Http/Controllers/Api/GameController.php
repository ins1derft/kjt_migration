<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Concerns\HandlesApiQuery;

class GameController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = Game::query()
            ->with(['categories', 'products.landingPage'])
            ->orderBy('title');

        $this->applyFilters($query, $request, [
            'slug' => 'slug',
            'title' => fn ($q, $v) => $q->where('title', 'ilike', '%' . $v . '%'),
            'genre' => 'genre',
            'category' => function ($q, $v) {
                $slugs = array_filter(array_map('trim', explode(',', (string) $v)));
                if (count($slugs) === 0) {
                    return;
                }

                $q->whereHas('categories', fn ($categories) => $categories->whereIn('slug', $slugs));
            },
            'target_age' => 'target_age',
            'game_type' => 'game_type',
            'is_indexable' => 'is_indexable',
        ]);

        if ($fields = $this->requestedFields($request, [
            'slug', 'title', 'genre', 'target_age', 'excerpt', 'body', 'hero_image', 'video_id', 'game_type',
            'video_url', 'is_indexable', 'seo_title', 'seo_description', 'seo_canonical', 'seo_og_image',
            'created_at', 'updated_at',
        ])) {
            $query->select($fields);
        }

        $games = $query->paginate($limit)->appends($request->query());

        return GameResource::collection($games);
    }

    public function show(string $slug): GameResource
    {
        $game = Game::query()
            ->with(['categories', 'products.landingPage'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new GameResource($game);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesApiQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 200) : 12;

        $requestedFields = $request->query('fields');
        $requestedKeys = is_string($requestedFields)
            ? array_filter(array_map('trim', explode(',', $requestedFields)))
            : [];

        $query = Article::query()
            ->when(empty($requestedKeys) || in_array('categories', $requestedKeys, true), fn ($q) => $q->with('categories'))
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        $this->applyFilters($query, $request, [
            'category' => fn ($q, $v) => $q->whereHas('categories', fn ($c) => $c->where('slug', $v)),
            'slug' => 'slug',
            'title' => fn ($q, $v) => $q->where('title', 'ilike', '%'.$v.'%'),
            'status' => 'status',
        ]);

        if ($fields = $this->requestedFields($request, [
            'slug', 'title', 'excerpt', 'body', 'featured_image', 'video_id', 'status', 'published_at',
            'seo_title', 'seo_description', 'seo_canonical', 'seo_og_image', 'created_at', 'updated_at',
        ])) {
            $query->select($fields);
        }

        $articles = $query->paginate($limit)->appends($request->query());

        return ArticleResource::collection($articles);
    }

    public function show(string $slug): ArticleResource
    {
        $article = Article::query()
            ->with('categories')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return new ArticleResource($article);
    }
}

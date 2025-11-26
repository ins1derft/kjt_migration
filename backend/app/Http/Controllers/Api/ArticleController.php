<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = Article::query()
            ->with('categories')
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($category = $request->query('category')) {
            $query->whereHas('categories', fn ($q) => $q->where('slug', $category));
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

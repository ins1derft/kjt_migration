<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleCategoryResource;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;

class ArticleCategoryController extends Controller
{
    public function index(Request $request)
    {
        $includeEmpty = $request->boolean('include_empty', false);

        $articleScope = function ($q): void {
            $q->where('status', 'published');
        };

        $query = ArticleCategory::query()
            ->withCount([
                'articles as articles_count' => $articleScope,
            ])
            ->orderBy('position')
            ->orderBy('name');

        if (! $includeEmpty) {
            $query->whereHas('articles', $articleScope);
        }

        return ArticleCategoryResource::collection($query->get());
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameCategoryResource;
use App\Models\GameCategory;
use Illuminate\Http\Request;

class GameCategoryController extends Controller
{
    public function index(Request $request)
    {
        $includeEmpty = filter_var($request->query('include_empty', false), FILTER_VALIDATE_BOOLEAN);

        $query = GameCategory::query()
            ->withCount('games')
            ->orderBy('name');

        if (!$includeEmpty) {
            $query->has('games');
        }

        return GameCategoryResource::collection($query->get());
    }
}


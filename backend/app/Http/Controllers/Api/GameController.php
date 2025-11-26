<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = Game::query()
            ->with('categories')
            ->orderBy('title');

        $games = $query->paginate($limit)->appends($request->query());

        return GameResource::collection($games);
    }

    public function show(string $slug): GameResource
    {
        $game = Game::query()
            ->with('categories')
            ->where('slug', $slug)
            ->firstOrFail();

        return new GameResource($game);
    }
}

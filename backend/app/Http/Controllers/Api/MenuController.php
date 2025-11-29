<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $location = $request->query('location');

        if ($location && !in_array($location, ['header', 'footer'], true)) {
            $location = null;
        }

        $menus = Menu::query()
            ->where('is_active', true)
            ->when($location, function ($query) use ($location) {
                $query->where('location', $location);
            })
            ->with(['rootItems.childrenRecursive'])
            ->orderBy('name')
            ->get();

        return MenuResource::collection($menus);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreProductResource;
use App\Models\StoreProduct;
use Illuminate\Http\Request;

class StoreProductController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = StoreProduct::query()
            ->with('categories')
            ->orderBy('name');

        if ($request->boolean('available')) {
            $query->where('is_available', true);
        }

        $products = $query->paginate($limit)->appends($request->query());

        return StoreProductResource::collection($products);
    }

    public function show(string $slug): StoreProductResource
    {
        $product = StoreProduct::query()
            ->with('categories')
            ->where('slug', $slug)
            ->firstOrFail();

        return new StoreProductResource($product);
    }
}

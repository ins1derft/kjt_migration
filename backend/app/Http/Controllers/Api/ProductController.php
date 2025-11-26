<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $products = Product::query()
            ->with([
                'variants' => fn ($q) => $q->orderBy('position')->orderBy('id'),
                'industries',
            ])
            ->orderBy('name')
            ->paginate($limit)
            ->appends($request->query());

        return ProductResource::collection($products);
    }

    public function show(string $slug): ProductResource
    {
        $product = Product::query()
            ->with([
                'variants' => fn ($q) => $q->orderBy('position')->orderBy('id'),
                'industries',
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }
}

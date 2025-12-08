<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Concerns\HandlesApiQuery;

class ProductController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = Product::query()
            ->with([
                'variants' => fn ($q) => $q
                    ->orderBy('position')
                    ->orderBy('id')
                    ->with(['attributeValues.attribute']),
                'form',
            ])
            ->orderBy('name');

        $this->applyFilters($query, $request, [
            'slug' => 'slug',
            'name' => fn ($q, $v) => $q->where('name', 'ilike', '%' . $v . '%'),
        ]);

        if ($fields = $this->requestedFields($request, [
            'slug', 'name', 'slogan', 'excerpt', 'description', 'hero_image',
            'default_cta_label', 'rating', 'review_count_label', 'badges', 'form_id',
            'seo_title', 'seo_description', 'seo_canonical', 'seo_og_image',
            'created_at', 'updated_at',
        ])) {
            $query->select($fields);
        }

        $products = $query->paginate($limit)->appends($request->query());

        return ProductResource::collection($products);
    }

    public function show(string $slug): ProductResource
    {
        $product = Product::query()
            ->with([
                'variants' => fn ($q) => $q
                    ->orderBy('position')
                    ->orderBy('id')
                    ->with(['attributeValues.attribute']),
                'form',
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }
}

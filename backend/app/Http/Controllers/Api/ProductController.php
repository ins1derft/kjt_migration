<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesApiQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $requestedFields = $request->query('fields');
        $requestedKeys = is_string($requestedFields)
            ? array_filter(array_map('trim', explode(',', $requestedFields)))
            : [];

        $shouldLoadLandingPage = empty($requestedKeys) || in_array('landing_page_slug', $requestedKeys, true);
        $shouldLoadVariants = empty($requestedKeys) || in_array('variants', $requestedKeys, true);
        $shouldLoadForm = empty($requestedKeys) || in_array('form', $requestedKeys, true);

        $query = Product::query()->orderBy('name');

        if ($shouldLoadVariants) {
            $query->with([
                'variants' => fn ($q) => $q
                    ->orderBy('position')
                    ->orderBy('id')
                    ->with(['attributeValues.attribute']),
            ]);
        }

        if ($shouldLoadForm) {
            $query->with('form');
        }

        if ($shouldLoadLandingPage) {
            $query->with('landingPage');
        }

        $this->applyFilters($query, $request, [
            'slug' => 'slug',
            'name' => fn ($q, $v) => $q->where('name', 'ilike', '%'.$v.'%'),
        ]);

        if ($fields = $this->requestedFields($request, [
            'slug', 'name', 'slogan', 'excerpt', 'description', 'hero_image',
            'default_cta_label', 'rating', 'review_count_label', 'badges', 'form_id',
            'compare_models_attribute_codes',
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
                'landingPage',
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }
}

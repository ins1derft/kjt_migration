<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesApiQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\SensoryRoomBundleResource;
use App\Models\SensoryRoomBundle;
use Illuminate\Http\Request;

class SensoryRoomBundleController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 100) : 12;

        $query = SensoryRoomBundle::query()
            ->with(['products.landingPage'])
            ->where('status', 'published')
            ->orderBy('position')
            ->orderBy('title');

        $this->applyFilters($query, $request, [
            'slug' => 'slug',
            'title' => fn ($q, $v) => $q->where('title', 'ilike', '%' . $v . '%'),
        ]);

        if ($fields = $this->requestedFields($request, [
            'slug',
            'title',
            'excerpt',
            'gallery',
            'specs',
            'form_code',
            'custom_bundle_url',
            'block_a_title',
            'block_a_items',
            'block_b_title',
            'block_b_text',
            'status',
            'position',
            'seo_title',
            'seo_description',
            'seo_canonical',
            'seo_og_image',
            'created_at',
            'updated_at',
        ])) {
            $query->select($fields);
        }

        $bundles = $query->paginate($limit)->appends($request->query());

        return SensoryRoomBundleResource::collection($bundles);
    }

    public function show(string $slug): SensoryRoomBundleResource
    {
        $bundle = SensoryRoomBundle::query()
            ->with(['products.landingPage'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return new SensoryRoomBundleResource($bundle);
    }
}

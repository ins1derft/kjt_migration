<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesApiQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\TeamMemberResource;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    use HandlesApiQuery;

    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 20);
        $limit = $limit > 0 ? min($limit, 100) : 20;

        $query = TeamMember::query()
            ->orderBy('position')
            ->orderBy('id');

        $this->applyFilters($query, $request, [
            'slug' => 'slug',
            'name' => fn ($q, $v) => $q->where('name', 'ilike', '%'.$v.'%'),
            'role' => fn ($q, $v) => $q->where('role', 'ilike', '%'.$v.'%'),
            'department' => 'department',
            'is_active' => 'is_active',
        ]);

        if (! $request->has('filter.is_active')) {
            $query->where('is_active', true);
        }

        if ($fields = $this->requestedFields($request, [
            'name', 'slug', 'role', 'department', 'photo', 'bio', 'position', 'is_active', 'created_at', 'updated_at',
        ])) {
            $query->select($fields);
        }

        $members = $query->paginate($limit)->appends($request->query());

        return TeamMemberResource::collection($members);
    }

    public function show(string $slug): TeamMemberResource
    {
        $member = TeamMember::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return new TeamMemberResource($member);
    }
}

<?php

namespace App\Http\Controllers\Api\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HandlesApiQuery
{
    /**
     * @param  array<string, string|callable>  $allowedFilters
     */
    protected function applyFilters(Builder $query, Request $request, array $allowedFilters): void
    {
        $filters = $request->query('filter', []);
        if (! is_array($filters)) {
            return;
        }

        foreach ($filters as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            if (! array_key_exists($key, $allowedFilters)) {
                continue;
            }

            $handler = $allowedFilters[$key];

            if (is_callable($handler)) {
                $handler($query, $value);

                continue;
            }

            $query->where($handler, $value);
        }
    }

    /**
     * @param  array<int, string>  $allowed
     * @param  array<int, string>  $always
     * @return array<int, string>
     */
    protected function requestedFields(Request $request, array $allowed, array $always = ['id']): array
    {
        $fields = $request->query('fields');

        if (! is_string($fields) || trim($fields) === '') {
            return [];
        }

        $requested = array_filter(array_map('trim', explode(',', $fields)));
        $selected = array_values(array_intersect($requested, $allowed));

        return array_values(array_unique([...$always, ...$selected]));
    }
}

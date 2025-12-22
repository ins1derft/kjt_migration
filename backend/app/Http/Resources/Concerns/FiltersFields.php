<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

trait FiltersFields
{
    protected function filterFields(array $data, Request $request): array
    {
        $fields = $request->query('fields');

        if (! is_string($fields) || trim($fields) === '') {
            return $data;
        }

        $keys = array_filter(array_map('trim', explode(',', $fields)));

        if (empty($keys)) {
            return $data;
        }

        return Arr::only($data, $keys);
    }
}

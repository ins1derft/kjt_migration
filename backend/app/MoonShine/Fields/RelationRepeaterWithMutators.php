<?php

namespace App\MoonShine\Fields;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Fields\Relationships\RelationRepeater;

class RelationRepeaterWithMutators extends RelationRepeater
{
    protected function resolveAfterApply(mixed $data): mixed
    {
        return $this->resolveAppliesCallback(
            data: $data,
            callback: static fn (FieldContract $field, mixed $values): mixed => $field->apply(
                static fn ($payload): mixed => data_set(
                    $payload,
                    $field->getColumn(),
                    $values[$field->getColumn()] ?? ''
                ),
                $values
            ),
            response: fn (array $values, mixed $data): Model => $this->saveRelationWithModels($values, $data),
            fill: true,
        );
    }

    private function saveRelationWithModels(array $items, Model $model): Model
    {
        $collection = new Collection($items);

        if (self::$silentApply) {
            data_set($model, $this->getRelationName(), $collection);

            return $model;
        }

        $relationName = $this->getColumn();
        $relation = $model->{$relationName}();

        $related = $relation->getRelated();
        $relatedKeyName = $related->getKeyName();
        $relatedQualifiedKeyName = $related->getQualifiedKeyName();

        $ids = $collection
            ->pluck($relatedKeyName)
            ->filter()
            ->toArray();

        $relation->when(
            ! empty($ids),
            static fn ($q) => $q->whereNotIn($relatedQualifiedKeyName, $ids)->delete(),
            static fn ($q) => $q->delete()
        );

        foreach ($collection as $item) {
            // Use a fresh relation query for each item to avoid leftover whereNotIn/where clauses
            $relation = $model->{$relationName}();

            if (empty($item[$relatedKeyName])) {
                unset($item[$relatedKeyName]);
                $relation->create($item);

                continue;
            }

            $existing = $relation->where($relatedKeyName, $item[$relatedKeyName])->first();

            if ($existing instanceof Model) {
                $existing->fill($item);
                $existing->save();
            }
        }

        return $model;
    }
}

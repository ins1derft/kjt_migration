<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    public const TYPES = ['string', 'number', 'boolean', 'json'];

    protected $guarded = [];

    protected $casts = [
        'position' => 'integer',
    ];

    public function values()
    {
        return $this->hasMany(ProductVariantAttributeValue::class);
    }

    public function variants()
    {
        return $this->belongsToMany(ProductVariant::class, 'product_variant_attribute_values')
            ->withPivot(['value', 'attribute_type', 'position']);
    }
}

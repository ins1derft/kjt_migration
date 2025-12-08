<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductAttribute;
use App\Models\ProductVariantAttributeValue;
use Illuminate\Support\Str;

class ProductVariant extends Model
{
    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function attributeValues()
    {
        return $this->hasMany(ProductVariantAttributeValue::class)
            ->with('attribute')
            ->orderBy('position');
    }

    public function attributes()
    {
        return $this->belongsToMany(ProductAttribute::class, 'product_variant_attribute_values')
            ->withPivot(['value', 'attribute_type', 'position']);
    }

    public function getSpecsAttribute(): array
    {
        return $this->attributeValues
            ->filter(fn ($value) => $value->attribute)
            ->mapWithKeys(function (ProductVariantAttributeValue $value) {
                $attribute = $value->attribute;
                $key = $attribute->code ?: Str::slug($attribute->name, '_');

                return [$key => $value->typedValue()];
            })
            ->toArray();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductVariant extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_highlighted' => 'boolean',
    ];

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

    public function attributeValuesString()
    {
        return $this->attributeValues()->whereHas('attribute', fn ($q) => $q->where('type', 'string'));
    }

    public function attributeValuesNumber()
    {
        return $this->attributeValues()->whereHas('attribute', fn ($q) => $q->where('type', 'number'));
    }

    public function attributeValuesBoolean()
    {
        return $this->attributeValues()->whereHas('attribute', fn ($q) => $q->where('type', 'boolean'));
    }

    public function attributeValuesJson()
    {
        return $this->attributeValues()->whereHas('attribute', fn ($q) => $q->where('type', 'json'));
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

    public function getSpecLabelMapAttribute(): array
    {
        return $this->attributeValues
            ->filter(fn ($value) => $value->attribute)
            ->mapWithKeys(function (ProductVariantAttributeValue $value) {
                $attribute = $value->attribute;
                $key = $attribute->code ?: Str::slug($attribute->name, '_');

                return [$key => $attribute->name ?? $key];
            })
            ->toArray();
    }
}

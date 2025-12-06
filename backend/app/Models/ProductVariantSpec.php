<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantSpec extends Model
{
    protected $guarded = [];

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}

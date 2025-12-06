<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function specRows()
    {
        return $this->hasMany(ProductVariantSpec::class)->orderBy('position');
    }
}

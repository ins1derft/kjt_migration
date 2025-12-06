<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormFieldOption extends Model
{
    protected $guarded = [];

    public function field()
    {
        return $this->belongsTo(FormField::class, 'form_field_id');
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'role',
        'department',
        'photo',
        'bio',
        'is_active',
        'position',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (TeamMember $member) {
            if (!$member->slug && $member->name) {
                $member->slug = Str::slug($member->name);
            }
        });
    }
}

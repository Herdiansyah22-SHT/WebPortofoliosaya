<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SeoMetadata extends Model
{
    use HasFactory;

    protected $fillable = [
        'seoable_type',
        'seoable_id',
        'title',
        'description',
        'og_image',
        'og_type',
        'canonical_url',
    ];

    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }
}

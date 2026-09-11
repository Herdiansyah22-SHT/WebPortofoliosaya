<?php

namespace App\Enums;

enum ContentStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    public function isPublished(): bool
    {
        return $this === self::Published;
    }
}

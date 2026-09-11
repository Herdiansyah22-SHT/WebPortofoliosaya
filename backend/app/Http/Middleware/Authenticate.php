<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * API-only app: never redirect to a web login route.
     * Unauthenticated requests always raise AuthenticationException → JSON 401.
     */
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}

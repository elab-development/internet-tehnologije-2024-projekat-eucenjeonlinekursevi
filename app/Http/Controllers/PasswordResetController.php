<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class PasswordResetController extends Controller
{
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
            
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Link za resetovanje lozinke je poslat na vasu e-mail adresu.'], 200);
        } else {
            return response()->json(['message' => 'Doslo je do greske. Pokusajte ponovo.'], 500);
        }
    }
}

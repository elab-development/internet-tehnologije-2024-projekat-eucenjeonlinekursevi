<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Korisnik; 
use App\Models\Profesor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registerKorisnik(Request $request)
    {
        $validated = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:korisniks',
            'username' => 'required|string|max:255|unique:korisniks',
            'password' => 'required|string|confirmed|min:8',
        ]);
    
        $korisnik = Korisnik::create([
            'ime' => $validated['ime'],
            'prezime' => $validated['prezime'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);
    
        return response()->json([
            'message' => 'User registered successfully',
        ], 201);
    }

    public function registerProfesor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:profesors',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $profesor = Profesor::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($profesor, 201);
    }

    public function loginKorisnik(Request $request)
    {
        $podaci = $request->only('email', 'password');

        $korisnik = Korisnik::where('email', $podaci['email'])->first();
    
        if ($korisnik && Hash::check($podaci['password'], $korisnik->password)) {
            $token = $korisnik->createToken('App')->plainTextToken;
    
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
            ], 200);
        }
    
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    
    public function loginProfesor(Request $request)
    {
        $podaci = $request->only('email', 'password');

        $profesor = Profesor::where('email', $podaci['email'])->first();

        if ($profesor && Hash::check($podaci['password'], $profesor->password)) {
            $token = $profesor->createToken('App')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
            ], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function logout(Request $request)
    {
        $user=$request->user();
        $user->currentAccessToken()->delete();
        return response()->json(['message'=>'Logout successful.'],200);
    }
}

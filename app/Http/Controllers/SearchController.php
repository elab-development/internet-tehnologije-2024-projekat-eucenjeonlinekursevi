<?php

namespace App\Http\Controllers;

use App\Models\Kurs;
use App\Models\Korisnik;
use App\Models\Profesor;
use App\Models\Komentar;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
        ]);

        $kursevi = Kurs::where('naziv', 'LIKE', '%' . $request->input('query') . '%')
            ->orWhere('opis', 'LIKE', '%' . $request->input('query') . '%')
            ->get();

        $korisnici = Korisnik::where('ime', 'LIKE', '%' . $request->input('query') . '%')
            ->orWhere('email', 'LIKE', '%' . $request->input('query') . '%')
            ->get();

        $profesori = Profesor::where('ime', 'LIKE', '%' . $request->input('query') . '%')
            ->get();

        $komentari = Komentar::where('tekst', 'LIKE', '%' . $request->input('query') . '%')
            ->get();

        return response()->json([
            'kurs' => $kursevi,
            'korisniks' => $korisnici,
            'profesors' => $profesori,
            'komentars' => $komentari
        ]);
    }
}
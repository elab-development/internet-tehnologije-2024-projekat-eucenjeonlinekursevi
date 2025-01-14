<?php

namespace App\Http\Controllers;

use App\Models\Komentar;
use App\Models\Korisnik;
use App\Models\Kurs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KomentarController extends Controller
{
    


    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Niste autentifikovani.'], 401);
        }
        $request->validate([
            'tekst' => 'required|string|max:255',
            'kurs_id' => 'required|exists:kurs,id',
        ]);
        $komentar = Komentar::create([
            'tekst' => $request->tekst,
            'korisnik_id' => Auth::id(),
            'kurs_id' => $request->kurs_id,
        ]);
        return response()->json([
            'message' => 'Komentar uspesno kreiran.',
            'komentar' => $komentar
        ], 201);
    }
    public function show($id)
    {
        $komentar = Komentar::find($id);

        if (!$komentar) {
            return response()->json(['message' => 'Komentar nije pronadjen'], 404);
        }
        return response()->json($komentar);
    }

    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Niste autentifikovani.'], 401);
        }
        $request->validate([
            'tekst' => 'required|string|max:255',
        ]);
        $komentar = Komentar::find($id);
        if (!$komentar) {
            return response()->json(['message' => 'Komentar nije pronadjen'], 404);
        }

        if ($komentar->korisnik_id !== Auth::id()) {
            return response()->json(['message' => 'Nemate pravo da azurirate ovaj komentar.'], 403);
        }

        $komentar->update([
            'tekst' => $request->tekst,
        ]);
        return response()->json([
            'message' => 'Komentar uspesno azuriran.',
            'komentar' => $komentar
        ]);
    }

    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Niste autentifikovani.'], 401);
        }
        $komentar = Komentar::find($id);

        if (!$komentar) {
            return response()->json(['message' => 'Komentar nije pronadjen.'], 404);
        }
        if ($komentar->korisnik_id !== Auth::id()) {
            return response()->json(['message' => 'Nemate pravo da obrisete ovaj komentar.'], 403);
        }
        $komentar->delete();

        return response()->json(['message' => 'Komentar obrisan.']);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Kurs;
use Illuminate\Http\Request;

class KursController extends Controller
{
    public function index()
    {
        $kursevi = Kurs::all();
        return response()->json($kursevi);
    }
    public function create()
    {
        
    }
    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'required|string',
        ]);
    
        $kurs = Kurs::create($request->all());
        return response()->json($kurs, 201);
    }

    public function show(string $id)
    {
        $kurs = Kurs::find($id);
        if ($kurs) {
            return response()->json($kurs);
        }
        return response()->json(['message' => 'Kurs not found'], 404);
    }
    public function edit(string $id)
    {
        
    }
    public function update(Request $request, string $id)
    {
        $kurs = Kurs::find($id);
        if ($kurs) {
            $kurs->update($request->all());
            return response()->json($kurs);
        }
        return response()->json(['message' => 'Kurs not found'], 404);
    }
    public function destroy(string $id)
    {
        $kurs = Kurs::find($id);
        if ($kurs) {
            $kurs->delete();
            return response()->json(['message' => 'Kurs deleted']);
        }
        return response()->json(['message'=> 'Kurs not found'],404);
    }
}
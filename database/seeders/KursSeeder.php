<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kurs;
class KursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kurs::create([
            'naziv' => 'Matematika',
            'opis' => 'Osnovni kurs iz matematike koji pokriva algebru, geometriju i aritmetiku.',
            'profesor_id' => 1
        ]);

        Kurs::create([
            'naziv' => 'Programiranje 1',
            'opis' => 'Uvod u programiranje koristeći jezike poput C i Python.',
            'profesor_id' => 2
        ]);

        Kurs::create([
            'naziv' => 'Statistika',
            'opis' => 'Osnovni principi statistike sa primenom u ekonomiji i društvenim naukama.',
            'profesor_id' => 3
        ]);

        Kurs::create([
            'naziv' => 'Teorija verovatnoće',
            'opis' => 'Matematički pristup verovatnoći i nasumičnim događajima.',
            'profesor_id' => 4
        ]);

        Kurs::create([
            'naziv' => 'Baze podataka',
            'opis' => 'Osnove dizajna baza podataka i SQL.',
            'profesor_id' => 5
        ]);
    }
}

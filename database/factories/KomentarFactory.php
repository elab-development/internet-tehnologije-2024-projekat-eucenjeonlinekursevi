<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Korisnik;
use App\Models\Kurs;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Komentar>
 */
class KomentarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tekst' => $this->faker->text(50),
            'korisnik_id' => Korisnik::inRandomOrder()->first()->id, 
            'kurs_id' => Kurs::inRandomOrder()->first()->id
        ];
    }
}

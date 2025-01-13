<?php
namespace Database\Factories;

use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class KorisnikFactory extends Factory
{
    protected $model = Korisnik::class;

    public function definition()
    {
        return [
            'ime' => $this->faker->firstName,
            'prezime' => $this->faker->lastName,
            'username' => $this->faker->unique()->userName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('lozinka123'),
        ];
    }
}

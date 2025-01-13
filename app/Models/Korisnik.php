<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/** @use HasFactory<\Database\Factories\KorisnikFactory> */
class Korisnik extends Model
{
    use HasFactory;

    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'username',
        'lozinka',
    ];

    protected $hidden = [
        'lozinka',
    ];

    protected function casts(): array
    {
        return [
            'lozinka' => 'hashed',
        ];
    }

    public function kursevi()
    {
        return $this->belongsToMany(Kurs::class);
    }

    public function komentari()
    {
        return $this->hasMany(Komentar::class);
    }
}

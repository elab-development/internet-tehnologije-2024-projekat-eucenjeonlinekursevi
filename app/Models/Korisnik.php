<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Korisnik extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;

    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
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

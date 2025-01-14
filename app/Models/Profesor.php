<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;


class Profesor extends Model
{
    use HasFactory;
    use HasApiTokens;
    
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
        return $this->hasMany(Kurs::class);
    }
}

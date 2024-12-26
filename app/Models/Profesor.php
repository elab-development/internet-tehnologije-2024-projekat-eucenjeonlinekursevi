<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/** @use HasFactory<\Database\Factories\ProfesorFactory> */
class Profesor extends Model
{
    use HasFactory;

    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'username',
        'password',
    ];

    public function kursevi()
    {
        return $this->hasMany(Kurs::class);
    }
}

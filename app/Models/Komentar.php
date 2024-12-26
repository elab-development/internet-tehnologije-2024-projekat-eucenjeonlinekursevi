<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Komentar extends Model
{
    use HasFactory;

    protected $fillable = [
        'tekst',
        'korisnik_id',
        'kurs_id',
    ];
    public function kurs(){
        return $this->belongsTo(Kurs::class);
    }
    public function korisnik(){
        return $this->belongsTo(Korisnik::class);
    }
}

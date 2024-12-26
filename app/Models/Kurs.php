<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Kurs extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'opis',
        'profesor_id',
    ];
    public function komentari(){
         return $this->hasMany(Komentar::class);
    }
    public function profesor(){
        return $this->belongsTo(Profesor::class);
    }
    public function korisnici(){
        return $this->belongsToMany(Korisnik::class);
    }
    protected $table = 'kurs';
}

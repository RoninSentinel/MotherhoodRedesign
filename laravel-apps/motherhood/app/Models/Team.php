<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'teams';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    protected $fillable = [
        'name',
        'squadron_id',
    ];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    public function flights() {
        return $this->hasMany(Flight::class);
    }

    public function squadron() {
        return $this->belongsTo(Squadron::class);
    }

}

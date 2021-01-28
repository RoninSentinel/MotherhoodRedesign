<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flight extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'flights';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];
    protected $with = ['team'];

    protected $fillable = [
        'name',
        'team_id',
        'squadron_id',
    ];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    public function team() {
        return $this->belongsTo(Team::class);
    }

    public function squadron() {
        return $this->belongsTo(Squadron::class);
    }

    public function crewMembers() {
        return $this->hasMany(CrewMember::class);
    }

}

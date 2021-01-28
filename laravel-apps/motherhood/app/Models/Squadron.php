<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Squadron extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'name';
    protected $keyType = 'string';
    public $incrementing = false;

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'name'
    ];

    // Would work without the following, but included for clarity.
    protected $table = 'squadrons'; 
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    public function lineTemplates() {
        return $this->hasMany(LineTemplate::class);
    }

    public function crewMembers() {
        return $this->hasMany(CrewMember::class);
    }

    public function blockCategories() {
        return $this->hasMany(BlockCategory::class);
    }

    public function shiftTemplates() {
        return $this->hasMany(ShiftTemplate::class);
    }

    public function teams() {
        return $this->hasMany(Team::class);
    }

    public function flights() {
        return $this->hasMany(Flight::class);
    }

    public function adminTokens() {
        return $this->hasMany(AdminToken::class);
    }


}

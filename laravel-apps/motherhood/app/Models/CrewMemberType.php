<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrewMemberType extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'crew_member_types';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $primaryKey = 'name';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name'
    ];

    public function qualificationTypes() {
        return $this->hasMany(QualificationType::class);
    }

    public function crewMembers() {
        return $this->hasMany(CrewMember::class);
    }
}

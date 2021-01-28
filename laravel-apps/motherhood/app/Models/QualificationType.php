<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QualificationType extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'qualification_types';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'name',
        'crew_member_type_id',
    ];

    public function crewMemberType() {
        return $this->belongsTo(CrewMemberType::class);
    }    

    public function qualifications() {
        return $this->hasMany(Qualifications::class);
    }
    
}

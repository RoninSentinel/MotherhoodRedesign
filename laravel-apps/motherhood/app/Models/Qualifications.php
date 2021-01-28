<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Qualifications extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'qualifications';
    protected $fillable = ['crew_member_id', 'qualification_type_id'];
    protected $with = ['qualificationType'];
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    public function crewMember() {
        return $this->belongsTo(CrewMember::class);
    }

    public function qualificationType() {
        return $this->belongsTo(QualificationType::class);
    }
}

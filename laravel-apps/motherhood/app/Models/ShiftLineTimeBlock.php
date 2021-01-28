<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShiftLineTimeBlock extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'shift_line_time_blocks';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];
    protected $with = ['blockCategory', 'crewMemberShiftLineTimeBlocks'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime'
    ];

    protected $fillable = [
        'id', 
        'line_instance_id',
        'block_category_id',
        'start_time',
        'end_time',
        'notes',
        'position',
        'mission_number',
    ];

    public function lineInstance() {
        return $this->belongsTo(LineInstance::class);
    }

    public function blockCategory() {
        return $this->belongsTo(BlockCategory::class);
    }

    public function crewMembers() {
        return $this->belongsToMany(CrewMember::class)->using(CrewMemberShiftLineTimeBlocks::class);
    }

    public function crewMemberShiftLineTimeBlocks() {
        return $this->hasMany(CrewMemberShiftLineTimeBlocks::class);
    }

}

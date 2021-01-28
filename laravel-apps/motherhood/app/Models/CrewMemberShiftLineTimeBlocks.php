<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\ShiftLineTimeBlock;

class CrewMemberShiftLineTimeBlocks extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'crew_member_shift_line_time_blocks'; 
    protected $fillable = ['id', 'crew_member_id', 'shift_line_time_block_id', 'position'];
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];
    protected $with = ['crewMember'];

    protected $casts = [
        'position' => 'integer',
    ];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    public function crewMember() {
        return $this->belongsTo(CrewMember::class);
    }

    public function shiftLineTimeBlock() {
        return $this->belongsTo(ShiftLineTimeBlock::class);
    }

}

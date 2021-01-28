<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrewMember extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'crew_members'; 
    protected $with = ['qualifications', 'flight'];
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'rank',
        'last_name',
        'first_name',
        'middle_initial',
        'call_sign',
        'squadron_id',
        'flight_id',
        'crew_member_type_id',

    ];

    public function squadron() {
        return $this->belongsTo(Squadron::class);
    }

    public function shiftLineTimeBlocks() {
        return $this->belongsToMany(ShiftLineTimeBlock::class)->using(CrewMemberShiftLineTimeBlocks::class);
    }

    public function flightOrders() {
        return $this->hasMany(FlightOrders::class);
    }

    public function flight() {
        return $this->belongsTo(Flight::class);
    }

    public function qualifications() {
        return $this->hasMany(Qualifications::class);
    }

}

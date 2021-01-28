<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlightOrders extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'flight_orders';
    protected $with = ['crewMember'];
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'crew_member_id',
        'date',
        'shift_template_instance_id',
        'total_hours_scheduled',
    ];

    public function crewMember() {
        return $this->belongsTo(CrewMember::class);
    }

    public function shiftTemplateInstance() {
        return $this->belongsTo(ShiftTemplateInstance::class);
    }

}

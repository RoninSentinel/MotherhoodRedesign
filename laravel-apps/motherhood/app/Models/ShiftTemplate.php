<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShiftTemplate extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'shift_templates';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean'
    ];

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'total_hours',
        'is_active',
        'squadron_id',

    ];

    public function shiftTemplateInstances() {
        return $this->hasMany(ShiftTemplateInstance::class);
    }

    public function squadron() {
        return $this->belongsTo(Squadron::class);
    }
}

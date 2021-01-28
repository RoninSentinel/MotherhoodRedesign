<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShiftTemplateInstance extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'shift_template_instances';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];
    protected $with = ['shiftTemplate', 'lineInstances'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'shift_template_id',
        'date',
    ];


    public function shiftTemplate() {
        return $this->belongsTo(ShiftTemplate::class);
    }

    public function lineInstances() {
        return $this->hasMany(LineInstance::class);
    }
}

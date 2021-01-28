<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LineInstance extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'line_instances';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];
    protected $fillable = ['line_template_id', 'shift_template_instance_id'];
    protected $with = ['lineTemplate', 'shiftLineTimeBlocks'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    public function lineTemplate() {
        return $this->belongsTo(LineTemplate::class);
    }

    public function shiftTemplateInstance() {
        return $this->belongsTo(ShiftTemplateInstance::class);
    }

    public function shiftLineTimeBlocks() {
        return $this->hasMany(ShiftLineTimeBlock::class);
    }

}
